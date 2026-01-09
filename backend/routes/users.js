import express from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// Get all users or a specific user
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    let query = supabase
      .from('users')
      .select('user_id, full_name, email, role, phone, created_at');
    
    if (user_id) {
      query = query.eq('user_id', user_id).single();
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register a new user (creates auth user and profile)
router.post('/', async (req, res) => {
  try {
    const { action, full_name, email, password, role, phone } = req.body;
    
    if (action === 'register') {
      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name
        }
      });
      
      if (authError) throw authError;
      
      // Update user profile with additional info
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('users')
        .update({ 
          full_name,
          role: role || 'participant',
          phone: phone || null
        })
        .eq('auth_user_id', authData.user.id)
        .select('user_id, full_name, email, role, phone, created_at')
        .single();
      
      if (profileError) throw profileError;
      
      res.json({
        success: true,
        message: 'User registered successfully',
        user: profileData
      });
    } else {
      // Login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('user_id, full_name, email, role, phone, created_at')
        .eq('auth_user_id', authData.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      res.json({
        success: true,
        user: profileData,
        session: authData.session
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
