import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db.jsx'

export async function POST(request) {
  try {
    const { name, email, password, phone, clubId, idCardImage, department, role = 'member' } = await request.json()
    
    const db = await getDb()
    const usersCollection = db.collection('users')
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return Response.json({ error: 'Email already registered' }, { status: 400 })
    }
    
    // Get club information if clubId is provided
    let clubInfo = null
    if (clubId) {
      const clubsCollection = db.collection('clubs')
      clubInfo = await clubsCollection.findOne({ _id: clubId })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      department: department || (clubInfo ? clubInfo.name : ''),
      role,
      club: clubInfo ? clubInfo.name : '',
      club_id: clubId || null,
      id_card_image: idCardImage || null,
      status: role === 'admin' ? 'approved' : 'pending', // Admins are auto-approved
      is_active: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    const result = await usersCollection.insertOne(userData)
    const newUser = await usersCollection.findOne({ _id: result.insertedId })
    
    // Return user data without password
    const { password: _, ...userResponse } = newUser
    
    if (role === 'admin') {
      return Response.json({ user: userResponse, message: 'Admin account created successfully.' })
    } else {
      return Response.json({ user: userResponse, message: 'Registration submitted. Awaiting approval.' })
    }
  } catch (error) {
    return Response.json({ error: 'Registration failed' }, { status: 500 })
  }
}
