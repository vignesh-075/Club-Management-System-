import bcrypt from 'bcryptjs'
import { getDb } from './lib/db.js'

// Club-based user credentials
const clubUsers = [
  // AI Club
  {
    name: "Dr. Sarah Chen",
    email: "ai.leader@club.com",
    password: "aileader123",
    role: "moderator",
    department: "Computer Science",
    club: "AI Club",
    status: "approved",
    is_active: true
  },
  {
    name: "Alex Kumar",
    email: "ai.student1@club.com", 
    password: "student123",
    role: "member",
    department: "Computer Science",
    club: "AI Club",
    status: "approved",
    is_active: true
  },
  {
    name: "Emma Wilson",
    email: "ai.student2@club.com",
    password: "student123", 
    role: "member",
    department: "Computer Science",
    club: "AI Club",
    status: "approved",
    is_active: true
  },

  // Cybersecurity Club
  {
    name: "Michael Park",
    email: "cyber.leader@club.com",
    password: "cyberleader123",
    role: "moderator", 
    department: "Information Security",
    club: "Cybersecurity Club",
    status: "approved",
    is_active: true
  },
  {
    name: "David Kim",
    email: "cyber.student1@club.com",
    password: "student123",
    role: "member",
    department: "Information Security", 
    club: "Cybersecurity Club",
    status: "approved",
    is_active: true
  },
  {
    name: "Lisa Anderson",
    email: "cyber.student2@club.com",
    password: "student123",
    role: "member", 
    department: "Information Security",
    club: "Cybersecurity Club",
    status: "approved",
    is_active: true
  },

  // Innovation Club
  {
    name: "Dr. James Wilson",
    email: "innovation.leader@club.com",
    password: "innovationleader123",
    role: "moderator",
    department: "Business Innovation",
    club: "Innovation Club", 
    status: "approved",
    is_active: true
  },
  {
    name: "Olivia Brown",
    email: "innovation.student1@club.com",
    password: "student123",
    role: "member",
    department: "Business Innovation",
    club: "Innovation Club",
    status: "approved", 
    is_active: true
  },
  {
    name: "Ryan Martinez",
    email: "innovation.student2@club.com",
    password: "student123",
    role: "member",
    department: "Business Innovation",
    club: "Innovation Club",
    status: "approved",
    is_active: true
  },

  // Creativity Club
  {
    name: "Sophia Taylor",
    email: "creativity.leader@club.com", 
    password: "creativityleader123",
    role: "moderator",
    department: "Arts & Design",
    club: "Creativity Club",
    status: "approved",
    is_active: true
  },
  {
    name: "Ethan Davis",
    email: "creativity.student1@club.com",
    password: "student123",
    role: "member",
    department: "Arts & Design",
    club: "Creativity Club", 
    status: "approved",
    is_active: true
  },
  {
    name: "Ava Johnson",
    email: "creativity.student2@club.com",
    password: "student123",
    role: "member",
    department: "Arts & Design",
    club: "Creativity Club",
    status: "approved",
    is_active: true
  },

  // Web Dev Club
  {
    name: "Chris Rodriguez",
    email: "webdev.leader@club.com",
    password: "webdevleader123",
    role: "moderator",
    department: "Web Development",
    club: "Web Dev Club",
    status: "approved",
    is_active: true
  },
  {
    name: "Mia Thompson",
    email: "webdev.student1@club.com",
    password: "student123",
    role: "member",
    department: "Web Development",
    club: "Web Dev Club",
    status: "approved",
    is_active: true
  },
  {
    name: "Noah Garcia",
    email: "webdev.student2@club.com",
    password: "student123",
    role: "member",
    department: "Web Development", 
    club: "Web Dev Club",
    status: "approved",
    is_active: true
  },

  // Admin account
  {
    name: "System Administrator",
    email: "admin@club.com",
    password: "admin123",
    role: "admin",
    department: "Administration",
    club: "All Clubs",
    status: "approved",
    is_active: true
  }
]

async function seedClubUsers() {
  try {
    console.log('Clearing existing users and creating club-based credentials...')
    
    const db = await getDb()
    const usersCollection = db.collection('users')
    
    // Clear existing users
    await usersCollection.deleteMany({})
    console.log('Cleared all existing users')
    
    // Hash passwords and insert users
    const usersToInsert = await Promise.all(
      clubUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        return {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          department: user.department,
          club: user.club,
          status: user.status,
          is_active: user.is_active,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name.replace(' ', '')}`,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    )
    
    const result = await usersCollection.insertMany(usersToInsert)
    console.log(`Successfully created ${result.insertedCount} club-based users`)
    
    // Display credentials by club
    console.log('\n=== CLUB-BASED LOGIN CREDENTIALS ===')
    
    console.log('\n🔑 ADMIN CREDENTIALIALS:')
    const admin = clubUsers.filter(u => u.role === 'admin')[0]
    console.log(`Name: ${admin.name}`)
    console.log(`Email: ${admin.email}`)
    console.log(`Password: ${admin.password}`)
    console.log(`Club: ${admin.club}`)
    
    const clubs = ['AI Club', 'Cybersecurity Club', 'Innovation Club', 'Creativity Club', 'Web Dev Club']
    
    clubs.forEach(club => {
      console.log(`\n👥 ${club.toUpperCase()} CREDENTIALIALS:`)
      const clubMembers = clubUsers.filter(u => u.club === club)
      
      const leader = clubMembers.find(u => u.role === 'moderator')
      if (leader) {
        console.log(`👑 LEADER:`)
        console.log(`Name: ${leader.name}`)
        console.log(`Email: ${leader.email}`)
        console.log(`Password: ${leader.password}`)
        console.log(`Department: ${leader.department}`)
      }
      
      const students = clubMembers.filter(u => u.role === 'member')
      console.log(`👤 STUDENTS:`)
      students.forEach((student, index) => {
        console.log(`${index + 1}. Name: ${student.name}`)
        console.log(`   Email: ${student.email}`)
        console.log(`   Password: ${student.password}`)
        console.log(`   Department: ${student.department}`)
      })
    })
    
    console.log('\n✅ Club-based credentials created successfully!')
    console.log(`Total users created: ${result.insertedCount}`)
    
  } catch (error) {
    console.error('Error creating club users:', error)
  } finally {
    process.exit(0)
  }
}

// Run the seeding function
seedClubUsers()
