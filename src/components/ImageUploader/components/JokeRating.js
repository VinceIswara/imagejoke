import React, { useState } from 'react';
import './JokeRating.css';

function JokeRating({ rating, onRate, disabled }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="joke-rating">
      <p>Rate this joke:</p>
      <div 
        className="rating-stars"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star-button ${rating >= star ? 'filled' : ''} 
                      ${hoverRating >= star ? 'hover' : ''}`}
            onClick={() => {
              if (!disabled) {
                onRate(star);
                // Add temporary animation class
                const btn = document.querySelector(`button[data-star="${star}"]`);
                btn.classList.add('pop');
                setTimeout(() => btn.classList.remove('pop'), 300);
              }
            }}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            disabled={disabled}
            data-star={star}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default JokeRating; 