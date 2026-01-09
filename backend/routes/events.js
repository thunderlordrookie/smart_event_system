import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get all events, events by organizer, or a specific event
router.get('/', async (req, res) => {
  try {
    const { event_id, organizer_id } = req.query;
    
    let query = supabase
      .from('events')
      .select(`
        *,
        organizer:users(full_name)
      `)
      .order('event_date', { ascending: true });
    
    if (event_id) {
      query = query.eq('event_id', event_id).single();
    } else if (organizer_id) {
      query = query.eq('organizer_id', organizer_id);
    }
    
    const { data: events, error } = await query;
    
    if (error) throw error;
    
    // Get registration counts for each event
    const eventsWithCounts = await Promise.all(
      (Array.isArray(events) ? events : [events]).map(async (event) => {
        const { count } = await supabase
          .from('event_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.event_id);
        
        const current_participants = count || 0;
        const available_spots = event.capacity - current_participants;
        
        return {
          ...event,
          organizer_name: event.organizer?.full_name || '',
          event_datetime: `${event.event_date}T${event.event_time}`,
          current_participants,
          available_spots
        };
      })
    );
    
    res.json(Array.isArray(events) ? eventsWithCounts : eventsWithCounts[0]);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  try {
    const { title, description, event_date, event_time, location, organizer_id, capacity, category } = req.body;
    
    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        event_date,
        event_time,
        location,
        organizer_id,
        capacity,
        category
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Event created successfully',
      event_id: data.event_id
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update an event
router.put('/', async (req, res) => {
  try {
    const { event_id, title, description, event_date, event_time, location, capacity, category } = req.body;
    
    const { data, error } = await supabase
      .from('events')
      .update({
        title,
        description,
        event_date,
        event_time,
        location,
        capacity,
        category
      })
      .eq('event_id', event_id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete an event
router.delete('/', async (req, res) => {
  try {
    const { event_id } = req.query;
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('event_id', event_id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
