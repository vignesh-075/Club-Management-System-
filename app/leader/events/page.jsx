"use client"
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Loader2 } from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function LeaderEventsPage() {
  const { user, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [editEvent, setEditEvent] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', event_date: '', event_time: '', 
    location: '', type: 'workshop', capacity: 50
  })

  const { data: events = [], mutate, isLoading } = useSWR('/api/events', fetcher)
  const clubEvents = Array.isArray(events) ? events : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editEvent ? 'PUT' : 'POST'
    const url = editEvent ? `/api/events/${editEvent.id}` : '/api/events'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, organizer: user?.name })
    })
    
    mutate()
    setIsOpen(false)
    setEditEvent(null)
    setForm({ title: '', description: '', event_date: '', event_time: '', location: '', type: 'workshop', capacity: 50 })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this event?')) {
      await fetch(`/api/events/${id}`, { method: 'DELETE' })
      mutate()
    }
  }

  const openEdit = (event) => {
    setEditEvent(event)
    setForm({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date?.split('T')[0] || '',
      event_time: event.event_time || '',
      location: event.location || '',
      type: event.type || 'workshop',
      capacity: event.capacity || 50
    })
    setIsOpen(true)
  }

  const typeColors = {
    workshop: 'bg-blue-500/20 text-blue-400',
    hackathon: 'bg-purple-500/20 text-purple-400',
    seminar: 'bg-green-500/20 text-green-400',
    meetup: 'bg-yellow-500/20 text-yellow-400',
    social: 'bg-pink-500/20 text-pink-400'
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Club Events</h1>
          <p className="text-muted-foreground">Manage events for your club</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditEvent(null); setForm({ title: '', description: '', event_date: '', event_time: '', location: '', type: 'workshop', capacity: 50 }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Create Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Event Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required />
                <Input type="time" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} required />
              </div>
              <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })} />
              </div>
              <Button type="submit" className="w-full">{editEvent ? 'Update' : 'Create'} Event</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : clubEvents.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No events yet. Create your first event!</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clubEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={typeColors[event.type] || typeColors.workshop}>{event.type}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(event)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{event.event_date?.split('T')[0]}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{event.event_time}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location || 'TBD'}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" />{event.registered || 0} / {event.capacity}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


