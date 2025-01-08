import React from 'react';
import { supabase } from '../../supabaseClient';
import './Auth.css';

function Auth() {
  const handleLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Welcome to Image Joke Generator</h1>
      <div className="auth-buttons">
        <button onClick={() => handleLogin('google')}>
          Sign in with Google
        </button>
        {/* Add more providers if needed */}
      </div>
    </div>
  );
}

export default Auth; 