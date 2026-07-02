import { getDb } from '@/lib/db.jsx'
import { cookies } from 'next/headers'

const sql = neon(process.env.DATABASE_URL)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value
    
    if (!userId) {
      return Response.json({ user: null })
    }
    
    const users = await sql`
      SELECT u.*, c.name as club_name 
      FROM users u 
      LEFT JOIN clubs c ON u.club_id = c.id 
      WHERE u.id = ${userId}
    `
    
    if (users.length === 0) {
      return Response.json({ user: null })
    }
    
    const user = users[0]
    return Response.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        club_id: user.club_id,
        club_name: user.club_name,
        status: user.status
      }
    })
  } catch (error) {
    return Response.json({ user: null })
  }
}
