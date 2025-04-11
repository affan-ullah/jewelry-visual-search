// src/components/ResultsGrid.js
import React from 'react';

const ResultsGrid = ({ results }) => {
  return (
    <div className="results-grid">
      {results.map((item, index) => (
        <div key={index} className="result-item">
          <img src={item.imageUrl} alt={`Similar item ${index + 1}`} />
          <div className="similarity-score">
            Similarity: {Math.round(item.similarity * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsGrid;

