import { getDb } from '@/lib/db.jsx'
import { ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clubId = searchParams.get('clubId') || searchParams.get('club_id')
    const role = searchParams.get('role')
    
    const db = await getDb()
    const usersCollection = db.collection('users')
    
    let query = {}
    
    if (status) {
      query.status = status
    }
    
    if (clubId) {
      try {
        query.club_id = new ObjectId(clubId)
      } catch (error) {
        // If clubId is not a valid ObjectId, try as string
        query.club_id = clubId
      }
    }
    
    if (role) {
      query.role = role
    }
    
    let users = await usersCollection.find(query).sort({ created_at: -1 }).toArray()
    
    // Add club information if needed
    if (users.length > 0) {
      const clubsCollection = db.collection('clubs')
      const clubIds = users
        .filter(user => user.club_id)
        .map(user => user.club_id)
      
      if (clubIds.length > 0) {
        const clubs = await clubsCollection.find({ 
          _id: { $in: clubIds } 
        }).toArray()
        
        const clubMap = clubs.reduce((acc, club) => {
          acc[club._id.toString()] = club.name
          return acc
        }, {})
        
        users = users.map(user => ({
          ...user,
          club_name: user.club_id ? clubMap[user.club_id.toString()] || user.club : user.club
        }))
      }
    }
    
    return Response.json(users)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { userId, status, role } = await request.json()
    
    const db = await getDb()
    const usersCollection = db.collection('users')
    
    const updateData = {}
    if (status) updateData.status = status
    if (role) updateData.role = role
    updateData.updated_at = new Date()
    
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    
    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) })
    const { password: _, ...userResponse } = updatedUser
    
    return Response.json({ 
      user: userResponse, 
      message: `User ${status ? 'status' : 'role'} updated successfully` 
    })
  } catch (error) {
    return Response.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { userId } = await request.json()
    
    const db = await getDb()
    const usersCollection = db.collection('users')
    
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) })
    
    if (result.deletedCount === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    
    return Response.json({ message: 'User deleted successfully' })
  } catch (error) {
    return Response.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
