import { getDb } from '@/lib/db.jsx'

const sql = neon(process.env.DATABASE_URL)

// GET - Fetch inbox messages for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')
    
    if (!userId && !email) {
      return Response.json({ error: 'User ID or email required' }, { status: 400 })
    }
    
    let messages = []
    if (userId) {
      messages = await sql`
        SELECT * FROM inbox 
        WHERE user_id = ${parseInt(userId)} 
        ORDER BY created_at DESC
      `
    } else if (email) {
      messages = await sql`
        SELECT * FROM inbox 
        WHERE user_email = ${email} 
        ORDER BY created_at DESC
      `
    }
    
    return Response.json({ messages })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST - Send notification to inbox
export async function POST(request) {
  try {
    const { clubId, subject, message, fromName } = await request.json()
    
    if (!subject || !message) {
      return Response.json({ error: 'Subject and message required' }, { status: 400 })
    }
    
    // Get club info
    let clubName = 'ClubSync'
    if (clubId) {
      const clubs = await sql`SELECT name FROM clubs WHERE id = ${parseInt(clubId)}`
      clubName = clubs[0]?.name || 'ClubSync'
    }
    
    // Get all members of the club
    let members = []
    if (clubId) {
      members = await sql`
        SELECT id, email, name FROM users 
        WHERE club_id = ${parseInt(clubId)} AND status = 'approved'
      `
    } else {
      // Send to all approved users if no clubId
      members = await sql`
        SELECT id, email, name FROM users WHERE status = 'approved'
      `
    }
    
    // Insert message into inbox for each member
    let count = 0
    for (const member of members) {
      await sql`
        INSERT INTO inbox (user_id, user_email, subject, message, from_name, club_name)
        VALUES (${member.id}, ${member.email}, ${subject}, ${message}, ${fromName || 'Club Admin'}, ${clubName})
      `
      count++
    }
    
    return Response.json({ 
      success: true, 
      message: `Notification sent to ${count} members`,
      count 
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
