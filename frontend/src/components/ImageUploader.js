// src/components/ImageUploader.js
import React, { useState, useRef } from 'react';

const ImageUploader = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
        onImageUpload(file);
      }
    }
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="image-uploader">
      <div 
        className="upload-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Upload preview" className="image-preview" />
            <p>Click or drop to change image</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📷</div>
            <p>Click or drag an image here</p>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="file-input"
        />
      </div>
    </div>
  );
};

export default ImageUploader;