import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../src/supabaseClient';

export function useHistory(userId) {
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    if (!userId) return;

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

  const saveToHistory = async (imageUrl, description, joke) => {
    if (!userId) return;

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
      loadHistory();
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const clearHistory = async () => {
    if (!userId) return;

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

  useEffect(() => {
    loadHistory();
  }, [userId, loadHistory]);

  return {
    history,
    saveToHistory,
    clearHistory
  };
}