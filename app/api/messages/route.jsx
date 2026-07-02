import { getDb } from '@/lib/db.jsx'
import { cookies } from 'next/headers'

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get('club_id')
    
    if (!clubId) {
      return Response.json({ error: 'Club ID required' }, { status: 400 })
    }
    
    const messages = await sql`
      SELECT * FROM messages 
      WHERE club_id = ${clubId} 
      ORDER BY created_at ASC
    `
    
    return Response.json(messages)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value
    
    if (!userId) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { club_id, content } = await request.json()
    
    if (!club_id || !content) {
      return Response.json({ error: 'Club ID and content required' }, { status: 400 })
    }
    
    // Get user info
    const users = await sql`SELECT name, role FROM users WHERE id = ${userId}`
    if (users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    
    const user = users[0]
    
    const result = await sql`
      INSERT INTO messages (club_id, user_id, user_name, user_role, content)
      VALUES (${club_id}, ${userId}, ${user.name}, ${user.role}, ${content})
      RETURNING *
    `
    
    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
