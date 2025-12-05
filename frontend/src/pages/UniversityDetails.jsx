import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, Star, Phone, Mail, Globe, Calendar, Users,
  Heart, GitCompare, ArrowLeft, Building2, GraduationCap,
  DollarSign, Home, ExternalLink, ChevronLeft, ChevronRight
} from 'lucide-react'
import { getUniversity } from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'

function UniversityDetails({ toggleFavorite, favorites, toggleCompare, compareList }) {
  const { id } = useParams()
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const data = await getUniversity(id)
        setUniversity(data)
      } catch (error) {
        console.error('Error fetching university:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUniversity()
  }, [id])

  const formatTuition = (amount) => {
    if (amount === 0 || amount === '0.00') return t('card.free')
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸'
  }

  const getStudyFormLabel = (studyForm) => {
    if (studyForm === 'full-time') return t('universities.studyForms.fullTime')
    if (studyForm === 'part-time') return t('universities.studyForms.partTime')
    if (studyForm === 'both') return t('card.both')
    return studyForm
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-5 h-5 fill-amber-400/50 text-amber-400" />)
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-slate-600" />)
      }
    }
    return stars
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-slate-700 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="card p-8">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-slate-700 rounded-2xl" />
                    <div className="flex-1">
                      <div className="h-8 w-3/4 bg-slate-700 rounded mb-2" />
                      <div className="h-4 w-1/2 bg-slate-700 rounded mb-4" />
                      <div className="h-20 bg-slate-700 rounded" />
                    </div>
                  </div>
                </div>
                <div className="card p-8 h-[600px] bg-slate-700" />
              </div>
              <div className="space-y-6">
                <div className="card p-6 h-48 bg-slate-700" />
                <div className="card p-6 h-64 bg-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-500" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('details.notFound')}</h2>
          <p className="text-slate-400 mb-6">{t('details.notFoundDesc')}</p>
          <Link to="/universities" className="btn-primary">
            {t('compare.goToCatalog')}
          </Link>
        </div>
      </div>
    )
  }

  const isFavorite = favorites.includes(university.id)
  const isInCompare = compareList.includes(university.id)

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/universities" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('details.backToCatalog')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {university.logo ? (
                    <img 
                      src={university.logo} 
                      alt={university.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-slate-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {university.name}
                      </h1>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-primary-400" />
                        <span>{university.city}</span>
                        {university.address && (
                          <>
                            <span>•</span>
                            <span className="text-sm">{university.address}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(university.id)}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          isFavorite
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-slate-700 text-slate-400 hover:text-red-400'
                        }`}
                        title={isFavorite ? t('card.removeFavorite') : t('card.addFavorite')}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => toggleCompare(university.id)}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          isInCompare
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'bg-slate-700 text-slate-400 hover:text-primary-400'
                        }`}
                        title={isInCompare ? t('card.removeCompare') : t('card.addCompare')}
                      >
                        <GitCompare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">{renderStars(parseFloat(university.rating))}</div>
                    <span className="text-white font-bold text-lg">{university.rating}</span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 leading-relaxed">
                    {university.description}
                  </p>
                </div>
              </div>
            </div>

            {/* 3D Tour Section */}
            {university.iframe_3d_tour_url && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary-400" />
                  {t('details.virtualTour')}
                </h2>
                <div className="relative rounded-xl overflow-hidden bg-slate-800">
                  <iframe
                    src={university.iframe_3d_tour_url}
                    className="w-full h-[500px]"
                    allowFullScreen
                    loading="lazy"
                    title={`${university.name} ${t('details.virtualTour')}`}
                  />
                </div>
                <p className="text-slate-400 text-sm mt-4">
                  {t('details.tourDesc')}
                </p>
              </div>
            )}

            {/* Gallery */}
            {university.images && university.images.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4">{t('details.gallery')}</h2>
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-800">
                    <img
                      src={university.images[activeImageIndex].image}
                      alt={university.images[activeImageIndex].caption || `${university.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {university.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIndex(prev => 
                          prev === 0 ? university.images.length - 1 : prev - 1
                        )}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setActiveImageIndex(prev => 
                          prev === university.images.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>
                
                {university.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {university.images.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === activeImageIndex 
                            ? 'border-primary-500' 
                            : 'border-transparent hover:border-slate-600'
                        }`}
                      >
                        <img
                          src={img.image}
                          alt={img.caption || `${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Programs */}
            {university.programs && university.programs.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-400" />
                  {t('details.programsOffered')} ({university.programs.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {university.programs.map(program => (
                    <div 
                      key={program.id}
                      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-primary-500/30 transition-colors"
                    >
                      <div className="text-xs text-primary-400 font-medium mb-1">
                        {program.code}
                      </div>
                      <div className="text-white font-medium">
                        {program.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-4">{t('details.quickInfo')}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{t('details.tuitionFee')}</span>
                  </div>
                  <span className="text-white font-semibold">
                    {formatTuition(university.tuition)}{t('card.perYear')}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>{t('details.studyForm')}</span>
                  </div>
                  <span className="text-white">
                    {getStudyFormLabel(university.study_form)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Home className="w-4 h-4" />
                    <span>{t('details.dormitory')}</span>
                  </div>
                  <span className={university.has_dormitory ? 'text-green-400' : 'text-slate-500'}>
                    {university.has_dormitory ? t('details.hasIt') : t('details.noIt')}
                  </span>
                </div>

                {university.founded_year && (
                  <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>{t('details.founded')}</span>
                    </div>
                    <span className="text-white">{university.founded_year}</span>
                  </div>
                )}

                {university.students_count && (
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{t('details.students')}</span>
                    </div>
                    <span className="text-white">
                      {new Intl.NumberFormat('ru-RU').format(university.students_count)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Card */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-4">{t('details.contacts')}</h3>
              
              <div className="space-y-4">
                {university.phone && (
                  <a 
                    href={`tel:${university.phone}`}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">{t('details.phone')}</div>
                      <div className="text-white">{university.phone}</div>
                    </div>
                  </a>
                )}

                {university.email && (
                  <a 
                    href={`mailto:${university.email}`}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">{t('details.email')}</div>
                      <div className="text-white">{university.email}</div>
                    </div>
                  </a>
                )}

                {university.website && (
                  <a 
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-400">{t('details.website')}</div>
                      <div className="text-white flex items-center gap-1">
                        <span className="truncate">{university.website}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/30">
              <h3 className="text-lg font-bold text-white mb-2">{t('details.interested')}</h3>
              <p className="text-slate-400 text-sm mb-4">
                {t('details.interestedDesc')}
              </p>
              <Link 
                to="/compare"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <GitCompare className="w-4 h-4" />
                {t('details.goToCompare')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UniversityDetails
