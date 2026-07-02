"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, MapPin, Clock, Users, Search } from 'lucide-react'

const fetcher = (url) => fetch(url).then(r => r.json())

const typeColors = {
  workshop: 'bg-blue-500/20 text-blue-400',
  hackathon: 'bg-orange-500/20 text-orange-400',
  seminar: 'bg-purple-500/20 text-purple-400',
  meetup: 'bg-green-500/20 text-green-400',
  social: 'bg-pink-500/20 text-pink-400'
}

export default function StudentEventsPage() {
  const { data: events } = useSWR('/api/events', fetcher)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredEvents = events?.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || e.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Club Events</h1>
        <p className="text-muted-foreground">Browse and discover upcoming events</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="hackathon">Hackathon</SelectItem>
            <SelectItem value="seminar">Seminar</SelectItem>
            <SelectItem value="meetup">Meetup</SelectItem>
            <SelectItem value="social">Social</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents?.map((event) => (
          <div key={event.id}>
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge className={typeColors[event.type] || 'bg-gray-500/20 text-gray-400'}>
                    {event.type}
                  </Badge>
                  <Badge variant="outline" className={
                    event.status === 'upcoming' ? 'border-green-500/30 text-green-400' :
                    event.status === 'completed' ? 'border-gray-500/30 text-gray-400' :
                    'border-yellow-500/30 text-yellow-400'
                  }>
                    {event.status}
                  </Badge>
                </div>

                <h3 className="font-semibold text-lg mb-3">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{event.event_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.registered}/{event.capacity}</span>
                    </div>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {filteredEvents?.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No events found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


