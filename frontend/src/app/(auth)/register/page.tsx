'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/chat')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#2d2d2d] border-none">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-white">Username</label>
              <Input
                id="username"
                type="text"
                className="bg-[#1a1a1a] border-gray-700 text-white"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-white">Email</label>
              <Input
                id="email"
                type="email"
                className="bg-[#1a1a1a] border-gray-700 text-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-white">Password</label>
              <Input
                id="password"
                type="password"
                className="bg-[#1a1a1a] border-gray-700 text-white"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-white">Confirm Password</label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-[#1a1a1a] border-gray-700 text-white"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full bg-[#3b82f6] hover:bg-[#2563eb] font-bold text-white">
              Create Account
            </Button>

            <div className="text-center text-white">
              Already have an account?{' '}
              <Link href="/login" className="text-[#3b82f6] hover:text-[#2563eb]">
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}