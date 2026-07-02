// Club Management System - Data Store
// Using a centralized store for state management
// Initial mock data for demonstration
export const initialMembers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    role: "admin",
    department: "Computer Science",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    joinedAt: "2024-01-15",
    status: "active",
    skills: ["Leadership", "Web Development", "Public Speaking"],
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "moderator",
    department: "Design",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    joinedAt: "2024-02-20",
    status: "active",
    skills: ["UI/UX Design", "Graphic Design", "Branding"],
  },
  {
    id: "3",
    name: "Michael Park",
    email: "michael.park@university.edu",
    role: "member",
    department: "Business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    joinedAt: "2024-03-10",
    status: "active",
    skills: ["Marketing", "Event Planning", "Finance"],
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@university.edu",
    role: "member",
    department: "Engineering",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    joinedAt: "2024-03-25",
    status: "active",
    skills: ["Machine Learning", "Python", "Data Analysis"],
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@university.edu",
    role: "moderator",
    department: "Computer Science",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    joinedAt: "2024-04-05",
    status: "active",
    skills: ["Backend Development", "Cloud Computing", "DevOps"],
  },
  {
    id: "6",
    name: "Olivia Brown",
    email: "olivia.brown@university.edu",
    role: "member",
    department: "Arts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    joinedAt: "2024-04-18",
    status: "inactive",
    skills: ["Photography", "Video Editing", "Content Creation"],
  },
];
export const initialEvents = [
  {
    id: "1",
    title: "Web Development Workshop",
    description:
      "Learn modern web development with React and Next.js. Perfect for beginners and intermediate developers.",
    date: "2026-02-15",
    time: "14:00",
    location: "Tech Hub - Room 301",
    type: "workshop",
    capacity: 50,
    registered: 42,
    status: "upcoming",
    organizer: "Alex Johnson",
  },
  {
    id: "2",
    title: "Annual Tech Hackathon",
    description:
      "48-hour coding competition with amazing prizes. Build innovative solutions for real-world problems.",
    date: "2026-02-22",
    time: "09:00",
    location: "Innovation Center",
    type: "hackathon",
    capacity: 200,
    registered: 156,
    status: "upcoming",
    organizer: "Sarah Chen",
  },
  {
    id: "3",
    title: "AI & Machine Learning Seminar",
    description:
      "Industry experts discuss the latest trends in AI and ML. Networking opportunities included.",
    date: "2026-03-01",
    time: "16:00",
    location: "Auditorium A",
    type: "seminar",
    capacity: 150,
    registered: 89,
    status: "upcoming",
    organizer: "Emma Wilson",
  },
  {
    id: "4",
    title: "Monthly Social Meetup",
    description:
      "Casual gathering for club members to network and socialize. Food and drinks provided.",
    date: "2026-02-10",
    time: "18:00",
    location: "Campus Cafe",
    type: "social",
    capacity: 80,
    registered: 65,
    status: "completed",
    organizer: "Michael Park",
  },
  {
    id: "5",
    title: "Cloud Computing Bootcamp",
    description:
      "Intensive 2-day bootcamp on AWS and cloud architecture. Certificate provided upon completion.",
    date: "2026-03-15",
    time: "10:00",
    location: "Tech Lab - Building B",
    type: "workshop",
    capacity: 40,
    registered: 28,
    status: "upcoming",
    organizer: "David Kim",
  },
];
export const initialAnnouncements = [
  {
    id: "1",
    title: "Welcome to Spring Semester 2026!",
    content:
      "We're excited to kick off another amazing semester. Check out our upcoming events and get involved!",
    author: "Alex Johnson",
    createdAt: "2026-02-01",
    priority: "high",
    category: "general",
  },
  {
    id: "2",
    title: "Hackathon Registration Now Open",
    content:
      "Don't miss out on our biggest event of the year! Register now to secure your spot.",
    author: "Sarah Chen",
    createdAt: "2026-02-02",
    priority: "high",
    category: "event",
  },
  {
    id: "3",
    title: "New Partnership with TechCorp",
    content:
      "We're thrilled to announce our new partnership that will bring exclusive workshops and internship opportunities.",
    author: "Alex Johnson",
    createdAt: "2026-01-28",
    priority: "medium",
    category: "achievement",
  },
  {
    id: "4",
    title: "Member of the Month: Emma Wilson",
    content:
      "Congratulations to Emma for her outstanding contributions to our AI/ML initiatives!",
    author: "Admin Team",
    createdAt: "2026-01-25",
    priority: "low",
    category: "achievement",
  },
];
export const clubStats = {
  totalMembers: 248,
  activeMembers: 186,
  upcomingEvents: 12,
  completedEvents: 45,
  totalAnnouncements: 34,
  monthlyGrowth: 12.5,
};
// Monthly activity data for charts
export const monthlyActivityData = [
  { month: "Sep", members: 120, events: 4, attendance: 340 },
  { month: "Oct", members: 145, events: 6, attendance: 520 },
  { month: "Nov", members: 168, events: 5, attendance: 480 },
  { month: "Dec", members: 185, events: 3, attendance: 290 },
  { month: "Jan", members: 220, events: 8, attendance: 680 },
  { month: "Feb", members: 248, events: 7, attendance: 590 },
];
export const departmentDistribution = [
  { name: "Computer Science", value: 85, color: "var(--chart-1)" },
  { name: "Engineering", value: 62, color: "var(--chart-2)" },
  { name: "Business", value: 45, color: "var(--chart-3)" },
  { name: "Design", value: 32, color: "var(--chart-4)" },
  { name: "Other", value: 24, color: "var(--chart-5)" },
];
export const eventTypeDistribution = [
  { type: "Workshop", count: 18 },
  { type: "Hackathon", count: 4 },
  { type: "Seminar", count: 12 },
  { type: "Meetup", count: 8 },
  { type: "Social", count: 6 },
];

