import { getDb } from '@/lib/db.jsx'

const sql = neon(process.env.DATABASE_URL)

export async function GET() {
  try {
    const settings = await sql`SELECT * FROM club_settings ORDER BY id LIMIT 1`
    if (settings.length === 0) {
      const defaultSettings = await sql`INSERT INTO club_settings (club_name) VALUES ('Tech Enthusiasts Club') RETURNING *`
      return Response.json(defaultSettings[0])
    }
    return Response.json(settings[0])
  } catch (error) {
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()

    const result = await sql`
      UPDATE club_settings SET
        club_name = COALESCE(${body.club_name || null}, club_name),
        description = COALESCE(${body.description || null}, description),
        website = COALESCE(${body.website || null}, website),
        location = COALESCE(${body.location || null}, location),
        founded_year = COALESCE(${body.founded_year || null}, founded_year),
        admin_name = COALESCE(${body.admin_name || null}, admin_name),
        admin_email = COALESCE(${body.admin_email || null}, admin_email),
        admin_phone = COALESCE(${body.admin_phone || null}, admin_phone),
        updated_at = NOW()
      WHERE id = (SELECT id FROM club_settings ORDER BY id LIMIT 1)
      RETURNING *
    `
    if (result.length === 0) {
      return Response.json({ error: 'Settings not found' }, { status: 404 })
    }
    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
