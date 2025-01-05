// src/components/History.js
import React from 'react';

function History({ items, onClear }) {
  if (items.length === 0) return null;

  return (
    <div className="history-container">
      <h3>History</h3>
      <button onClick={onClear}>Clear History</button>
      <div className="history-items">
        {items.map((item, index) => (
          <div key={index} className="history-item">
            <img src={item.imageUrl} alt="Historical" style={{ width: '100px' }} />
            <div className="history-content">
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Joke:</strong> {item.joke}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;