"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, Send, Users, Calendar, Bell, CheckCircle, 
  AlertCircle, Building2, Loader2 
} from 'lucide-react'

export default function AdminNotificationsPage() {
  const { user, loading } = useAuth()
  const [clubs, setClubs] = useState([])
  const [selectedClub, setSelectedClub] = useState('all')
  const [emailType, setEmailType] = useState('custom')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [stats, setStats] = useState({ total: 0, sent: 0 })

  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    const res = await fetch('/api/clubs')
    const data = await res.json()
    setClubs(data.clubs || [])
  }

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

  const emailTemplates = [
    { 
      id: 'custom', 
      label: 'Custom Email', 
      icon: Mail,
      description: 'Write your own custom email'
    },
    { 
      id: 'event_reminder', 
      label: 'Event Reminder', 
      icon: Calendar,
      description: 'Remind members about upcoming events',
      defaultSubject: 'Reminder: Upcoming Club Events',
      defaultMessage: 'Dear Club Members,\n\nThis is a friendly reminder about our upcoming events. Please check the dashboard for event details and make sure to register if you haven\'t already.\n\nWe look forward to seeing you there!\n\nBest regards,\nClubSync Admin'
    },
    { 
      id: 'attendance', 
      label: 'Attendance Request', 
      icon: Users,
      description: 'Request attendance confirmation',
      defaultSubject: 'Action Required: Confirm Your Attendance',
      defaultMessage: 'Dear Club Members,\n\nPlease confirm your attendance for the upcoming club activities by logging into your ClubSync dashboard.\n\nYour participation helps us plan better events for everyone.\n\nThank you for being an active member!\n\nBest regards,\nClubSync Admin'
    },
    { 
      id: 'announcement', 
      label: 'Important Announcement', 
      icon: Bell,
      description: 'Send important announcements',
      defaultSubject: 'Important Announcement from ClubSync',
      defaultMessage: 'Dear Club Members,\n\nWe have an important announcement to share with you.\n\n[Your announcement details here]\n\nPlease check your dashboard for more information.\n\nBest regards,\nClubSync Admin'
    },
  ]

  const handleTemplateSelect = (template) => {
    setEmailType(template.id)
    if (template.defaultSubject) {
      setSubject(template.defaultSubject)
      setMessage(template.defaultMessage)
    }
  }

  const handleSendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      setResult({ success: false, message: 'Please fill in subject and message' })
      return
    }

    setSending(true)
    setResult(null)

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: emailType,
          club_id: selectedClub === 'all' ? null : parseInt(selectedClub),
          subject,
          message,
          sender_name: user?.name || 'ClubSync Admin'
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        setResult({ 
          success: true, 
          message: `Emails sent successfully to ${data.sent_count} members!` 
        })
        setStats(prev => ({ ...prev, sent: prev.sent + data.sent_count }))
        setSubject('')
        setMessage('')
      } else {
        setResult({ success: false, message: data.error || 'Failed to send emails' })
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Send email notifications to club members across all clubs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Templates */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Email Templates</CardTitle>
            <CardDescription>Choose a template or write custom</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {emailTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  emailType === template.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    emailType === template.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <template.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{template.label}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Compose Email */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Compose Email
            </CardTitle>
            <CardDescription>
              Send to all members or select a specific club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Target Selection */}
            <div className="space-y-2">
              <Label>Send To</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedClub('all')}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedClub === 'all'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  All Clubs
                </button>
                {clubs.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClub(String(club.id))}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedClub === String(club.id)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {club.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your email message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            {/* Result Message */}
            {result && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                result.success 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}>
                {result.success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            {/* Send Button */}
            <Button 
              onClick={handleSendEmail} 
              disabled={sending || !subject.trim() || !message.trim()}
              className="w-full"
              size="lg"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Emails...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email to {selectedClub === 'all' ? 'All Clubs' : clubs.find(c => c.id === parseInt(selectedClub))?.name}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Email Delivery Info</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Emails are sent to all approved members of the selected club(s). 
                Members will receive emails at their registered email addresses.
                Event reminders and attendance requests help keep your club engaged!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


