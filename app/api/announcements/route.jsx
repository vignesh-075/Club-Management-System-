import { getDb } from '@/lib/db.jsx'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const db = await getDb()
    const collection = db.collection('announcements')
    
    let query = {}
    
    if (search) {
      query = {
        title: { $regex: search, $options: 'i' }
      }
    } else if (category && category !== 'all') {
      query = { category }
    }

    const announcements = await collection
      .find(query)
      .sort({ is_pinned: -1, created_at: -1 })
      .toArray()

    return Response.json(announcements)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { title, content, author, priority, category, is_pinned } = await request.json()
    
    const db = await getDb()
    const collection = db.collection('announcements')
    
    const announcementData = {
      title,
      content,
      author: author || 'Admin',
      priority: priority || 'medium',
      category: category || 'general',
      is_pinned: is_pinned || false,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await collection.insertOne(announcementData)
    const newAnnouncement = await collection.findOne({ _id: result.insertedId })
    
    return Response.json(newAnnouncement, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}
