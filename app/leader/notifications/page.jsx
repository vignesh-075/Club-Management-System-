"use client"
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, Send, Calendar, Bell, Users, CheckCircle, 
  AlertCircle, Loader2, Megaphone
} from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function LeaderNotificationsPage() {
  const { user, loading } = useAuth()
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [emailType, setEmailType] = useState('custom')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  
  const { data: eventsData } = useSWR(
    user?.club_id ? `/api/events?clubId=${user.club_id}` : null, 
    fetcher
  )
  const { data: membersData } = useSWR(
    user?.club_id ? `/api/clubs/${user.club_id}/members` : null, 
    fetcher
  )
  
  const events = eventsData?.events || eventsData || []
  const members = membersData?.members || []
  
  const [selectedEvent, setSelectedEvent] = useState('')
  
  const sendNotification = async () => {
    if (!user?.club_id) return
    
    setSending(true)
    setError('')
    setSuccess('')
    
    try {
      const payload = {
        type: emailType,
        clubId: user.club_id,
        subject,
        message,
        eventId: selectedEvent || null
      }
      
      // Send to real email
      const emailRes = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: emailType,
          clubId: user.club_id,
          subject,
          message,
          eventId: selectedEvent || null
        })
      })
      
      // Also send to inbox
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clubId: user.club_id,
          subject,
          message,
          fromName: user.name || 'Club Leader'
        })
      })
      
      const data = await res.json()
      
      if (res.ok || emailRes.ok) {
        setSuccess(`Email sent to ${members?.length || 0} members! Check your inbox.`)
        setSubject('')
        setMessage('')
        setSelectedEvent('')
      } else {
        setError(data.error || 'Failed to send notification')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }
  
  const upcomingEvents = Array.isArray(events) ? events.filter(e => e.status === 'upcoming') : []
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please log in to access this page</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Send Notifications</h1>
        <p className="text-muted-foreground mt-1">Send notifications directly to club members inbox</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{members?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Recipients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{upcomingEvents.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Mail className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{user?.club_name || 'Your Club'}</p>
              <p className="text-sm text-muted-foreground">Sending As</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Notification Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Send Notification
          </CardTitle>
          <CardDescription>
            Choose a notification type and compose your message
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'custom', label: 'Custom Email', icon: Mail },
              { id: 'event_reminder', label: 'Event Reminder', icon: Calendar },
              { id: 'announcement', label: 'Announcement', icon: Megaphone },
              { id: 'attendance', label: 'Attendance', icon: Bell },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setEmailType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  emailType === type.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <type.icon className={`w-6 h-6 ${emailType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${emailType === type.id ? 'text-primary' : 'text-foreground'}`}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
          
          {/* Event Selection for Event Reminder */}
          {emailType === 'event_reminder' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
              >
                <option value="">Choose an event...</option>
                {upcomingEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {event.event_date}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Subject</label>
            <Input
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
          
          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Message</label>
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="bg-secondary border-border"
            />
          </div>
          
          {/* Alerts */}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-500">{success}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-500">{error}</span>
            </div>
          )}
          
          {/* Send Button */}
          <Button 
            onClick={sendNotification} 
            disabled={sending || !subject || !message}
            className="w-full gap-2"
            size="lg"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to {members?.length || 0} Members
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Recipients Preview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Recipients Preview
          </CardTitle>
          <CardDescription>
            Email will be sent to these club members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {members?.map((member) => (
              <Badge key={member.id} variant="secondary" className="px-3 py-1">
                {member.name} ({member.email})
              </Badge>
            ))}
            {(!members || members.length === 0) && (
              <p className="text-muted-foreground">No approved members in this club yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


