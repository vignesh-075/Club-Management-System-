"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, User, Mail, Lock, Building2, Upload, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'

const fetcher = url => fetch(url).then(r => r.json())

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    clubId: '',
    idCardImage: null
  })
  const [idCardPreview, setIdCardPreview] = useState(null)
  
  const { data: clubsData } = useSWR('/api/clubs', fetcher)
  const clubs = Array.isArray(clubsData) ? clubsData : (clubsData?.clubs || [])
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setIdCardPreview(reader.result)
        setFormData({ ...formData, idCardImage: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }
  
  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all required fields')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    setError('')
    return true
  }
  
  const validateStep2 = () => {
    if (!formData.clubId) {
      setError('Please select a club')
      return false
    }
    if (!formData.idCardImage) {
      setError('Please upload your ID card')
      return false
    }
    setError('')
    return true
  }
  
  const handleSubmit = async () => {
    if (!validateStep2()) return
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          clubId: formData.clubId,
          idCardImage: formData.idCardImage
        })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Registration Successful!</h2>
            <p className="text-muted-foreground">
              Your request has been submitted. The club leader will review your ID card and approve your membership.
            </p>
            <p className="text-sm text-muted-foreground">
              You will receive an email notification once approved.
            </p>
            <Button onClick={() => router.push('/login')} className="mt-4">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">ClubSync</span>
          </div>
          <CardTitle className="text-2xl">Student Registration</CardTitle>
          <CardDescription>
            Step {step} of 2: {step === 1 ? 'Personal Details' : 'Club Selection & ID Verification'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="your.email@university.edu"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Min 6 characters"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    placeholder="Re-enter password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => validateStep1() && setStep(2)}
              >
                Next Step
              </Button>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Club *</Label>
                <Select value={formData.clubId} onValueChange={(v) => setFormData({...formData, clubId: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a club to join" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map(club => (
                      <SelectItem key={club._id} value={String(club._id)}>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {club.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Upload ID Card *</Label>
                <p className="text-xs text-muted-foreground">Upload your student ID card for verification</p>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  {idCardPreview ? (
                    <div className="space-y-2">
                      <img src={idCardPreview} alt="ID Card Preview" className="max-h-40 mx-auto rounded" />
                      <Button variant="outline" size="sm" onClick={() => {
                        setIdCardPreview(null)
                        setFormData({...formData, idCardImage: null})
                      }}>
                        Remove & Re-upload
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      <div className="space-y-2">
                        <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Click to upload ID card image</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">Login here</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


