"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Megaphone, Search, Pin, User } from 'lucide-react'

const fetcher = (url) => fetch(url).then(r => r.json())

const priorityColors = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30'
}

const categoryColors = {
  general: 'bg-blue-500/20 text-blue-400',
  event: 'bg-purple-500/20 text-purple-400',
  urgent: 'bg-red-500/20 text-red-400',
  achievement: 'bg-green-500/20 text-green-400'
}

export default function StudentAnnouncementsPage() {
  const { data: announcements } = useSWR('/api/announcements', fetcher)
  const [search, setSearch] = useState('')

  const filteredAnnouncements = announcements?.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.content.toLowerCase().includes(search.toLowerCase())
  )

  const pinnedAnnouncements = filteredAnnouncements?.filter(a => a.is_pinned) || []
  const regularAnnouncements = filteredAnnouncements?.filter(a => !a.is_pinned) || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">Stay updated with club news and updates</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Pin className="w-5 h-5 text-primary" />
            Pinned
          </h2>
          <div className="grid gap-4">
            {pinnedAnnouncements.map((announcement) => (
              <div key={announcement.id}>
                <Card className={`bg-card border-2 ${priorityColors[announcement.priority]}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={categoryColors[announcement.category]}>
                          {announcement.category}
                        </Badge>
                        <Badge variant="outline" className={priorityColors[announcement.priority]}>
                          {announcement.priority} priority
                        </Badge>
                      </div>
                      <Pin className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{announcement.title}</h3>
                    <p className="text-muted-foreground mb-4">{announcement.content}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{announcement.author}</span>
                      </div>
                      <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div>
        {pinnedAnnouncements.length > 0 && (
          <h2 className="text-lg font-semibold mb-4">All Announcements</h2>
        )}
        <div className="grid gap-4">
          {regularAnnouncements.map((announcement) => (
            <div key={announcement.id}>
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={categoryColors[announcement.category]}>
                        {announcement.category}
                      </Badge>
                      <Badge variant="outline" className={priorityColors[announcement.priority]}>
                        {announcement.priority}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                  <p className="text-muted-foreground mb-4">{announcement.content}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Posted by {announcement.author}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {filteredAnnouncements?.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No announcements found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


