# 💍 Jewelry Visual Search

An AI-powered web application that lets users upload jewelry images and instantly find visually similar items from a product catalog using image embeddings and similarity search.

---

## ✨ Features

- Upload a jewelry image and find similar products
- Uses CLIP model (OpenAI) to generate image embeddings
- Stores and compares embeddings using MongoDB
- Fast similarity search using cosine similarity
- Full-stack project with React frontend, Node.js backend, and Python AI microservice

---

## 📸 Demo

> Coming soon! (Optional: Add a link to a hosted version or demo video)

---

## 🧠 Architecture Overview

```plaintext
[React Frontend] ---> [Node.js Backend API] ---> [Python Microservice with CLIP]
                             |
                             v
                        [MongoDB Embeddings]
