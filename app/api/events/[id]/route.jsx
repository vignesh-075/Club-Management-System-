import { getDb } from '@/lib/db.jsx'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  try {
    const db = await getDb()
    const collection = db.collection('events')
    
    const event = await collection.findOne({ _id: new ObjectId(params.id) })
    
    if (!event) {
      return Response.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return Response.json(event)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { title, description, event_date, event_time, location, type, capacity, status, organizer } = await request.json()
    
    const db = await getDb()
    const collection = db.collection('events')
    
    const updateData = {
      title,
      description,
      event_date: new Date(event_date),
      event_time,
      location,
      type,
      capacity,
      status,
      organizer,
      updated_at: new Date()
    }
    
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return Response.json({ error: 'Event not found' }, { status: 404 })
    }
    
    const updatedEvent = await collection.findOne({ _id: new ObjectId(params.id) })
    return Response.json(updatedEvent)
  } catch (error) {
    return Response.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb()
    const collection = db.collection('events')
    
    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return Response.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return Response.json({ message: 'Event deleted successfully' })
  } catch (error) {
    return Response.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
