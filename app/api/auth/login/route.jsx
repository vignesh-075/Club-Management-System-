import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db.jsx'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    const db = await getDb()
    const usersCollection = db.collection('users')
    
    // Find user by email
    const user = await usersCollection.findOne({ email })
    
    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    if (user.role !== 'admin' && user.status !== 'approved') {
      return Response.json({ error: 'Your account is pending approval. Please wait for admin/leader to approve.' }, { status: 403 })
    }
    
    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { last_login: new Date() } }
    )
    
    // Return user data without password
    const { password: _, ...userData } = user
    
    return Response.json({ 
      user: userData,
      message: 'Login successful'
    })
  } catch (error) {
    return Response.json({ error: 'Login failed' }, { status: 500 })
  }
}
