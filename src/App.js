// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ImageUploader from './components/ImageUploader/ImageUploader';
import Auth from './components/Auth/Auth';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {!session ? (
        <Auth />
      ) : (
        <div>
          <header>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="sign-out-button"
            >
              Sign Out
            </button>
          </header>
          <ImageUploader userId={session.user.id} />
        </div>
      )}
    </div>
  );
}

export default App;