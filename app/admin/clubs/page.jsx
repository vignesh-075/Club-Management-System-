"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, Search, Eye, Brain, Shield, Lightbulb, Palette, Code, Building2
} from 'lucide-react'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then(r => r.json())

const clubIcons = {
  'AI Club': Brain,
  'Cybersecurity Club': Shield,
  'Innovation Club': Lightbulb,
  'Creativity Club': Palette,
  'Web Dev Club': Code
}

const clubColors = {
  'AI Club': 'from-blue-500 to-cyan-500',
  'Cybersecurity Club': 'from-red-500 to-orange-500',
  'Innovation Club': 'from-green-500 to-emerald-500',
  'Creativity Club': 'from-pink-500 to-rose-500',
  'Web Dev Club': 'from-violet-500 to-purple-500'
}

export default function AdminClubsPage() {
  const { data: clubs } = useSWR('/api/clubs', fetcher)
  const [search, setSearch] = useState('')

  const filteredClubs = clubs?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Clubs</h1>
          <p className="text-muted-foreground">Manage all clubs in ClubSync</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClubs?.map((club, i) => {
          const Icon = clubIcons[club.name] || Building2
          const gradient = clubColors[club.name] || 'from-gray-500 to-gray-600'
          
          return (
            <div key={club.id}>
              <Card className="bg-card border-border overflow-hidden">
                <div className={`h-32 bg-gradient-to-br ${gradient} relative`}>
                  <Icon className="absolute bottom-4 left-6 w-12 h-12 text-white/80" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-1">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">{club.description}</p>
                    </div>
                    {club.pending_count > 0 && (
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        {club.pending_count} pending
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{club.member_count || 0}</p>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{club.pending_count || 0}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Leader: <span className="text-foreground">{club.leader_name || 'Not assigned'}</span>
                    </p>
                    <Link href={`/admin/clubs/${club.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}


