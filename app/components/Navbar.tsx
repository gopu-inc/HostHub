'use client'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          HostHub
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard/profile">Profile</Link>
              <Link href="/dashboard/explore">Explore</Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
