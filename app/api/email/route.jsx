import { getDb } from '@/lib/db.jsx'

const sql = neon(process.env.DATABASE_URL)

// Send email using Resend API
async function sendEmail(to, subject, html) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  
  if (!RESEND_API_KEY) {
    return { success: false, error: 'Email service not configured' }
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ClubSync <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to send' }
    }
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// POST - Send email notification
export async function POST(request) {
  try {
    const body = await request.json()
    const { type, clubId, subject, message, eventId } = body
    
    const clubIdNum = parseInt(clubId)
    
    if (!clubIdNum || isNaN(clubIdNum)) {
      return Response.json({ error: 'Invalid club ID' }, { status: 400 })
    }
    
    // Get club members
    let members = []
    members = await sql`
      SELECT email, name FROM users 
      WHERE club_id = ${clubIdNum} AND status = 'approved'
    `
    
    // Get club info
    const clubs = await sql`SELECT name FROM clubs WHERE id = ${clubIdNum}`
    const clubName = clubs[0]?.name || 'Your Club'
    
    let emailSubject = subject
    let emailHtml = ''
    
    if (type === 'event_reminder' && eventId) {
      // Get event details
      const eventIdNum = parseInt(eventId)
      const events = eventIdNum ? await sql`SELECT * FROM events WHERE id = ${eventIdNum}` : []
      const event = events[0]
      
      emailSubject = `Upcoming Event: ${event?.title || 'Club Event'}`
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ClubSync</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">${clubName}</p>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #111827; margin: 0 0 15px 0;">Upcoming Event Reminder</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <h3 style="color: #10b981; margin: 0 0 10px 0;">${event?.title}</h3>
              <p style="color: #6b7280; margin: 0 0 10px 0;">${event?.description || 'Join us for this exciting event!'}</p>
              <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${event?.event_date}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${event?.event_time}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${event?.location}</p>
              </div>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Don't miss out! Mark your calendar and see you there.</p>
          </div>
        </div>
      `
    } else if (type === 'announcement') {
      emailSubject = subject || `New Announcement from ${clubName}`
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ClubSync</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">${clubName}</p>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #111827; margin: 0 0 15px 0;">${subject}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="color: #374151; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Stay connected with your club!</p>
          </div>
        </div>
      `
    } else if (type === 'attendance') {
      emailSubject = `Attendance Reminder - ${clubName}`
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ClubSync</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">${clubName}</p>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #111827; margin: 0 0 15px 0;">Attendance Reminder</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="color: #374151; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Please mark your attendance.</p>
          </div>
        </div>
      `
    } else {
      // Custom email
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ClubSync</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">${clubName}</p>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #111827; margin: 0 0 15px 0;">${subject}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="color: #374151; line-height: 1.6;">${message}</p>
            </div>
          </div>
        </div>
      `
    }
    
    // Send to all members
    const results = []
    for (const member of members) {
      const result = await sendEmail(member.email, emailSubject, emailHtml)
      results.push({ email: member.email, name: member.name, ...result })
    }
    
    // Log notification to database (wrapped in try-catch to not fail the whole request)
    try {
      await sql`
        INSERT INTO announcements (title, content, author, category, priority)
        VALUES (${emailSubject || 'Email Notification'}, ${message || 'Email notification sent'}, 'System', 'general', 'medium')
      `
    } catch (dbError) {
      // Silently ignore logging errors
    }
    
    return Response.json({ 
      success: true, 
      message: `Email sent to ${members.length} members`,
      results 
    })
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to send email' }, { status: 500 })
  }
}

// GET - Get email logs/history
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get('clubId')
    
    // Get recent announcements as email history
    const emails = await sql`
      SELECT * FROM announcements 
      WHERE author = 'System'
      ORDER BY created_at DESC 
      LIMIT 50
    `
    
    return Response.json(emails)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
