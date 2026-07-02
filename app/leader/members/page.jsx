"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, Search, CheckCircle, XCircle, Trash2, UserCheck, Clock
} from 'lucide-react'

const fetcher = (url) => fetch(url).then(r => r.json())

export default function LeaderMembersPage() {
  const { user } = useAuth()
  const { data: members, mutate: mutateMembers } = useSWR(
    user?.club_id ? `/api/users?club_id=${user.club_id}` : null, 
    fetcher
  )
  const [search, setSearch] = useState('')
  const [processing, setProcessing] = useState(null)

  const approvedMembers = members?.filter(m => m.status === 'approved') || []
  const pendingMembers = members?.filter(m => m.status === 'pending') || []

  async function handleAction(userId, status) {
    setProcessing(userId)
    await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    mutateMembers()
    setProcessing(null)
  }

  async function handleRemove(userId) {
    if (!confirm('Remove this member from the club?')) return
    await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' })
    })
    mutateMembers()
  }

  const filterMembers = (list) => list.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Club Members</h1>
          <p className="text-muted-foreground">Manage your club members</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            {approvedMembers.length} Members
          </Badge>
          {pendingMembers.length > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-400 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {pendingMembers.length} Pending
            </Badge>
          )}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members ({approvedMembers.length})</TabsTrigger>
          <TabsTrigger value="requests">
            Requests ({pendingMembers.length})
            {pendingMembers.length > 0 && (
              <span className="ml-2 w-2 h-2 rounded-full bg-yellow-400"></span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <div className="grid gap-4">
            {filterMembers(approvedMembers).map((member) => (
              <div key={member.id}>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">{member.name.charAt(0)}</span>
</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            {filterMembers(approvedMembers).length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No members found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <div className="grid gap-4">
            {filterMembers(pendingMembers).map((member) => (
              <div key={member.id}>
                <Card className="bg-card border-border border-yellow-500/30">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <span className="text-yellow-400 font-bold">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-yellow-400 mt-1">Wants to join your club</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleAction(member.id, 'rejected')}
                        disabled={processing === member.id}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction(member.id, 'approved')}
                        disabled={processing === member.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            {filterMembers(pendingMembers).length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


