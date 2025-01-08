import { useState, useEffect } from 'react';
import { analyzeImageWithOpenAI } from '../../../../src/api';

export function useImageProcessing(saveToHistory) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [joke, setJoke] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('prompt');

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      setCameraPermission(result.state);
    } catch (error) {
      console.error('Camera permission check failed:', error);
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
      
      await saveToHistory(base64Image, response.description, response.joke);
      
      setStatus('');
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Error processing image. Please try again.');
      setStatus('');
    }
  };

  return {
    image,
    description,
    joke,
    status,
    error,
    cameraPermission,
    handleImageChange
  };
}