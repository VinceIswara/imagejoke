import React from 'react';
import ImageHistory from './components/ImageHistory';
import ImagePreview from './components/ImagePreview';
import StatusMessage from './components/StatusMessage';
import { useHistory } from './hooks/useHistory';
import { useImageProcessing } from './hooks/useImageProcessing';
import './ImageUploader.css';

function ImageUploader({ userId }) {
  const { history, saveToHistory, clearHistory } = useHistory(userId);
  const {
    image,
    description,
    joke,
    status,
    error,
    cameraPermission,
    handleImageChange
  } = useImageProcessing(saveToHistory);

  return (
    <div className="image-uploader">
      <div className="header">
        <h2 className="title">Image Joke Generator</h2>
      </div>
      
      <StatusMessage 
        status={status}
        error={error}
        cameraPermission={cameraPermission}
      />

      <label className="file-input-container">
        <div className="upload-icon">📸</div>
        <p>Click or drag image here</p>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="file-input"
          onChange={handleImageChange}
          aria-label="Upload image"
          multiple={false}
        />
      </label>

      <ImagePreview 
        image={image}
        description={description}
        joke={joke}
      />

      <ImageHistory 
        history={history} 
        clearHistory={clearHistory}
        userId={userId}
      />
    </div>
  );
}

export default ImageUploader;