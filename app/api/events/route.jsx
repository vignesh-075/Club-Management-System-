import { getDb } from '@/lib/db.jsx'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const db = await getDb()
    const collection = db.collection('events')
    
    let query = {}
    
    if (search) {
      query = {
        title: { $regex: search, $options: 'i' }
      }
    } else if (status && type) {
      query = { status, type }
    } else if (status) {
      query = { status }
    } else if (type) {
      query = { type }
    }

    const events = await collection
      .find(query)
      .sort({ event_date: 1 })
      .toArray()

    return Response.json(events)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { title, description, event_date, event_time, location, type, capacity, status, organizer } = await request.json()
    
    const db = await getDb()
    const collection = db.collection('events')
    
    const eventData = {
      title,
      description: description || '',
      event_date: new Date(event_date),
      event_time,
      location: location || '',
      type: type || 'workshop',
      capacity: capacity || 50,
      registered: 0,
      status: status || 'upcoming',
      organizer: organizer || '',
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await collection.insertOne(eventData)
    const newEvent = await collection.findOne({ _id: result.insertedId })
    
    return Response.json(newEvent, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
