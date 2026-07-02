"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Users, Shield, Sparkles, Brain, Lightbulb, Palette, Code, Eye, EyeOff, Key } from 'lucide-react'
import Link from 'next/link'

const clubIcons = {
  'AI Club': Brain,
  'Cybersecurity Club': Shield,
  'Innovation Club': Lightbulb,
  'Creativity Club': Palette,
  'Web Dev Club': Code
}

const credentialsData = {
  admin: {
    name: "System Administrator",
    email: "admin@club.com",
    password: "admin123",
    role: "admin",
    club: "All Clubs"
  },
  clubs: [
    {
      name: "AI Club",
      icon: Brain,
      leader: {
        name: "Dr. Sarah Chen",
        email: "ai.leader@club.com",
        password: "aileader123",
        department: "Computer Science"
      },
      students: [
        {
          name: "Alex Kumar",
          email: "ai.student1@club.com",
          password: "student123",
          department: "Computer Science"
        },
        {
          name: "Emma Wilson",
          email: "ai.student2@club.com",
          password: "student123",
          department: "Computer Science"
        }
      ]
    },
    {
      name: "Cybersecurity Club",
      icon: Shield,
      leader: {
        name: "Michael Park",
        email: "cyber.leader@club.com",
        password: "cyberleader123",
        department: "Information Security"
      },
      students: [
        {
          name: "David Kim",
          email: "cyber.student1@club.com",
          password: "student123",
          department: "Information Security"
        },
        {
          name: "Lisa Anderson",
          email: "cyber.student2@club.com",
          password: "student123",
          department: "Information Security"
        }
      ]
    },
    {
      name: "Innovation Club",
      icon: Lightbulb,
      leader: {
        name: "Dr. James Wilson",
        email: "innovation.leader@club.com",
        password: "innovationleader123",
        department: "Business Innovation"
      },
      students: [
        {
          name: "Olivia Brown",
          email: "innovation.student1@club.com",
          password: "student123",
          department: "Business Innovation"
        },
        {
          name: "Ryan Martinez",
          email: "innovation.student2@club.com",
          password: "student123",
          department: "Business Innovation"
        }
      ]
    },
    {
      name: "Creativity Club",
      icon: Palette,
      leader: {
        name: "Sophia Taylor",
        email: "creativity.leader@club.com",
        password: "creativityleader123",
        department: "Arts & Design"
      },
      students: [
        {
          name: "Ethan Davis",
          email: "creativity.student1@club.com",
          password: "student123",
          department: "Arts & Design"
        },
        {
          name: "Ava Johnson",
          email: "creativity.student2@club.com",
          password: "student123",
          department: "Arts & Design"
        }
      ]
    },
    {
      name: "Web Dev Club",
      icon: Code,
      leader: {
        name: "Chris Rodriguez",
        email: "webdev.leader@club.com",
        password: "webdevleader123",
        department: "Web Development"
      },
      students: [
        {
          name: "Mia Thompson",
          email: "webdev.student1@club.com",
          password: "student123",
          department: "Web Development"
        },
        {
          name: "Noah Garcia",
          email: "webdev.student2@club.com",
          password: "student123",
          department: "Web Development"
        }
      ]
    }
  ]
}

export default function LoginPage() {
  const { login, register, user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [clubs, setClubs] = useState([])
  const [showPasswords, setShowPasswords] = useState(false)
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', club_id: '' })

  useEffect(() => {
    fetch('/api/clubs').then(r => r.json()).then(setClubs)
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    const result = await login(loginForm.email, loginForm.password)
    if (!result.success) setError(result.error)
    setIsLoading(false)
  }

  async function handleRegister(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    const result = await register(registerForm.name, registerForm.email, registerForm.password, parseInt(registerForm.club_id))
    if (result.success) {
      setSuccess(result.message)
      setRegisterForm({ name: '', email: '', password: '', club_id: '' })
    } else {
      setError(result.error)
    }
    setIsLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold text-foreground">ClubSync</span>
          </Link>
        </div>
        
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            Manage Your Clubs<br />
            <span className="text-primary">All in One Place</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Join AI, Cybersecurity, Innovation, Creativity, or Web Dev clubs. 
            Connect with like-minded students and grow together.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            {clubs.slice(0, 5).map((club) => {
              const Icon = clubIcons[club.name] || Users
              return (
                <div
                  key={club._id}
                  className="p-4 rounded-xl bg-card/50 border border-border text-center hover:scale-105 transition-transform"
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">{club.name}</p>
                </div>
              )
            })}
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm">
          Managed by Faculty Admin
        </p>
      </div>

      {/* Right Panel - Login/Register */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">ClubSync</span>
              </div>
              <CardTitle className="text-2xl">Welcome</CardTitle>
              <CardDescription>Sign in to your account or register</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty View</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.edu"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                    
                    {error && (
                      <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>
                    )}
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Quick Access:</p>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <p><strong>Admin:</strong> admin@club.com / admin123</p>
                        <p><strong>Leaders:</strong> [club].leader@club.com / [club]leader123</p>
                        <p><strong>Students:</strong> [club].student1@club.com / student123</p>
                        <p className="text-blue-600">👁️ Click "Faculty View" tab for all credentials</p>
                      </div>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <div className="space-y-4 text-center">
                    <p className="text-muted-foreground">
                      Create a new account with ID card verification
                    </p>
                    <Link href="/register">
                      <Button className="w-full">
                        Complete Registration Form
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      You will need to upload your student ID card for verification
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="faculty">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Faculty Credentials View
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="flex items-center gap-1"
                      >
                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPasswords ? 'Hide' : 'Show'} Passwords
                      </Button>
                    </div>

                    {/* Admin Credentials */}
                    <Card className="border-red-200 bg-red-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-red-700 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          System Administrator
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div><strong>Name:</strong> {credentialsData.admin.name}</div>
                          <div><strong>Email:</strong> {credentialsData.admin.email}</div>
                          <div><strong>Password:</strong> 
                            <span className="font-mono bg-white px-2 py-1 rounded border">
                              {showPasswords ? credentialsData.admin.password : '•••••••'}
                            </span>
                          </div>
                          <div><strong>Access:</strong> {credentialsData.admin.club}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Club Credentials */}
                    {credentialsData.clubs.map((club, index) => {
                      const Icon = club.icon
                      return (
                        <Card key={index} className="border-blue-200 bg-blue-50/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-blue-700 flex items-center gap-2">
                              <Icon className="w-5 h-5" />
                              {club.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Leader */}
                            <div className="bg-white/50 p-3 rounded-lg">
                              <div className="text-sm font-medium text-purple-700 mb-2 flex items-center gap-1">
                                <Shield className="w-4 h-4" />
                                Club Leader
                              </div>
                              <div className="grid grid-cols-1 gap-1 text-xs">
                                <div><strong>Name:</strong> {club.leader.name}</div>
                                <div><strong>Email:</strong> {club.leader.email}</div>
                                <div><strong>Password:</strong> 
                                  <span className="font-mono bg-white px-2 py-1 rounded border text-xs">
                                    {showPasswords ? club.leader.password : '•••••••'}
                                  </span>
                                </div>
                                <div><strong>Department:</strong> {club.leader.department}</div>
                              </div>
                            </div>

                            {/* Students */}
                            <div className="bg-white/50 p-3 rounded-lg">
                              <div className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Club Students (2)
                              </div>
                              <div className="space-y-2">
                                {club.students.map((student, studentIndex) => (
                                  <div key={studentIndex} className="text-xs border-l-2 border-green-300 pl-2">
                                    <div><strong>{studentIndex + 1}. Name:</strong> {student.name}</div>
                                    <div><strong>Email:</strong> {student.email}</div>
                                    <div><strong>Password:</strong> 
                                      <span className="font-mono bg-white px-2 py-1 rounded border">
                                        {showPasswords ? student.password : '•••••••'}
                                      </span>
                                    </div>
                                    <div><strong>Department:</strong> {student.department}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}

                    <div className="text-center pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Total Users: 1 Admin + 5 Leaders + 10 Students = 16 Accounts
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


