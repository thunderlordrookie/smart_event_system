# Installation Guide - Smart Event System with Supabase

This guide will help you set up the complete Smart Event System with Supabase backend.

## Prerequisites

- Node.js (v18 or higher) - [Download](https://nodejs.org/)
- npm (comes with Node.js)
- A Supabase account (free tier works) - [Sign up](https://supabase.com)

## Step-by-Step Installation

### 1. Install Supabase CLI (Optional but Recommended)

```bash
npm install -g supabase
```

Or using Homebrew (macOS):
```bash
brew install supabase/tap/supabase
```

### 2. Set Up Supabase Project

#### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `smart-event-system`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

#### Option B: Using Supabase CLI

```bash
supabase login
supabase projects create smart-event-system
```

### 3. Run Database Migration

1. In Supabase Dashboard → **SQL Editor**
2. Click "New query"
3. Open `backend/supabase/migrations/001_initial_schema.sql`
4. Copy entire file content
5. Paste into SQL Editor
6. Click "Run" (or Ctrl+Enter)
7. Verify success message

### 4. Get API Keys

1. In Supabase Dashboard → **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep secret!)

### 5. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your Supabase credentials
# Use your preferred text editor:
nano .env
# or
code .env
```

Fill in `.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

PORT=3001
NODE_ENV=development

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 6. Start Backend Server

```bash
# From backend directory
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 Supabase connected: Yes
```

### 7. Set Up Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Create .env file for frontend (optional)
echo "VITE_API_BASE_URL=http://localhost:3001/api" > .env

# Start frontend dev server
npm run dev
```

### 8. Verify Installation

1. **Backend Health Check**:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","message":"Smart Event System API is running"}`

2. **Test User Registration**:
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

3. **Frontend**: Open `http://localhost:5173` in your browser

## Project Structure

```
smart_event_system/
├── backend/
│   ├── config/
│   │   └── supabase.js          # Supabase client
│   ├── routes/                   # API route handlers
│   ├── supabase/
│   │   └── migrations/          # Database migrations
│   ├── server.js                 # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js           # API client (updated for new backend)
│   │   └── ...
│   └── package.json
└── SUPABASE_SETUP.md            # Detailed Supabase guide
```

## Troubleshooting

### Backend won't start
- ✅ Check `.env` file exists and has correct values
- ✅ Verify Supabase project is active (not paused)
- ✅ Ensure Node.js version is 18+

### Database connection errors
- ✅ Verify Supabase URL and keys in `.env`
- ✅ Check that migration was run successfully
- ✅ Ensure Supabase project is not paused

### CORS errors
- ✅ Update `ALLOWED_ORIGINS` in backend `.env`
- ✅ Restart backend server after changing `.env`

### Frontend can't connect to backend
- ✅ Verify backend is running on port 3001
- ✅ Check `VITE_API_BASE_URL` in frontend `.env` (if using)
- ✅ Ensure CORS is configured correctly

## Next Steps

1. ✅ Test all API endpoints
2. ✅ Create your first user account
3. ✅ Create your first event
4. ✅ Test event registration
5. ✅ Set up authentication in frontend (optional - Supabase Auth)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review `SUPABASE_SETUP.md` for detailed setup
3. Check Supabase dashboard for database errors
4. Review backend logs for API errors
