'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { setAuthToken, getAuthToken } from '@/lib/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      router.replace('/admin')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const isProd = process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.location.protocol !== 'http:'
      const url = '/api/auth'

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username: username.trim(), password })
      })

      const data = await res.json()

      if (res.ok && data.success && data.token) {
        setAuthToken(data.token)
        router.push('/admin')
      } else {
        setError(data.message || 'Invalid username or password.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#1c1c1c] font-serif flex flex-col justify-between p-6 md:p-12">
      {/* Top Header */}
      <div className="flex justify-between items-baseline border-b border-[#111] pb-3">
        <Link href="/" className="text-[14px] md:text-[15px] hover:opacity-50 transition-opacity">
          Ghazwan Allaf
        </Link>
        <span className="text-[12px] text-[#777]">Dashboard Access</span>
      </div>

      {/* Login Box */}
      <div className="max-w-[380px] w-full mx-auto my-auto py-12 space-y-6">
        <div className="space-y-1">
          <h1 className="text-[20px] font-normal text-[#111] tracking-tight">
            Sign In
          </h1>
          <p className="text-[12px] text-[#777]">
            Enter your administrative credentials to manage archive artworks.
          </p>
        </div>

        {error && (
          <div className="text-[12px] text-[#b00] border-l-2 border-[#b00] pl-3 py-1 bg-red-50/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-[13px]">
          <div className="space-y-1">
            <label className="text-[11px] text-[#888] block uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full border border-[#d0d0d0] p-2.5 outline-none focus:border-[#111] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#888] block uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-[#d0d0d0] p-2.5 outline-none focus:border-[#111] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111] text-white p-2.5 text-[13px] hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard →'}
          </button>
        </form>

        <div className="pt-4 text-center">
          <Link href="/" className="text-[12px] text-[#888] hover:text-[#111] underline">
            ← Return to main website
          </Link>
        </div>
      </div>

      {/* Footer info */}
      <div className="border-t border-[#f0f0f0] pt-4 text-[11px] text-[#888] flex justify-between">
        <span>Ghazwan Allaf Archive</span>
        <span>Secure Administration</span>
      </div>
    </main>
  )
}
