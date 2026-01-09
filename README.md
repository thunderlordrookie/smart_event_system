# Smart Event System - Backend API

Node.js backend API for the Smart Event System using Supabase as the database.

## Features

- RESTful API endpoints for events, users, registrations, attendance, and feedback
- Supabase integration for database and authentication
- Row Level Security (RLS) policies for data protection
- CORS enabled for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Then edit `.env` and add your Supabase credentials:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep secret!)

### 3. Run Database Migration

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the migration

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Users
- `GET /api/users` - Get all users or a specific user (`?user_id=...`)
- `POST /api/users` - Register or login user

### Events
- `GET /api/events` - Get all events, by organizer (`?organizer_id=...`), or specific event (`?event_id=...`)
- `POST /api/events` - Create a new event
- `PUT /api/events` - Update an event
- `DELETE /api/events` - Delete an event (`?event_id=...`)

### Registrations
- `GET /api/registrations` - Get registrations by event (`?event_id=...`) or user (`?user_id=...`)
- `POST /api/registrations` - Register for an event
- `DELETE /api/registrations` - Cancel registration (`?registration_id=...`)

### Attendance
- `GET /api/attendance` - Get attendance records (`?event_id=...`)
- `POST /api/attendance` - Mark attendance

### Feedback
- `GET /api/feedback` - Get feedback (`?event_id=...`)
- `POST /api/feedback` - Submit feedback

## Project Structure

```
backend/
├── config/
│   └── supabase.js       # Supabase client configuration
├── routes/
│   ├── users.js          # User routes
│   ├── events.js         # Event routes
│   ├── registrations.js  # Registration routes
│   ├── attendance.js     # Attendance routes
│   └── feedback.js       # Feedback routes
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── server.js             # Main server file
├── package.json          # Dependencies
└── .env                  # Environment variables (create from env.example)
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anon public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `PORT` | Server port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | No |

## Development

The server uses Express.js and the Supabase JavaScript client. All database operations go through Supabase, which handles authentication and Row Level Security automatically.

## Troubleshooting

- **Connection errors**: Verify your `.env` file has correct Supabase credentials
- **RLS errors**: Make sure you ran the database migration
- **CORS errors**: Update `ALLOWED_ORIGINS` in `.env` to include your frontend URL

For more detailed setup instructions, see `../SUPABASE_SETUP.md`.
