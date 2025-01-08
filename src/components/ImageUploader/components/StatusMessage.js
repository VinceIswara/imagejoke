import React from 'react';

function StatusMessage({ status, error, cameraPermission }) {
  return (
    <>
      {cameraPermission === 'denied' && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          ⚠️ Please enable camera access in your browser settings to use this feature.
        </div>
      )}

      {status && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="status-text">{status}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '10px', color: 'red' }}>
          Error: {error}
        </div>
      )}
    </>
  );
}

export default StatusMessage;