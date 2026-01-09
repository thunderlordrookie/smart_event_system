# How to Share and Run This Project

This guide will help you share this Smart Event System project with a friend or teammate so they can run it on their machine.

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning) - [Download here](https://git-scm.com/)
- **A Supabase account** (free tier works) - [Sign up here](https://supabase.com)

## Option 1: Share via Git Repository (Recommended)

### For the Person Sharing:

1. **Push to GitHub/GitLab/Bitbucket:**
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Smart Event System"
   
   # Create a repository on GitHub/GitLab and push
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Share the repository URL** with your friend

### For the Person Receiving:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd smart_event_system
   ```

2. **Follow the setup steps below**

## Option 2: Share as ZIP File

### For the Person Sharing:

1. **Create a ZIP file** of the entire project folder
2. **Exclude sensitive files:**
   - Don't include `backend/.env` (if it exists)
   - Don't include `node_modules/` folders
   - Don't include `.git/` folder

3. **Share the ZIP file** via email, cloud storage, etc.

### For the Person Receiving:

1. **Extract the ZIP file**
2. **Follow the setup steps below**

## Setup Instructions (For Your Friend)

### Step 1: Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

### Step 2: Set Up Supabase

Your friend needs to create their own Supabase project:

1. **Create a Supabase account** at [supabase.com](https://supabase.com)
2. **Create a new project:**
   - Click "New Project"
   - Name: `smart-event-system` (or any name)
   - Choose a strong database password (save it!)
   - Select a region
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

3. **Run the database migration:**
   - In Supabase Dashboard → **SQL Editor**
   - Click "New query"
   - Open the file: `backend/supabase/migrations/001_initial_schema.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

4. **Get API Keys:**
   - Go to **Settings** → **API**
   - Copy these values:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon public key** (under "Project API keys")
     - **service_role key** (under "Project API keys" - keep secret!)

### Step 3: Configure Environment Variables

1. **Create `.env` file in the backend directory:**
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Edit `.env` file** with your Supabase credentials:
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

### Step 4: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 Supabase connected: Yes
```

**Keep this terminal open!** The backend must be running for the frontend to work.

### Step 5: Start the Frontend Server

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 6: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

You should see the Smart Event System login page!

## Testing the Setup

1. **Test Backend Health:**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","message":"Smart Event System API is running"}`

2. **Register a New User:**
   - Click "Register" on the login page
   - Fill in the form
   - Submit
   - You should be redirected to login

3. **Login:**
   - Use the credentials you just created
   - You should be logged in successfully

## Troubleshooting

### Backend won't start
- ✅ Check that `.env` file exists in `backend/` directory
- ✅ Verify Supabase credentials in `.env` are correct
- ✅ Make sure Node.js is installed: `node --version`
- ✅ Ensure no other service is using port 3001

### Database connection errors
- ✅ Verify Supabase project is active (not paused)
- ✅ Check that migration was run successfully
- ✅ Double-check API keys in `.env` file

### Frontend can't connect to backend
- ✅ Make sure backend is running on port 3001
- ✅ Check browser console for specific errors
- ✅ Verify CORS settings in backend `.env`

### CORS errors
- ✅ Update `ALLOWED_ORIGINS` in backend `.env` to match your frontend URL
- ✅ Restart backend after changing `.env`

### Port already in use
If port 3001 is taken:
- Change `PORT=3001` to another port (e.g., `PORT=3002`) in backend `.env`
- Update frontend API URL if needed

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
│   ├── package.json
│   └── .env                      # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/               # Page components
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   └── ...
│   └── package.json
└── README.md
```

## Important Notes

1. **Each person needs their own Supabase project** - Don't share Supabase credentials in the repository
2. **Never commit `.env` files** - They contain sensitive keys
3. **Keep backend running** - The frontend depends on it
4. **Database migration is required** - Must run the SQL migration in Supabase

## Quick Command Reference

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd frontend && npm install

# Start backend (development)
cd backend && npm run dev

# Start frontend (development)
cd frontend && npm run dev

# Check Node.js version
node --version

# Check npm version
npm --version
```

## Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the error messages in the terminal
3. Check browser console for frontend errors
4. Verify all prerequisites are installed
5. Make sure Supabase project is active

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)

---

**Happy coding! 🚀**
