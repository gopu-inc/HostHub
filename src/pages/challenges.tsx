import React, { useState } from 'react'
import { useQuery } from 'react-query'
import Header from '@/components/layout/Header'
import { Trophy, Filter, Plus } from 'lucide-react'
import ChallengeCard from '@/components/challenges/ChallengeCard'
import ChallengeForm from '@/components/challenges/ChallengeForm'
import { getChallenges } from '@/services/api/challenges'

const Challenges: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const { data: challenges, isLoading } = useQuery(
    ['challenges', filter, search],
    () => getChallenges({ status: filter, search })
  )

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'upcoming', label: 'À venir' },
    { id: 'active', label: 'Actifs' },
    { id: 'ended', label: 'Terminés' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Défis & Compétitions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Participez à des défis, gagnez des HCoins et obtenez des badges
              </p>
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer un défi
            </button>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher des défis..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex space-x-2 overflow-x-auto">
                  {filters.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                        filter === f.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des défis */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : challenges?.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucun défi trouvé
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter !== 'all' ? 'Aucun défi dans cette catégorie' : 'Soyez le premier à créer un défi!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges?.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de création de défi */}
      {showCreateForm && (
        <ChallengeForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  )
}

export default Challenges
