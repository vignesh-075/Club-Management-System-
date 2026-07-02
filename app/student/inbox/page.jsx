"use client"
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, MailOpen, Trash2, Clock, Building2, ChevronRight, 
  Inbox as InboxIcon, CheckCircle
} from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function StudentInboxPage() {
  const { user, loading } = useAuth()
  const [selectedMessage, setSelectedMessage] = useState(null)
  
  const { data, mutate, isLoading } = useSWR(
    user?.id ? `/api/inbox?userId=${user.id}` : null,
    fetcher,
    { refreshInterval: 5000 }
  )
  
  const messages = data?.messages || []
  const unreadCount = messages.filter(m => !m.is_read).length
  
  const markAsRead = async (id) => {
    await fetch(`/api/inbox/${id}`, { method: 'PUT' })
    mutate()
  }
  
  const deleteMessage = async (id) => {
    await fetch(`/api/inbox/${id}`, { method: 'DELETE' })
    setSelectedMessage(null)
    mutate()
  }
  
  const openMessage = (msg) => {
    setSelectedMessage(msg)
    if (!msg.is_read) {
      markAsRead(msg.id)
    }
  }
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please log in to access your inbox</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inbox</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <Badge variant={unreadCount > 0 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
          <Mail className="w-4 h-4 mr-2" />
          {messages.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <InboxIcon className="w-4 h-4" />
                All Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <InboxIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => openMessage(msg)}
                      className={`p-4 border-b cursor-pointer transition-colors hover:bg-secondary/50 ${
                        selectedMessage?.id === msg.id ? 'bg-secondary' : ''
                      } ${!msg.is_read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${!msg.is_read ? 'text-primary' : 'text-muted-foreground'}`}>
                          {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm truncate ${!msg.is_read ? 'font-semibold' : ''}`}>
                              {msg.subject}
                            </p>
                            {!msg.is_read && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {msg.from_name} - {msg.club_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(msg.created_at)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <Card className="min-h-[500px]">
            {selectedMessage ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedMessage.subject}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {selectedMessage.club_name}
                        </span>
                        <span>From: {selectedMessage.from_name}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(selectedMessage.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Message received in your inbox
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Select a message to read</p>
                  <p className="text-sm mt-1">Click on any message from the list</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}


