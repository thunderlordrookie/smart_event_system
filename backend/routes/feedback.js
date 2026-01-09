import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get feedback
router.get('/', async (req, res) => {
  try {
    const { event_id } = req.query;
    
    let query = supabase
      .from('feedback')
      .select(`
        *,
        user:users(full_name),
        event:events(title)
      `)
      .order('created_at', { ascending: false });
    
    if (event_id) {
      query = query.eq('event_id', event_id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Format the response
    const formatted = data.map(fb => ({
      ...fb,
      full_name: fb.user?.full_name,
      event_title: fb.event?.title
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { event_id, user_id, rating, comment } = req.body;
    
    // Check if feedback already exists
    const { data: existing } = await supabase
      .from('feedback')
      .select('feedback_id')
      .eq('event_id', event_id)
      .eq('user_id', user_id)
      .single();
    
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Feedback already submitted for this event'
      });
    }
    
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        event_id,
        user_id,
        rating,
        comment
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
