import { Link } from 'react-router-dom'
import { Heart, GitCompare, MapPin, Star, GraduationCap, Building2, DollarSign } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

function UniversityCard({ 
  university, 
  toggleFavorite, 
  isFavorite, 
  toggleCompare, 
  isInCompare 
}) {
  const { t } = useLanguage()

  const formatTuition = (amount) => {
    if (amount === 0 || amount === '0.00') return t('card.free')
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸'
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-amber-400/50 text-amber-400" />
        )
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-slate-600" />
        )
      }
    }
    return stars
  }

  const getStudyFormLabel = () => {
    if (university.study_form === 'both') return t('card.both')
    if (university.study_form === 'full-time') return t('card.fullTime')
    return t('card.partTime')
  }

  return (
    <div className="card p-6 group relative overflow-hidden">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(university.id)
          }}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isFavorite
              ? 'bg-red-500/20 text-red-400'
              : 'bg-slate-700/80 text-slate-400 hover:text-red-400'
          }`}
          title={isFavorite ? t('card.removeFavorite') : t('card.addFavorite')}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleCompare(university.id)
          }}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isInCompare
              ? 'bg-primary-500/20 text-primary-400'
              : 'bg-slate-700/80 text-slate-400 hover:text-primary-400'
          }`}
          title={isInCompare ? t('card.removeCompare') : t('card.addCompare')}
        >
          <GitCompare className="w-5 h-5" />
        </button>
      </div>

      {/* University Logo */}
      <div className="relative mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
          {university.logo ? (
            <img 
              src={university.logo} 
              alt={university.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-10 h-10 text-slate-500" />
          )}
        </div>
      </div>

      {/* University Info */}
      <div className="relative space-y-3">
        <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
          {university.name}
        </h3>

        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-4 h-4 text-primary-400" />
          <span className="text-sm">{university.city}</span>
        </div>

        <p className="text-slate-400 text-sm line-clamp-2">
          {university.description}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-1">
            {renderStars(parseFloat(university.rating))}
            <span className="text-white font-medium ml-1">{university.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-white font-semibold">
              {formatTuition(university.tuition)}
            </span>
            <span className="text-slate-500 text-sm">{t('card.perYear')}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <GraduationCap className="w-4 h-4" />
            <span>{university.programs_count || 0} {t('card.programs')}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
            university.has_dormitory 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-slate-700 text-slate-400'
          }`}>
            {university.has_dormitory ? t('card.hasDormitory') : t('card.noDormitory')}
          </span>
          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary-500/20 text-primary-400">
            {getStudyFormLabel()}
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/universities/${university.id}`}
          className="mt-4 block w-full py-3 text-center bg-gradient-to-r from-primary-500/10 to-accent-500/10 hover:from-primary-500/20 hover:to-accent-500/20 border border-primary-500/30 hover:border-primary-500/50 rounded-xl text-primary-400 font-medium transition-all duration-300"
        >
          {t('card.details')}
        </Link>
      </div>
    </div>
  )
}

export default UniversityCard
