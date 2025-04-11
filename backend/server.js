// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI - update with your actual connection string
const MONGO_URI = '';
let jewelryCollection;

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(); // This will use the database from your connection string
    jewelryCollection = db.collection('products'); // Use your existing collection
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

// API route for image search
app.post('/api/search', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Path to the uploaded image
    const imagePath = req.file.path;

    // Send image to FastAPI service for embedding generation
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));
    
    const embeddingResponse = await axios.post(
      'http://localhost:8000/generate-embedding',
      formData, 
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    
    const queryEmbedding = embeddingResponse.data.embedding;
    
    // Search the existing MongoDB collection with precomputed embeddings
    // Calculate cosine similarity with vector math
    const similarItems = await jewelryCollection.aggregate([
      {
        $addFields: {
          similarity: {
            $reduce: {
              input: { $zip: { inputs: ["$embedding", queryEmbedding] } },
              initialValue: 0,
              in: { $add: ["$$value", { $multiply: [{ $arrayElemAt: ["$$this", 0] }, { $arrayElemAt: ["$$this", 1] }] }] }
            }
          }
        }
      },
      { $sort: { similarity: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          imageUrl: 1, // Uses your existing Cloudinary URLs
          similarity: 1
        }
      }
    ]).toArray();
    
    // Remove the uploaded file after processing
    fs.unlinkSync(imagePath);
    
    res.json({ results: similarItems });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start the server
app.listen(PORT, async () => {
  await connectToMongo();
  console.log(`Server running on port ${PORT}`);
});