import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import PostForm from '@/components/feed/PostForm'
import Feed from '@/components/feed/Feed'
import TrendingSidebar from '@/components/explore/TrendingSidebar'

const Home: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Gauche */}
          <div className="lg:col-span-3">
            <Sidebar />
          </div>

          {/* Feed Principal */}
          <div className="lg:col-span-6 space-y-6">
            {/* Créer un post */}
            <PostForm />

            {/* Feed */}
            <Feed />
          </div>

          {/* Sidebar Droite */}
          <div className="lg:col-span-3">
            <TrendingSidebar />
            
            {/* Suggestions d'amis */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Suggestions
              </h3>
              {/* Liste de suggestions */}
            </div>

            {/* Badges récents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Badges récents
              </h3>
              {/* Liste de badges */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
