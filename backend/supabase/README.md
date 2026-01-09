# Supabase Database Setup

This directory contains the SQL migration files for setting up your Supabase database.

## Quick Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up or log in
   - Create a new project
   - Wait for the project to be provisioned

2. **Run the Migration**
   - In your Supabase dashboard, go to the SQL Editor
   - Copy and paste the contents of `migrations/001_initial_schema.sql`
   - Click "Run" to execute the migration

3. **Get Your API Keys**
   - Go to Project Settings > API
   - Copy your:
     - Project URL
     - `anon` public key (for client-side)
     - `service_role` key (for server-side, keep this secret!)

4. **Configure Environment Variables**
   - Copy `.env.example` to `.env` in the backend directory
   - Fill in your Supabase credentials

## Database Schema

The migration creates the following tables:

- **users**: User profiles linked to Supabase auth
- **events**: Event information
- **event_registrations**: User registrations for events
- **attendance**: Attendance tracking
- **feedback**: Event feedback and ratings

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- Users can only access their own data
- Organizers can manage their events
- Public read access for events and feedback

## Notes

- The migration uses UUIDs for all primary keys
- User authentication is handled by Supabase Auth
- The `handle_new_user()` function automatically creates a user profile when someone signs up
- All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
