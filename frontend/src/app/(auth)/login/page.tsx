'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/auth';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#2d2d2d] border-none">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">Login to Bloyid</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-white">Email</label>
              <Input
                id="email"
                type="email"
                className="bg-[#1a1a1a] border-gray-700 text-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
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
              />
            </div>

            <Button type="submit" className="w-full bg-[#3b82f6] hover:bg-[#2563eb] font-bold">
              Login
            </Button>

            <div className="text-center text-white">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#3b82f6] hover:text-[#2563eb]">
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}