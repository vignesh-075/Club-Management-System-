import { getDb } from '@/lib/db.jsx'

export async function GET() {
  try {
    const db = await getDb()
    const clubsCollection = db.collection('clubs')
    
    const clubs = await clubsCollection.find({}).toArray()
    
    return Response.json(clubs)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch clubs' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, description } = await request.json()
    
    const db = await getDb()
    const clubsCollection = db.collection('clubs')
    
    const clubData = {
      name,
      description: description || '',
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await clubsCollection.insertOne(clubData)
    const newClub = await clubsCollection.findOne({ _id: result.insertedId })
    
    return Response.json(newClub, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create club' }, { status: 500 })
  }
}
