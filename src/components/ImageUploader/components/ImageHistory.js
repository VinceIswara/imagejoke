import React, { useState } from 'react';
import Modal from './Modal';
import JokeRating from './JokeRating';
import { useRatings } from '../hooks/useRatings';

function ImageHistory({ history, clearHistory, userId }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const { ratings, rateJoke } = useRatings(userId);

  if (!history.length) return null;

  return (
    <div className="history-container">
      <h3>History</h3>
      <button onClick={clearHistory}>Clear History</button>
      <div className="history-items">
        {history.map((item, index) => (
          <div key={index} className="history-item">
            <img 
              src={item.image_url} 
              alt="Historical" 
              style={{ width: '100px', cursor: 'pointer' }} 
              onClick={() => setSelectedImage(item)}
            />
            <div className="history-content">
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Joke:</strong> {item.joke}</p>
              <JokeRating
                rating={ratings[item.id] || 0}
                onRate={(rating) => rateJoke(item.id, rating)}
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
          <div className="modal-image-container">
            <img 
              src={selectedImage.image_url} 
              alt={selectedImage.description} 
            />
            <div className="modal-image-details">
              <p><strong>Description:</strong> {selectedImage.description}</p>
              <p><strong>Joke:</strong> {selectedImage.joke}</p>
              <JokeRating
                rating={ratings[selectedImage.id] || 0}
                onRate={(rating) => rateJoke(selectedImage.id, rating)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ImageHistory;