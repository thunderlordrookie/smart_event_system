-- Smart Event System Database Schema for Supabase
-- This migration creates all necessary tables for the event management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (using Supabase auth.users for authentication, this is a profile table)
CREATE TABLE IF NOT EXISTS public.users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'participant' CHECK (role IN ('organizer', 'participant', 'admin')),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    organizer_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    registration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
    feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_event ON public.attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user ON public.attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_event ON public.feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = auth_user_id);

-- RLS Policies for events table
CREATE POLICY "Anyone can view events"
    ON public.events FOR SELECT
    USING (true);

CREATE POLICY "Organizers can create events"
    ON public.events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE user_id = organizer_id
            AND auth_user_id = auth.uid()
            AND role IN ('organizer', 'admin')
        )
    );

CREATE POLICY "Organizers can update their own events"
    ON public.events FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE user_id = organizer_id
            AND auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Organizers can delete their own events"
    ON public.events FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE user_id = organizer_id
            AND auth_user_id = auth.uid()
        )
    );

-- RLS Policies for event_registrations table
CREATE POLICY "Users can view their own registrations"
    ON public.event_registrations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE user_id = event_registrations.user_id
            AND auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Organizers can view registrations for their events"
    ON public.event_registrations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.users u ON e.organizer_id = u.user_id
            WHERE e.event_id = event_registrations.event_id
            AND u.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can register for events"
    ON public.event_registrations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE user_id = event_registrations.user_id
            AND auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can cancel their own registrations"
    ON public.event_registrations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE user_id = event_registrations.user_id
            AND auth_user_id = auth.uid()
        )
    );

-- RLS Policies for attendance table
CREATE POLICY "Organizers can view attendance for their events"
    ON public.attendance FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.users u ON e.organizer_id = u.user_id
            WHERE e.event_id = attendance.event_id
            AND u.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own attendance"
    ON public.attendance FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE user_id = attendance.user_id
            AND auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Organizers can mark attendance"
    ON public.attendance FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.users u ON e.organizer_id = u.user_id
            WHERE e.event_id = attendance.event_id
            AND u.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Organizers can update attendance"
    ON public.attendance FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.users u ON e.organizer_id = u.user_id
            WHERE e.event_id = attendance.event_id
            AND u.auth_user_id = auth.uid()
        )
    );

-- RLS Policies for feedback table
CREATE POLICY "Anyone can view feedback"
    ON public.feedback FOR SELECT
    USING (true);

CREATE POLICY "Users can submit feedback for events they attended"
    ON public.feedback FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE user_id = feedback.user_id
            AND auth_user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM public.event_registrations
            WHERE event_id = feedback.event_id
            AND user_id = feedback.user_id
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (auth_user_id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
