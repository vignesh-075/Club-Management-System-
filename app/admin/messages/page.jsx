'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, Send, Crown, Shield, User, Building2 } from 'lucide-react'
import useSWR, { mutate } from 'swr'

const fetcher = url => fetch(url).then(r => r.json())

export default function AdminMessagesPage() {
  const { user, loading } = useAuth()
  const [selectedClub, setSelectedClub] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  
  const { data: clubs = [] } = useSWR('/api/clubs', fetcher)
  
  const { data: messages = [], isLoading } = useSWR(
    selectedClub ? `/api/messages?club_id=${selectedClub}` : null,
    fetcher,
    { refreshInterval: 3000 }
  )
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Auto-select first club
  useEffect(() => {
    if (clubs.length > 0 && !selectedClub) {
      setSelectedClub(clubs[0].id)
    }
  }, [clubs, selectedClub])
  
  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim() || !selectedClub) return
    
    setSending(true)
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club_id: selectedClub, content: message.trim() })
      })
      setMessage('')
      mutate(`/api/messages?club_id=${selectedClub}`)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
    setSending(false)
  }
  
  const getRoleIcon = (role) => {
    if (role === 'leader') return <Crown className="w-3 h-3 text-yellow-500" />
    if (role === 'admin') return <Shield className="w-3 h-3 text-red-500" />
    return <User className="w-3 h-3 text-muted-foreground" />
  }
  
  const getRoleBadge = (role) => {
    if (role === 'leader') return <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">Leader</Badge>
    if (role === 'admin') return <Badge className="bg-red-500/20 text-red-500 text-xs">Admin</Badge>
    return <Badge variant="secondary" className="text-xs">Member</Badge>
  }
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  const formatDate = (date) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (d.toDateString() === today.toDateString()) return 'Today'
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.created_at)
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
    return groups
  }, {})
  
  const selectedClubName = clubs.find(c => c.id === selectedClub)?.name || 'Select Club'

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
        <p className="text-muted-foreground">Please log in to access this page</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Club Messages</h1>
          <p className="text-muted-foreground mt-1">View and participate in club conversations</p>
        </div>
        
        <Select value={selectedClub?.toString()} onValueChange={(v) => setSelectedClub(parseInt(v))}>
          <SelectTrigger className="w-[200px]">
            <Building2 className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select Club" />
          </SelectTrigger>
          <SelectContent>
            {clubs.map((club) => (
              <SelectItem key={club.id} value={club.id.toString()}>
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            {selectedClubName} Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages Container */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {!selectedClub ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Building2 className="w-12 h-12 mb-2 opacity-50" />
                <p>Select a club to view messages</p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                      {date}
                    </div>
                  </div>
                  {msgs.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3 mb-4 ${msg.user_id === parseInt(user?.id) ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className={
                          msg.user_role === 'admin' ? 'bg-red-500/20 text-red-500' :
                          msg.user_role === 'leader' ? 'bg-yellow-500/20 text-yellow-500' : 
                          'bg-primary/20 text-primary'
                        }>
                          {msg.user_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${msg.user_id === parseInt(user?.id) ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${msg.user_id === parseInt(user?.id) ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-medium flex items-center gap-1">
                            {getRoleIcon(msg.user_role)}
                            {msg.user_name}
                          </span>
                          {getRoleBadge(msg.user_role)}
                        </div>
                        <div className={`rounded-2xl px-4 py-2 ${
                          msg.user_id === parseInt(user?.id) 
                            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                            : 'bg-muted rounded-tl-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 ${msg.user_id === parseInt(user?.id) ? 'text-right' : ''}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSend} className="border-t border-border/50 p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message as admin..."
                className="flex-1 bg-muted/50"
                disabled={sending || !selectedClub}
              />
              <Button type="submit" disabled={!message.trim() || sending || !selectedClub}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


