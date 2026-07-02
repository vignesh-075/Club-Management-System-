"use client"

import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, Calendar, Megaphone, Clock, CheckCircle, AlertCircle,
  Brain, Shield, Lightbulb, Palette, Code
} from 'lucide-react'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then(r => r.json())

const clubIcons = {
  'AI Club': Brain,
  'Cybersecurity Club': Shield,
  'Innovation Club': Lightbulb,
  'Creativity Club': Palette,
  'Web Dev Club': Code
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data: events } = useSWR('/api/events', fetcher)
  const { data: announcements } = useSWR('/api/announcements', fetcher)
  const { data: clubMembers } = useSWR(user?.club_id ? `/api/users?club_id=${user.club_id}` : null, fetcher)

  const ClubIcon = clubIcons[user?.club_name] || Users
  const upcomingEvents = events?.filter(e => e.status === 'upcoming') || []
  const recentAnnouncements = announcements?.slice(0, 3) || []
  const approvedMembers = clubMembers?.filter(m => m.status === 'approved') || []

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Stay updated with your club activities</p>
        </div>
        {user?.status === 'approved' ? (
          <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            Active Member
          </Badge>
        ) : (
          <Badge className="bg-yellow-500/20 text-yellow-400 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Pending Approval
          </Badge>
        )}
      </div>

      {/* Status Card */}
      {user?.status === 'pending' && (
        <div>
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Membership Pending</h3>
                <p className="text-muted-foreground">
                  Your request to join {user?.club_name} is being reviewed by the club leader.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Club Info Card */}
      {user?.club_name && user?.status === 'approved' && (
        <div>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                <ClubIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl">{user.club_name}</h3>
                <p className="text-muted-foreground">You are an active member of this club</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{approvedMembers.length}</p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                  <p className="text-3xl font-bold mt-1">{upcomingEvents.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Announcements</p>
                  <p className="text-3xl font-bold mt-1">{announcements?.length || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Club Members</p>
                  <p className="text-3xl font-bold mt-1">{approvedMembers.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Upcoming Events
              <Link href="/student/events">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.slice(0, 4).map((event) => (
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
              {upcomingEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Recent Announcements
              <Link href="/student/announcements">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={
                      announcement.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }>
                      {announcement.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                </div>
              ))}
              {recentAnnouncements.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No announcements</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


