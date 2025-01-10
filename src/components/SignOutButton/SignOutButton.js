import React from 'react';
import { supabase } from '../../supabaseClient';

function SignOutButton() {
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Use environment variable for redirect
      window.location.href = process.env.REACT_APP_BASE_URL || '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button 
      onClick={handleSignOut}
      className="button-primary"
      type="button"
    >
      Sign Out
    </button>
  );
}

export default SignOutButton; 