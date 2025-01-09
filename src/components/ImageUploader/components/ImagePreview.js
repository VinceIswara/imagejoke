import React from 'react';
import './ImagePreview.css';

function ImagePreview({ image, description, joke }) {
  return (
    <div className="preview-container">
      {image && (
        <div className="preview-card">
          <h3>Preview</h3>
          <img 
            src={image} 
            alt="Preview" 
            className="preview-image"
          />
        </div>
      )}

      {description && (
        <div className="description-card">
          <h3>Description</h3>
          <p>{description}</p>
        </div>
      )}

      {joke && (
        <div className="joke-card">
          <h3>🎭 Generated Joke</h3>
          <p className="joke-text">{joke}</p>
        </div>
      )}
    </div>
  );
}

export default ImagePreview;