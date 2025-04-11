// src/App.js
import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ResultsGrid from './components/ResultsGrid';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (imageFile) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      console.error('Error during search:', err);
      setError('Failed to search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jewelry Visual Search</h1>
        <p>Upload an image to find similar jewelry items</p>
      </header>
      
      <main>
        <ImageUploader onImageUpload={handleImageUpload} />
        
        {loading && <div className="loading">Searching for similar items...</div>}
        {error && <div className="error">{error}</div>}
        
        {results.length > 0 && (
          <div className="results-container">
            <h2>Similar Items Found</h2>
            <ResultsGrid results={results} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;