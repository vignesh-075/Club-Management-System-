import bcrypt from 'bcryptjs'
import { getDb } from './lib/db.js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Existing members from the system - creating credentials for these users only
const existingMembers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    role: "admin",
    department: "Computer Science",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    joinedAt: "2024-01-15",
    status: "active",
    skills: ["Leadership", "Web Development", "Public Speaking"],
    password: "admin123" // Simple password for admin
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "leader",
    department: "Design",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    joinedAt: "2024-02-20",
    status: "active",
    skills: ["UI/UX Design", "Graphic Design", "Branding"],
    password: "leader123" // Password for leaders
  },
  {
    id: "3",
    name: "Michael Park",
    email: "michael.park@university.edu",
    role: "member",
    department: "Business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    joinedAt: "2024-03-10",
    status: "active",
    skills: ["Marketing", "Event Planning", "Finance"],
    password: "member123" // Password for members
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@university.edu",
    role: "member",
    department: "Engineering",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    joinedAt: "2024-03-25",
    status: "active",
    skills: ["Machine Learning", "Python", "Data Analysis"],
    password: "member123"
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@university.edu",
    role: "leader",
    department: "Computer Science",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    joinedAt: "2024-04-05",
    status: "active",
    skills: ["Backend Development", "Cloud Computing", "DevOps"],
    password: "leader123"
  },
  {
    id: "6",
    name: "Olivia Brown",
    email: "olivia.brown@university.edu",
    role: "member",
    department: "Arts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    joinedAt: "2024-04-18",
    status: "inactive",
    skills: ["Photography", "Video Editing", "Content Creation"],
    password: "member123"
  }
]

async function seedExistingUsers() {
  try {
    console.log('Creating credentials for existing club members...')
    
    const db = await getDb()
    const usersCollection = db.collection('users')
    
    // Clear existing users
    await usersCollection.deleteMany({})
    console.log('Cleared existing users')
    
    // Hash passwords and insert users
    const usersToInsert = await Promise.all(
      existingMembers.map(async (member) => {
        const hashedPassword = await bcrypt.hash(member.password, 10)
        return {
          name: member.name,
          email: member.email,
          password: hashedPassword,
          role: member.role,
          department: member.department,
          status: 'approved', // All existing members are approved
          is_active: member.status === 'active',
          avatar: member.avatar,
          phone: '',
          bio: '',
          skills: member.skills,
          joined_at: new Date(member.joinedAt),
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    )
    
    const result = await usersCollection.insertMany(usersToInsert)
    console.log(`Successfully created credentials for ${result.insertedCount} existing members`)
    
    // Display credentials for existing members only
    console.log('\n=== LOGIN CREDENTIALS FOR EXISTING MEMBERS ===')
    
    console.log('\n🔑 ADMIN CREDENTIALIALS:')
    const admin = existingMembers.filter(u => u.role === 'admin')[0]
    console.log(`Name: ${admin.name}`)
    console.log(`Email: ${admin.email}`)
    console.log(`Password: ${admin.password}`)
    console.log(`Department: ${admin.department}`)
    
    console.log('\n👑 CLUB LEADER CREDENTIALIALS:')
    existingMembers.filter(u => u.role === 'leader').forEach(leader => {
      console.log(`Name: ${leader.name}`)
      console.log(`Email: ${leader.email}`)
      console.log(`Password: ${leader.password}`)
      console.log(`Department: ${leader.department}`)
      console.log('---')
    })
    
    console.log('\n👤 MEMBER CREDENTIALIALS:')
    existingMembers.filter(u => u.role === 'member').forEach(member => {
      console.log(`Name: ${member.name}`)
      console.log(`Email: ${member.email}`)
      console.log(`Password: ${member.password}`)
      console.log(`Department: ${member.department}`)
      console.log(`Status: ${member.status}`)
      console.log('---')
    })
    
    console.log('\n✅ Credentials created for all existing club members!')
    
  } catch (error) {
    console.error('Error creating user credentials:', error)
  } finally {
    process.exit(0)
  }
}

// Run the seeding function
seedExistingUsers()
