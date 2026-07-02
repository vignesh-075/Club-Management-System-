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
import { Megaphone, Plus, Edit, Trash2, Pin, Loader2 } from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function LeaderAnnouncementsPage() {
  const { user, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [editAnnouncement, setEditAnnouncement] = useState(null)
  const [form, setForm] = useState({
    title: '', content: '', priority: 'medium', category: 'general'
  })

  const { data: announcements = [], mutate, isLoading } = useSWR('/api/announcements', fetcher)
  const announcementList = Array.isArray(announcements) ? announcements : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editAnnouncement ? 'PUT' : 'POST'
    const url = editAnnouncement ? `/api/announcements/${editAnnouncement.id}` : '/api/announcements'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, author: user?.name })
    })
    
    mutate()
    setIsOpen(false)
    setEditAnnouncement(null)
    setForm({ title: '', content: '', priority: 'medium', category: 'general' })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this announcement?')) {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' })
      mutate()
    }
  }

  const togglePin = async (announcement) => {
    await fetch(`/api/announcements/${announcement.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_pinned: !announcement.is_pinned })
    })
    mutate()
  }

  const openEdit = (announcement) => {
    setEditAnnouncement(announcement)
    setForm({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority || 'medium',
      category: announcement.category || 'general'
    })
    setIsOpen(true)
  }

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400'
  }

  const categoryColors = {
    general: 'bg-blue-500/20 text-blue-400',
    event: 'bg-purple-500/20 text-purple-400',
    urgent: 'bg-red-500/20 text-red-400',
    achievement: 'bg-green-500/20 text-green-400'
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Create and manage club announcements</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditAnnouncement(null); setForm({ title: '', content: '', priority: 'medium', category: 'general' }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> New Announcement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Announcement Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Textarea placeholder="Content" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">{editAnnouncement ? 'Update' : 'Post'} Announcement</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : announcementList.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No announcements yet. Create your first one!</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {announcementList.map((announcement) => (
            <Card key={announcement.id} className={announcement.is_pinned ? 'border-primary/50' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {announcement.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                    <Badge className={categoryColors[announcement.category] || categoryColors.general}>{announcement.category}</Badge>
                    <Badge className={priorityColors[announcement.priority] || priorityColors.medium}>{announcement.priority}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePin(announcement)}>
                      <Pin className={`w-4 h-4 ${announcement.is_pinned ? 'text-primary' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(announcement)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(announcement.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" />
                  {announcement.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{announcement.content}</p>
                <p className="text-xs text-muted-foreground mt-3">Posted by {announcement.author} â€¢ {new Date(announcement.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


