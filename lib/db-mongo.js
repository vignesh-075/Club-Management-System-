import clientPromise from './mongodb.js'

export async function getDb() {
  const client = await clientPromise
  const db = client.db('club_management')
  return db
}

export default getDb
