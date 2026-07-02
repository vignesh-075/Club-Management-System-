"use client"

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Search, Clock, CheckCircle, XCircle, Building2, Loader2, CreditCard
} from 'lucide-react'

const fetcher = (url) => fetch(url).then(r => r.json())

export default function LeaderRequestsPage() {
  const { user, loading } = useAuth()
  const { data: pendingUsers, mutate: mutatePending } = useSWR(
    user?.club_id ? `/api/users?status=pending&clubId=${user.club_id}` : null, 
    fetcher
  )
  const [search, setSearch] = useState('')
  const [processing, setProcessing] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showIdCard, setShowIdCard] = useState(false)

  async function handleAction(userId, action) {
    setProcessing(userId)
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      })
      
      // Send notification if approved
      if (action === 'approved') {
        const approvedUser = pendingUsers?.find(u => u.id === userId)
        if (approvedUser) {
          await fetch('/api/inbox', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clubId: user.club_id,
              subject: 'Membership Approved!',
              message: `Congratulations ${approvedUser.name}! Your membership has been approved by ${user.name}. Welcome to ${user.club_name}!`,
              fromName: user.name
            })
          })
        }
      }
      
      mutatePending()
      setShowIdCard(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error:', error)
    }
    setProcessing(null)
  }

  const filteredUsers = pendingUsers?.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  ) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Join Requests</h1>
          <p className="text-muted-foreground">Review and verify student ID cards before approval</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Clock className="w-4 h-4 mr-2" />
          {filteredUsers.length} Pending
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
            <p className="text-muted-foreground">All join requests have been processed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((reqUser) => (
            <Card key={reqUser.id} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-xl font-bold">
                        {reqUser.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{reqUser.name}</h3>
                      <p className="text-sm text-muted-foreground">{reqUser.email}</p>
                      {reqUser.phone && <p className="text-xs text-muted-foreground">{reqUser.phone}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {reqUser.id_card_image && (
                      <Button
                        variant="outline"
                        onClick={() => { setSelectedUser(reqUser); setShowIdCard(true); }}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        View ID
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleAction(reqUser.id, 'rejected')}
                      disabled={processing === reqUser.id}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction(reqUser.id, 'approved')}
                      disabled={processing === reqUser.id}
                    >
                      {processing === reqUser.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ID Card Modal */}
      <Dialog open={showIdCard} onOpenChange={setShowIdCard}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              ID Card - {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedUser?.id_card_image && (
              <img 
                src={selectedUser.id_card_image} 
                alt="Student ID Card" 
                className="w-full rounded-lg border border-border"
              />
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Name:</div>
              <div className="font-medium">{selectedUser?.name}</div>
              <div className="text-muted-foreground">Email:</div>
              <div className="font-medium">{selectedUser?.email}</div>
              <div className="text-muted-foreground">Phone:</div>
              <div className="font-medium">{selectedUser?.phone || 'N/A'}</div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => handleAction(selectedUser?.id, 'rejected')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleAction(selectedUser?.id, 'approved')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


