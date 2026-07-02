"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Users, Building2, UserCheck, Clock, Calendar, MapPin,
  Brain, Shield, Lightbulb, Palette, Code, ArrowRight, X, Crown
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

const clubColors = {
  'AI Club': 'from-blue-500 to-cyan-500',
  'Cybersecurity Club': 'from-red-500 to-orange-500',
  'Innovation Club': 'from-green-500 to-emerald-500',
  'Creativity Club': 'from-pink-500 to-rose-500',
  'Web Dev Club': 'from-violet-500 to-purple-500'
}

export default function AdminDashboard() {
  const { data: clubs } = useSWR('/api/clubs', fetcher)
  const { data: allUsers } = useSWR('/api/users', fetcher)
  const { data: pendingUsers } = useSWR('/api/users?status=pending', fetcher)
  const { data: events } = useSWR('/api/events', fetcher)
  
  const [selectedClub, setSelectedClub] = useState(null)
  const [clubMembers, setClubMembers] = useState(null)
  const [loadingMembers, setLoadingMembers] = useState(false)

  async function openClubDetails(club) {
    setSelectedClub(club)
    setLoadingMembers(true)
    try {
      const res = await fetch(`/api/clubs/${club.id}/members`)
      const data = await res.json()
      setClubMembers(data)
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
    setLoadingMembers(false)
  }

  function closeClubDetails() {
    setSelectedClub(null)
    setClubMembers(null)
  }

  const stats = [
    { label: 'Total Clubs', value: clubs?.length || 0, icon: Building2, color: 'bg-primary/20 text-primary' },
    { label: 'Total Members', value: allUsers?.filter(u => u.status === 'approved').length || 0, icon: Users, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Pending Requests', value: pendingUsers?.length || 0, icon: Clock, color: 'bg-yellow-500/20 text-yellow-400' },
    { label: 'Total Events', value: events?.length || 0, icon: Calendar, color: 'bg-green-500/20 text-green-400' },
  ]

  const upcomingEvents = events?.filter(e => e.status === 'upcoming').slice(0, 4) || []

  return (
    <div className="space-y-8">
      {/* Stats */}
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

      {/* Pending Requests Alert */}
      {pendingUsers?.length > 0 && (
        <div>
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{pendingUsers.length} Pending Join Requests</h3>
                  <p className="text-sm text-muted-foreground">Students waiting for approval</p>
                </div>
              </div>
              <Link href="/admin/requests">
                <Button>Review Requests <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Events Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Link href="/admin/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <div key={event.id}>
                <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.event_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{event.type}</Badge>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {event.registered}/{event.capacity} registered
                      </div>
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming events</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Clubs Overview - Click to see members */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">All Clubs (Click to view members)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs?.map((club) => {
            const Icon = clubIcons[club.name] || Building2
            const gradient = clubColors[club.name] || 'from-gray-500 to-gray-600'
            
            return (
              <div key={club.id}>
                <Card 
                  className="bg-card border-border overflow-hidden cursor-pointer group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
                  onClick={() => openClubDetails(club)}
                >
                  <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {club.pending_count > 0 && (
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                          {club.pending_count} pending
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{club.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{club.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{club.member_count || 0} members</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Leader: {club.leader_name || 'Not assigned'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Members */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Members</h2>
          <Link href="/admin/members">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {allUsers?.filter(u => u.status === 'approved').slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{user.club_name || 'No Club'}</Badge>
                    <Badge className={
                      user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      user.role === 'leader' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Club Members Modal */}
      <Dialog open={!!selectedClub} onOpenChange={() => closeClubDetails()}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedClub && (
                <>
                  {(() => {
                    const Icon = clubIcons[selectedClub.name] || Building2
                    const gradient = clubColors[selectedClub.name] || 'from-gray-500 to-gray-600'
                    return (
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    )
                  })()}
                  <span>{selectedClub.name} - Members</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {loadingMembers ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading members...</p>
              </div>
            ) : clubMembers ? (
              <div className="space-y-4">
                {/* Club Info */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">{clubMembers.club?.description}</p>
                  {clubMembers.club?.leader_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-muted-foreground">Leader:</span>
                      <span className="font-medium">{clubMembers.club.leader_name}</span>
                      <span className="text-muted-foreground">({clubMembers.club.leader_email})</span>
                    </div>
                  )}
                </div>
                
                {/* Members List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  <h4 className="font-medium text-sm text-muted-foreground px-1">
                    Team Members ({clubMembers.members?.length || 0})
                  </h4>
                  {clubMembers.members?.length > 0 ? (
                    clubMembers.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-sm font-medium">{member.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm flex items-center gap-2">
                              {member.name}
                              {member.role === 'leader' && <Crown className="w-4 h-4 text-yellow-400" />}
                            </p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            member.role === 'leader' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                          }>
                            {member.role}
                          </Badge>
                          <Badge variant="outline" className={
                            member.status === 'approved' ? 'border-green-500/50 text-green-400' :
                            member.status === 'pending' ? 'border-yellow-500/50 text-yellow-400' :
                            'border-red-500/50 text-red-400'
                          }>
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">No members in this club yet</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">Failed to load members</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


