import React from 'react';
import { supabase } from '../../supabaseClient';
import './Auth.css';

function Auth() {
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.REACT_APP_BASE_URL,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="auth-container card">
      <h1 className="title">Image Joke Generator</h1>
      <button 
        onClick={handleGoogleSignIn}
        className="button-primary"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Auth; 