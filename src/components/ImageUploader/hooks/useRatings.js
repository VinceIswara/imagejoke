import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../src/supabaseClient';

export function useRatings(userId) {
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  const loadRatings = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('history_id, rating')
        .eq('user_id', userId);

      if (error) throw error;

      const ratingsMap = {};
      data.forEach(item => {
        ratingsMap[item.history_id] = item.rating;
      });
      setRatings(ratingsMap);
    } catch (error) {
      console.error('Error loading ratings:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const rateJoke = async (historyId, rating) => {
    if (!userId || !historyId) return;

    try {
      // First, check if a rating exists
      const { data: existingRating } = await supabase
        .from('ratings')
        .select('id')
        .eq('user_id', userId)
        .eq('history_id', historyId)
        .single();

      let error;

      if (existingRating) {
        // Update existing rating
        const { error: updateError } = await supabase
          .from('ratings')
          .update({ rating })
          .eq('id', existingRating.id);
        error = updateError;
      } else {
        // Insert new rating
        const { error: insertError } = await supabase
          .from('ratings')
          .insert({
            user_id: userId,
            history_id: historyId,
            rating
          });
        error = insertError;
      }

      if (error) throw error;

      // Update local state
      setRatings(prev => ({
        ...prev,
        [historyId]: rating
      }));
    } catch (error) {
      console.error('Error rating joke:', error);
    }
  };

  return {
    ratings,
    rateJoke,
    loading
  };
} 