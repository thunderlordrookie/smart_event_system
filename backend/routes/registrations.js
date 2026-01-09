import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get registrations
router.get('/', async (req, res) => {
  try {
    const { event_id, user_id } = req.query;
    
    let query = supabase
      .from('event_registrations')
      .select(`
        *,
        user:users(full_name, email),
        event:events(title, event_date, event_time, location)
      `);
    
    if (event_id) {
      query = query.eq('event_id', event_id);
    } else if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Format the response
    const formatted = data.map(reg => ({
      ...reg,
      full_name: reg.user?.full_name,
      email: reg.user?.email,
      title: reg.event?.title,
      event_date: reg.event?.event_date,
      event_time: reg.event?.event_time,
      location: reg.event?.location
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register for an event
router.post('/', async (req, res) => {
  try {
    const { event_id, user_id } = req.body;
    
    // Check if already registered
    const { data: existing } = await supabase
      .from('event_registrations')
      .select('registration_id')
      .eq('event_id', event_id)
      .eq('user_id', user_id)
      .single();
    
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Already registered for this event'
      });
    }
    
    // Check capacity
    const { data: event } = await supabase
      .from('events')
      .select('capacity')
      .eq('event_id', event_id)
      .single();
    
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id);
    
    if (count >= event.capacity) {
      return res.status(400).json({
        success: false,
        error: 'Event is full'
      });
    }
    
    // Create registration
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id,
        user_id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Cancel registration
router.delete('/', async (req, res) => {
  try {
    const { registration_id } = req.query;
    
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('registration_id', registration_id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
