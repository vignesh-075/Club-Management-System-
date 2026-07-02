-- ClubSync Database Schema
-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS club_settings CASCADE;

-- Members table
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  department VARCHAR(255) NOT NULL DEFAULT '',
  avatar VARCHAR(500) DEFAULT '',
  joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  skills TEXT[] DEFAULT '{}',
  phone VARCHAR(50) DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL DEFAULT '',
  type VARCHAR(20) NOT NULL DEFAULT 'workshop' CHECK (type IN ('workshop', 'meetup', 'hackathon', 'seminar', 'social')),
  capacity INTEGER NOT NULL DEFAULT 50,
  registered INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  organizer VARCHAR(255) DEFAULT '',
  image VARCHAR(500) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL DEFAULT 'Admin',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  category VARCHAR(20) NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'event', 'urgent', 'achievement')),
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Club Settings table
CREATE TABLE club_settings (
  id SERIAL PRIMARY KEY,
  club_name VARCHAR(255) NOT NULL DEFAULT 'Tech Enthusiasts Club',
  description TEXT DEFAULT '',
  website VARCHAR(500) DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  founded_year VARCHAR(10) DEFAULT '2020',
  admin_name VARCHAR(255) DEFAULT 'Alex Johnson',
  admin_email VARCHAR(255) DEFAULT 'alex.johnson@university.edu',
  admin_phone VARCHAR(50) DEFAULT '+1 234 567 8900',
  admin_bio TEXT DEFAULT '',
  notifications_email BOOLEAN DEFAULT TRUE,
  notifications_event_reminders BOOLEAN DEFAULT TRUE,
  notifications_member_joins BOOLEAN DEFAULT TRUE,
  notifications_announcements BOOLEAN DEFAULT TRUE,
  notifications_weekly_digest BOOLEAN DEFAULT FALSE,
  notifications_marketing BOOLEAN DEFAULT FALSE,
  privacy_public_profile BOOLEAN DEFAULT TRUE,
  privacy_show_email BOOLEAN DEFAULT FALSE,
  privacy_show_phone BOOLEAN DEFAULT FALSE,
  privacy_allow_dm BOOLEAN DEFAULT TRUE,
  theme VARCHAR(20) DEFAULT 'dark',
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC-5',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_role ON members(role);
CREATE INDEX idx_members_department ON members(department);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_announcements_category ON announcements(category);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_created ON announcements(created_at DESC);
