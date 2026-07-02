import { getDb } from '@/lib/db.jsx'

const sql = neon(process.env.DATABASE_URL)

export async function GET() {
  try {
    const [
      totalMembers,
      activeMembers,
      totalEvents,
      upcomingEvents,
      completedEvents,
      totalAnnouncements,
      recentMembers,
      upcomingEventsList,
      recentAnnouncements,
      membersByDepartment,
      membersByRole,
    ] = await Promise.all([
      sql`SELECT count(*) as count FROM members`,
      sql`SELECT count(*) as count FROM members WHERE status = 'active'`,
      sql`SELECT count(*) as count FROM events`,
      sql`SELECT count(*) as count FROM events WHERE status = 'upcoming'`,
      sql`SELECT count(*) as count FROM events WHERE status = 'completed'`,
      sql`SELECT count(*) as count FROM announcements`,
      sql`SELECT id, name, email, role, department, avatar, status, joined_at FROM members ORDER BY joined_at DESC LIMIT 5`,
      sql`SELECT id, title, event_date, event_time, location, type, capacity, registered, status, organizer FROM events WHERE status = 'upcoming' ORDER BY event_date ASC LIMIT 5`,
      sql`SELECT id, title, content, author, priority, category, is_pinned, created_at FROM announcements ORDER BY created_at DESC LIMIT 4`,
      sql`SELECT department, count(*) as count FROM members WHERE department != '' GROUP BY department ORDER BY count DESC`,
      sql`SELECT role, count(*) as count FROM members GROUP BY role`,
    ])

    const stats = {
      totalMembers: Number(totalMembers[0].count),
      activeMembers: Number(activeMembers[0].count),
      totalEvents: Number(totalEvents[0].count),
      upcomingEvents: Number(upcomingEvents[0].count),
      completedEvents: Number(completedEvents[0].count),
      totalAnnouncements: Number(totalAnnouncements[0].count),
      growthRate: 12.5,
    }

    return Response.json({
      stats,
      recentMembers,
      upcomingEvents: upcomingEventsList,
      recentAnnouncements,
      membersByDepartment,
      membersByRole,
    })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
