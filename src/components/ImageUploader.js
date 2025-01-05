// src/components/ImageUploader.js
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { analyzeImageWithOpenAI } from '../api';
import './ImageUploader.css';

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [joke, setJoke] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [cameraPermission, setCameraPermission] = useState('prompt');
  const [userId] = useState(() => 
    localStorage.getItem('userId') || Math.random().toString(36).substr(2, 9)
  );

  const loadHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, [userId]);

  useEffect(() => {
    checkCameraPermission();
    localStorage.setItem('userId', userId);
    loadHistory();
  }, [userId, loadHistory]);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      setCameraPermission(result.state);
    } catch (error) {
      console.error('Camera permission check failed:', error);
    }
  };

  const saveToHistory = async (imageUrl, description, joke) => {
    try {
      const { error } = await supabase
        .from('history')
        .insert([
          {
            user_id: userId,
            image_url: imageUrl,
            description,
            joke
          }
        ]);

      if (error) throw error;
      loadHistory(); // Reload history after saving
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setStatus('Compressing image...');
      setError(null);
      setDescription('');
      setJoke('');

      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      setImage(base64Image);
      
      setStatus('Analyzing image and generating joke...');
      const response = await analyzeImageWithOpenAI(file);
      setDescription(response.description);
      setJoke(response.joke);
      
      // Save to history
      await saveToHistory(base64Image, response.description, response.joke);
      
      setStatus('');
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Error processing image. Please try again.');
      setStatus('');
    }
  };

  const clearHistory = async () => {
    try {
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <div className="image-uploader">
      <h2>Image Joke Generator</h2>
      
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

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="file-input"
        onChange={handleImageChange}
        aria-label="Upload image"
        multiple={false}
      />

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

      {history.length > 0 && (
        <div className="history-container">
          <h3>History</h3>
          <button onClick={clearHistory}>Clear History</button>
          <div className="history-items">
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <img src={item.image_url} alt="Historical" style={{ width: '100px' }} />
                <div className="history-content">
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Joke:</strong> {item.joke}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;