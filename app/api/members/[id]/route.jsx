import { getDb } from '@/lib/db.jsx'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  try {
    const db = await getDb()
    const collection = db.collection('members')
    
    const member = await collection.findOne({ _id: new ObjectId(params.id) })
    
    if (!member) {
      return Response.json({ error: 'Member not found' }, { status: 404 })
    }
    
    return Response.json(member)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch member' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { name, email, role, department, skills, phone, bio, status } = await request.json()
    
    const skillsArray = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
    
    const db = await getDb()
    const collection = db.collection('members')
    
    const updateData = {
      name,
      email,
      role,
      department,
      skills: skillsArray,
      phone,
      bio,
      status,
      updated_at: new Date()
    }
    
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return Response.json({ error: 'Member not found' }, { status: 404 })
    }
    
    const updatedMember = await collection.findOne({ _id: new ObjectId(params.id) })
    return Response.json(updatedMember)
  } catch (error) {
    return Response.json({ error: 'Failed to update member' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb()
    const collection = db.collection('members')
    
    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return Response.json({ error: 'Member not found' }, { status: 404 })
    }
    
    return Response.json({ message: 'Member deleted successfully' })
  } catch (error) {
    return Response.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}
