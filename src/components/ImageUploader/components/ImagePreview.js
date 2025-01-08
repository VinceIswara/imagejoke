import React from 'react';

function ImagePreview({ image, description, joke }) {
  return (
    <div>
      {image && (
        <div>
          <h3>Preview:</h3>
          <img 
            src={image} 
            alt="Preview" 
            style={{ width: '300px', height: 'auto' }} 
          />
        </div>
      )}

      {description && (
        <div>
          <h3>Description:</h3>
          <p>{description}</p>
        </div>
      )}

      {joke && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '8px' 
        }}>
          <h3>🎭 Here's a joke based on your image:</h3>
          <p style={{ 
            fontSize: '1.1em', 
            fontStyle: 'italic' 
          }}>{joke}</p>
        </div>
      )}
    </div>
  );
}

export default ImagePreview;