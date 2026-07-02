import { getDb } from './lib/db.js'

// Default clubs for the system
const defaultClubs = [
  {
    name: "AI Club",
    description: "Explore artificial intelligence, machine learning, and neural networks",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Cybersecurity Club", 
    description: "Learn about ethical hacking, network security, and digital forensics",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Innovation Club",
    description: "Foster creativity, entrepreneurship, and innovative thinking",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Creativity Club",
    description: "Express artistic talents through various creative mediums and projects",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Web Dev Club",
    description: "Master modern web development technologies and build amazing projects",
    created_at: new Date(),
    updated_at: new Date()
  }
]

async function seedClubs() {
  try {
    console.log('Creating default clubs...')
    
    const db = await getDb()
    const clubsCollection = db.collection('clubs')
    
    // Clear existing clubs
    await clubsCollection.deleteMany({})
    console.log('Cleared existing clubs')
    
    // Insert default clubs
    const result = await clubsCollection.insertMany(defaultClubs)
    console.log(`Successfully created ${result.insertedCount} clubs`)
    
    // Display created clubs
    console.log('\n=== CREATED CLUBS ===')
    defaultClubs.forEach((club, index) => {
      console.log(`${index + 1}. ${club.name}`)
      console.log(`   Description: ${club.description}`)
      console.log('---')
    })
    
    console.log('\n✅ Clubs seeded successfully!')
    
  } catch (error) {
    console.error('Error seeding clubs:', error)
  } finally {
    process.exit(0)
  }
}

// Run the seeding function
seedClubs()
