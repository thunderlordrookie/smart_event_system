# Supabase Setup Guide for Smart Event System

This guide will walk you through setting up Supabase for your Smart Event System project.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (free tier is sufficient)

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: smart-event-system (or your preferred name)123456789@smart_event
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to you
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be provisioned

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New query"
3. Open the file `backend/supabase/migrations/001_initial_schema.sql` from this project
4. Copy the entire contents of the file
5. Paste it into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

This migration will create:
- All necessary tables (users, events, event_registrations, attendance, feedback)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic profile creation

## Step 3: Get Your API Keys

1. In the Supabase dashboard, go to **Settings** > **API**
2. You'll need these values:
   - **Project URL**: Found under "Project URL" https://wvrmgxdfzjutcbsqbmgp.supabase.co
   - **anon public key**: Found under "Project API keys" > "anon" > "public" sb_publishable_Cm9IST0qkvC7mAqQ6hmPIA_J5KNWRHs
   - **service_role key**: Found under "Project API keys" > "service_role" > "secret" (⚠️ Keep this secret!) sb_secret_j8K6APcQwQfjzKvqMlaDXQ_Hk6UN8Yt

## Step 4: Install Backend Dependencies

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Step 5: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   PORT=3001
   NODE_ENV=development
   
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

   Replace:
   - `your-project-id` with your actual Supabase project ID
   - `your_anon_key_here` with your anon public key
   - `your_service_role_key_here` with your service_role secret key

## Step 6: Start the Backend Server

1. Make sure you're in the `backend` directory
2. Start the development server:
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

3. You should see:
   ```
   🚀 Server running on http://localhost:3001
   📊 Supabase connected: Yes
   ```

## Step 7: Update Frontend Configuration

The frontend is already configured to use the API endpoints. Make sure your frontend is pointing to the correct backend URL.

If your frontend runs on a different port, update the `ALLOWED_ORIGINS` in your `.env` file.

## Step 8: Test the Setup

1. Test the health endpoint:
   ```bash
   curl http://localhost:3001/health
   ```

   Should return:
   ```json
   {"status":"ok","message":"Smart Event System API is running"}
   ```

2. Test user registration (you can use Postman or curl):
   ```bash
   curl -X POST http://localhost:3001/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "action": "register",
       "full_name": "Test User",
       "email": "test@example.com",
       "password": "testpassword123",
       "role": "participant"
     }'
   ```

## API Endpoints

Your backend now provides the following endpoints:

- `GET /health` - Health check
- `GET /api/users` - Get users
- `POST /api/users` - Register/Login user
- `GET /api/events` - Get events
- `POST /api/events` - Create event
- `PUT /api/events` - Update event
- `DELETE /api/events` - Delete event
- `GET /api/registrations` - Get registrations
- `POST /api/registrations` - Register for event
- `DELETE /api/registrations` - Cancel registration
- `GET /api/attendance` - Get attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/feedback` - Get feedback
- `POST /api/feedback` - Submit feedback

## Troubleshooting

### Connection Issues

- Verify your `.env` file has the correct Supabase URL and keys
- Check that your Supabase project is active (not paused)
- Ensure you're using the correct region

### RLS Policy Errors

- Make sure you ran the migration SQL completely
- Check that RLS policies are enabled in the Supabase dashboard
- Verify user authentication is working

### CORS Errors

- Update `ALLOWED_ORIGINS` in `.env` to include your frontend URL
- Restart the backend server after changing `.env`

## Next Steps

1. Update your frontend to use the new backend endpoints
2. Test all functionality
3. Set up authentication in your frontend using Supabase Auth
4. Deploy your backend to a hosting service (Vercel, Railway, etc.)
5. Update your frontend API configuration for production

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
