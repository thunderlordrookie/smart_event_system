# Smart Event System

A full-stack event management system built with React (frontend) and Node.js/Express with Supabase (backend).

## Features

- 🎫 Event creation and management
- 👥 User registration and authentication
- 📝 Event registration system
- ✅ Attendance tracking
- 💬 Feedback and ratings
- 🔐 Row Level Security (RLS) for data protection

## Tech Stack

### Frontend
- React 18
- React Router
- Vite

### Backend
- Node.js
- Express.js
- Supabase (PostgreSQL + Auth)

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm
- Supabase account (free tier works)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd smart_event_system
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up Supabase:**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the migration from `backend/supabase/migrations/001_initial_schema.sql`
   - Get your API keys from Supabase dashboard

4. **Configure environment:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your Supabase credentials
   ```

5. **Start the servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the app:**
   - Open [http://localhost:5173](http://localhost:5173)

## Documentation

- **[INSTALLATION.md](./INSTALLATION.md)** - Detailed installation guide
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase setup instructions
- **[SHARING_GUIDE.md](./SHARING_GUIDE.md)** - How to share this project with others
- **[QUICK_START.md](./QUICK_START.md)** - Quick troubleshooting guide

## Project Structure

```
smart_event_system/
├── backend/              # Node.js/Express backend
│   ├── config/          # Configuration files
│   ├── routes/          # API route handlers
│   ├── supabase/        # Database migrations
│   └── server.js        # Express server
├── frontend/            # React frontend
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       └── services/    # API services
└── docs/                # Documentation
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/users` - Get users
- `POST /api/users` - Register/Login
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please check the documentation files or open an issue in the repository.
