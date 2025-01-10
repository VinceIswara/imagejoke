// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ImageUploader from './components/ImageUploader/ImageUploader';
import SignOutButton from './components/SignOutButton/SignOutButton';
import Auth from './components/Auth/Auth';
import './styles/variables.css';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setNetworkError(null);
    };
    
    const handleOffline = () => {
      setNetworkError('Your internet connection appears to be offline.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkAuth = async (retries = 3) => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        if (retries > 0) {
          setTimeout(() => checkAuth(retries - 1), 2000);
        } else {
          setNetworkError('Unable to connect to the server. Please check your connection.');
          setLoading(false);
        }
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (networkError) {
    return (
      <div className="App">
        <div className="container">
          <div className="network-error card">
            <h2>Connection Error</h2>
            <p>{networkError}</p>
            <button 
              onClick={() => window.location.href = process.env.REACT_APP_BASE_URL}
              className="button-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="App">
        <div className="container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        {!session ? (
          <Auth />
        ) : (
          <div className="card">
            <header className="header">
              <SignOutButton />
            </header>
            <ImageUploader userId={session.user.id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;