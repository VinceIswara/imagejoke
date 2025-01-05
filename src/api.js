// src/api.js
import { supabase } from './supabaseClient';
import imageCompression from 'browser-image-compression';

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

const compressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1024,
  useWebWorker: true
};

const compressImage = async (file) => {
  try {
    // Check file size before compression
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error('Image size too large. Please use an image under 4MB.');
    }

    const compressedFile = await imageCompression(file, compressionOptions);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

export const analyzeImageWithOpenAI = async (imageFile) => {
  try {
     // Validate file type
     if (!imageFile.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image.');
    }
    // Compress image first
    const compressedImage = await compressImage(imageFile);
    
    // Convert to base64
    const base64Image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(compressedImage);
    });

    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: { image: base64Image }
    });

    if (error) {
      console.error('Supabase Function Error:', error);
      throw error;
    }

    if (!data || !data.description || !data.joke) {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response from server');
    }

    console.log('Response from Edge Function:', data);

    return {
      description: data.description,
      joke: data.joke
    };
  } catch (error) {
    console.error('Error in analyzeImageWithOpenAI:', error);
    throw error;
  }
};