# Quick Start - Fix Connection Error

## The Problem
You're getting `ERR_CONNECTION_REFUSED` because:
1. The frontend was still trying to use the old PHP backend
2. The new Node.js backend needs to be running

## The Solution

### Step 1: Make sure you've run the database migration
If you haven't already, go to your Supabase dashboard → SQL Editor and run the migration from `backend/supabase/migrations/001_initial_schema.sql`

### Step 2: Install backend dependencies
```bash
cd backend
npm install
```

### Step 3: Start the backend server
```bash
# From the backend directory
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 Supabase connected: Yes
```

### Step 4: Keep the backend running
**Important**: Keep this terminal window open and the backend running while you use the frontend.

### Step 5: Start the frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

### Step 6: Test registration
Now try registering a user again. It should work!

## What Was Fixed

✅ Updated `AuthContext.jsx` to use the new API endpoints  
✅ Created `.env` file with your Supabase credentials  
✅ Frontend now points to `http://localhost:3001/api` instead of the old PHP endpoints

## Troubleshooting

**If you still get connection errors:**
1. Make sure the backend is running on port 3001
2. Check that `.env` file exists in the `backend` directory with correct credentials
3. Verify Supabase project is active (not paused)
4. Check browser console for specific error messages

**If you get CORS errors:**
- Make sure `ALLOWED_ORIGINS` in `.env` includes your frontend URL (usually `http://localhost:5173`)
