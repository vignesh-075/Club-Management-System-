// MongoDB schemas and models for Club Management System

export const MemberSchema = {
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
  department: String,
  avatar: String,
  joined_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  skills: [String],
  phone: String,
  bio: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}

export const EventSchema = {
  title: String,
  description: String,
  event_date: Date,
  event_time: String,
  location: String,
  type: { type: String, enum: ['workshop', 'meetup', 'hackathon', 'seminar', 'social'], default: 'workshop' },
  capacity: { type: Number, default: 50 },
  registered: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  organizer: String,
  image: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}

export const AnnouncementSchema = {
  title: String,
  content: String,
  author: String,
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  category: { type: String, enum: ['general', 'event', 'urgent', 'achievement'], default: 'general' },
  is_pinned: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}

export const MessageSchema = {
  sender: String,
  recipient: String,
  subject: String,
  content: String,
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}

export const SettingsSchema = {
  key: { type: String, unique: true },
  value: String,
  description: String,
  updated_at: { type: Date, default: Date.now }
}

export const DashboardSchema = {
  total_members: { type: Number, default: 0 },
  active_members: { type: Number, default: 0 },
  upcoming_events: { type: Number, default: 0 },
  completed_events: { type: Number, default: 0 },
  total_announcements: { type: Number, default: 0 },
  monthly_growth: { type: Number, default: 0 },
  last_updated: { type: Date, default: Date.now }
}

export const UserSchema = {
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
  department: String,
  avatar: String,
  is_active: { type: Boolean, default: true },
  last_login: Date,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
