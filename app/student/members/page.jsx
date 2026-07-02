"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search, Crown, Mail } from 'lucide-react'

const fetcher = (url) => fetch(url).then(r => r.json())

export default function StudentMembersPage() {
  const { user } = useAuth()
  const { data: members } = useSWR(
    user?.club_id ? `/api/users?club_id=${user.club_id}` : null,
    fetcher
  )
  const [search, setSearch] = useState('')

  const approvedMembers = members?.filter(m => m.status === 'approved') || []
  const filteredMembers = approvedMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  const leader = filteredMembers.find(m => m.role === 'leader')
  const regularMembers = filteredMembers.filter(m => m.role !== 'leader')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Club Members</h1>
          <p className="text-muted-foreground">Connect with your fellow club members</p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <Users className="w-4 h-4 mr-2" />
          {approvedMembers.length} Members
        </Badge>
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

      {/* Club Leader */}
      {leader && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Club Leader
          </h2>
          <div>
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-400 text-3xl font-bold">{leader.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-xl">{leader.name}</h3>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        <Crown className="w-3 h-3 mr-1" />
                        Leader
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{leader.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Regular Members */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularMembers.map((member) => (
            <div key={member.id}>
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">{member.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{member.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {filteredMembers.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No members found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


