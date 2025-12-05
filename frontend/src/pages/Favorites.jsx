import { useState, useEffect } from 'react'
import { Heart, Trash2 } from 'lucide-react'
import { getUniversities } from '../services/api'
import FavoritesList from '../components/FavoritesList'
import { useLanguage } from '../contexts/LanguageContext'

function Favorites({ favorites, toggleFavorite, toggleCompare, compareList }) {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await getUniversities()
        setUniversities(data.results || data)
      } catch (error) {
        console.error('Error fetching universities:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUniversities()
  }, [])

  const clearAllFavorites = () => {
    favorites.forEach(id => toggleFavorite(id))
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-400 fill-current" />
              {t('favorites.title')}
            </h1>
            <p className="text-slate-400">
              {favorites.length === 0 
                ? t('favorites.emptyDesc')
                : t('favorites.saved').replace('{count}', favorites.length) + ' ' + 
                  (favorites.length === 1 ? t('favorites.universityWord') : t('favorites.universitiesWord'))
              }
            </p>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="btn-secondary flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t('favorites.clearAll')}
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="w-20 h-20 bg-slate-700 rounded-2xl mb-4" />
                <div className="h-6 bg-slate-700 rounded mb-2 w-3/4" />
                <div className="h-4 bg-slate-700 rounded mb-4 w-1/2" />
                <div className="h-20 bg-slate-700 rounded mb-4" />
                <div className="h-10 bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <FavoritesList
            universities={universities}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            toggleCompare={toggleCompare}
            compareList={compareList}
          />
        )}

        {/* Info Section */}
        {favorites.length > 0 && (
          <div className="mt-12 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
            <h3 className="text-white font-semibold mb-2">💡 {t('favorites.tip')}</h3>
            <p className="text-slate-400">
              {t('favorites.tipText')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
