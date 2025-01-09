import React, { useState } from 'react';
import Modal from './Modal';
import JokeRating from './JokeRating';
import { useRatings } from '../hooks/useRatings';
import './ImageHistory.css';

function ImageHistory({ history, clearHistory, userId }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const { ratings, rateJoke } = useRatings(userId);

  if (!history.length) return null;

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>History</h3>
        <button onClick={clearHistory}
          className="button-secondary"
        >Clear History</button>
      </div>

      <div className="history-grid">
        {history.map((item, index) => (
          <div key={index} className="history-card">
            <img 
              src={item.image_url} 
              alt="Historical" 
              className="history-image"
              onClick={() => setSelectedImage(item)}
            />
            <div className="history-content">
              <p className="description-text">{item.description}</p>
              <p className="joke-text">{item.joke}</p>
              <JokeRating
                rating={ratings[item.id] || 0}
                onRate={(rating) => rateJoke(item.id, rating)}
                disabled={false}
              />
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)}
      >
        {selectedImage && (
          <div className="modal-content">
            <img 
              src={selectedImage.image_url} 
              alt={selectedImage.description} 
            />
            <div className="modal-details">
              <p className="description-text">{selectedImage.description}</p>
              <p className="joke-text">{selectedImage.joke}</p>
              <JokeRating
                rating={ratings[selectedImage.id] || 0}
                onRate={(rating) => rateJoke(selectedImage.id, rating)}
                disabled={false}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ImageHistory;