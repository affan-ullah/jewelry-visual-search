# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import torch
import clip
from PIL import Image
import io
import numpy as np

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

@app.get("/")
def read_root():
    return {"message": "Jewelry Visual Search AI Service"}

@app.post("/generate-embedding")
async def generate_embedding(file: UploadFile = File(...)):
    # Read the image file
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Preprocess the image and generate embedding
    with torch.no_grad():
        image_input = preprocess(image).unsqueeze(0).to(device)
        image_features = model.encode_image(image_input)
        
        # Normalize the features
        image_features /= image_features.norm(dim=-1, keepdim=True)
        
        # Convert to list for JSON serialization
        embedding = image_features.cpu().numpy().tolist()[0]
    
    return {"embedding": embedding}