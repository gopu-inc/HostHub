'use client'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <aside className="w-64 bg-gray-50 min-h-screen p-6">
      <div className="mb-8">
        <img
          src={user.avatar_url || '/default-avatar.png'}
          alt={user.username}
          className="w-16 h-16 rounded-full mx-auto mb-4"
        />
        <h2 className="text-center font-semibold">{user.username}</h2>
        <p className="text-center text-gray-600 text-sm">{user.email}</p>
      </div>

      <nav className="space-y-2">
        <Link href="/dashboard" className="block p-2 hover:bg-gray-200 rounded">
          🏠 Home
        </Link>
        <Link href="/dashboard/profile" className="block p-2 hover:bg-gray-200 rounded">
          👤 Profile
        </Link>
        <Link href="/dashboard/explore" className="block p-2 hover:bg-gray-200 rounded">
          🔍 Explore
        </Link>
        <Link href="/dashboard/messages" className="block p-2 hover:bg-gray-200 rounded">
          💬 Messages
        </Link>
      </nav>
    </aside>
  )
}
