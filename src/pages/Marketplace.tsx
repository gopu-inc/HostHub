import React, { useState } from 'react'
import { useQuery } from 'react-query'
import Header from '@/components/layout/Header'
import { ShoppingBag, Filter, Tag, Coins } from 'lucide-react'
import ListingCard from '@/components/marketplace/ListingCard'
import { getMarketplaceListings } from '@/services/api/marketplace'
import { useAuth } from '@/contexts/AuthContext'

const Marketplace: React.FC = () => {
  const { user } = useAuth()
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

  const { data: listings, isLoading } = useQuery(
    ['marketplace', category, sortBy, priceRange],
    () => getMarketplaceListings({ category, sort_by: sortBy, min_price: priceRange[0], max_price: priceRange[1] })
  )

  const categories = [
    { id: 'all', label: 'Tout', icon: ShoppingBag },
    { id: 'digital', label: 'Digital', icon: Tag },
    { id: 'template', label: 'Templates', icon: Tag },
    { id: 'plugin', label: 'Plugins', icon: Tag },
    { id: 'course', label: 'Cours', icon: Tag },
    { id: 'service', label: 'Services', icon: Tag },
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
                <ShoppingBag className="w-8 h-8 text-green-500" />
                Marketplace
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Achetez et vendez des ressources, templates et services
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-full">
                <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                  {user?.hcoins_balance || 0} HCoins
                </span>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:opacity-90">
                Vendre un item
              </button>
            </div>
          </div>

          {/* Catégories */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-4 pb-2">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
                      category === cat.id
                        ? 'bg-green-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                >
                  <option value="newest">Plus récent</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="popular">Plus populaire</option>
                </select>
              </div>

              {/* Fourchette de prix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fourchette de prix: {priceRange[0]} - {priceRange[1]} HCoins
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Recherche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rechercher
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher des items..."
                    className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                  />
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des items */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : listings?.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucun item trouvé
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Essayez de modifier vos filtres ou soyez le premier à vendre!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings?.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Marketplace
