import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get attendance records
router.get('/', async (req, res) => {
  try {
    const { event_id } = req.query;
    
    let query = supabase
      .from('attendance')
      .select(`
        *,
        user:users(full_name, email),
        event:events(title)
      `);
    
    if (event_id) {
      query = query.eq('event_id', event_id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Format the response
    const formatted = data.map(att => ({
      ...att,
      full_name: att.user?.full_name,
      email: att.user?.email,
      event_title: att.event?.title
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark attendance
router.post('/', async (req, res) => {
  try {
    const { event_id, user_id, status } = req.body;
    
    // Check if already marked
    const { data: existing } = await supabase
      .from('attendance')
      .select('attendance_id')
      .eq('event_id', event_id)
      .eq('user_id', user_id)
      .single();
    
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('attendance')
        .update({
          status: status || 'present',
          check_in_time: new Date().toISOString()
        })
        .eq('attendance_id', existing.attendance_id)
        .select()
        .single();
      
      if (error) throw error;
      
      return res.json({
        success: true,
        message: 'Attendance updated successfully'
      });
    } else {
      // Create new
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          event_id,
          user_id,
          status: status || 'present'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return res.json({
        success: true,
        message: 'Attendance recorded successfully'
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
