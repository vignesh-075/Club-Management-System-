import { getDb } from '@/lib/db.jsx'

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    let members
    if (search) {
      members = await sql`SELECT * FROM members WHERE name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'} ORDER BY created_at DESC`
    } else if (status && role) {
      members = await sql`SELECT * FROM members WHERE status = ${status} AND role = ${role} ORDER BY created_at DESC`
    } else if (status) {
      members = await sql`SELECT * FROM members WHERE status = ${status} ORDER BY created_at DESC`
    } else if (role) {
      members = await sql`SELECT * FROM members WHERE role = ${role} ORDER BY created_at DESC`
    } else {
      members = await sql`SELECT * FROM members ORDER BY created_at DESC`
    }

    return Response.json(members)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, email, role, department, skills, phone, bio, status } = await request.json()
    
    const skillsArray = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
    
    const result = await sql`
      INSERT INTO members (name, email, role, department, skills, phone, bio, status)
      VALUES (${name}, ${email}, ${role || 'member'}, ${department || ''}, ${skillsArray}, ${phone || ''}, ${bio || ''}, ${status || 'active'})
      RETURNING *
    `
    return Response.json(result[0], { status: 201 })
  } catch (error) {
    if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
      return Response.json({ error: 'Email already exists' }, { status: 409 })
    }
    return Response.json({ error: 'Failed to create member' }, { status: 500 })
  }
}
