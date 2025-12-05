import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import UniversityCard from './UniversityCard'
import { useLanguage } from '../contexts/LanguageContext'

function FavoritesList({ 
  universities, 
  favorites, 
  toggleFavorite, 
  toggleCompare, 
  compareList 
}) {
  const { t } = useLanguage()
  const favoriteUniversities = universities.filter(uni => 
    favorites.includes(uni.id)
  )

  if (favoriteUniversities.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t('favorites.empty')}</h3>
        <p className="text-slate-400 mb-6">
          {t('favorites.emptyText')}
        </p>
        <Link to="/universities" className="btn-primary inline-block">
          {t('favorites.goToCatalog')}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteUniversities.map(university => (
        <UniversityCard
          key={university.id}
          university={university}
          toggleFavorite={toggleFavorite}
          isFavorite={favorites.includes(university.id)}
          toggleCompare={toggleCompare}
          isInCompare={compareList.includes(university.id)}
        />
      ))}
    </div>
  )
}

export default FavoritesList
