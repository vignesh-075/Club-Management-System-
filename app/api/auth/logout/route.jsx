import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('user_id')
  cookieStore.delete('user_role')
  cookieStore.delete('club_id')
  return Response.json({ success: true })
}
