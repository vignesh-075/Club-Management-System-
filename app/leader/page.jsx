"use client"

import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, Calendar, Megaphone, Clock, TrendingUp, UserCheck
} from 'lucide-react'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then(r => r.json())

export default function LeaderDashboard() {
  const { user } = useAuth()
  const { data: clubMembers } = useSWR(user?.club_id ? `/api/users?club_id=${user.club_id}` : null, fetcher)
  const { data: events } = useSWR('/api/events', fetcher)
  const { data: announcements } = useSWR('/api/announcements', fetcher)

  const approvedMembers = clubMembers?.filter(m => m.status === 'approved') || []
  const pendingMembers = clubMembers?.filter(m => m.status === 'pending') || []

  const stats = [
    { label: 'Club Members', value: approvedMembers.length, icon: Users, color: 'bg-primary/20 text-primary' },
    { label: 'Pending Requests', value: pendingMembers.length, icon: Clock, color: 'bg-yellow-500/20 text-yellow-400' },
    { label: 'Total Events', value: events?.length || 0, icon: Calendar, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Announcements', value: announcements?.length || 0, icon: Megaphone, color: 'bg-green-500/20 text-green-400' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here is what is happening in {user?.club_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {pendingMembers.length > 0 && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold">{pendingMembers.length} Students want to join</h3>
                <p className="text-sm text-muted-foreground">Review their requests</p>
              </div>
            </div>
            <Link href="/leader/members">
              <Button>Review Requests</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Recent Members
              <Link href="/leader/members">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvedMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">{member.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
              ))}
              {approvedMembers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No members yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Upcoming Events
              <Link href="/leader/events">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events?.filter(e => e.status === 'upcoming').slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString()} at {event.event_time}
                    </p>
                  </div>
                  <Badge>{event.type}</Badge>
                </div>
              ))}
              {(!events || events.filter(e => e.status === 'upcoming').length === 0) && (
                <p className="text-center text-muted-foreground py-8">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


