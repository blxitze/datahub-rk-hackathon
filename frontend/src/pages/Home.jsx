import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  GraduationCap, 
  Search, 
  GitCompare, 
  Heart, 
  MapPin, 
  ArrowRight,
  Building2,
  Users,
  Award,
  BookOpen
} from 'lucide-react'
import { getUniversities } from '../services/api'
import UniversityCard from '../components/UniversityCard'
import { useLanguage } from '../contexts/LanguageContext'

function Home({ toggleFavorite, favorites, toggleCompare, compareList }) {
  const [featuredUniversities, setFeaturedUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUniversities()
        const universities = data.results || data
        setFeaturedUniversities(universities.slice(0, 6))
      } catch (error) {
        console.error('Error fetching universities:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { icon: Building2, value: '30+', label: t('home.stats.universities') },
    { icon: Users, value: '200K+', label: t('home.stats.students') },
    { icon: Award, value: '10+', label: t('home.stats.programs') },
    { icon: BookOpen, value: '15+', label: t('home.stats.cities') },
  ]

  const features = [
    {
      icon: Search,
      title: t('home.features.explore.title'),
      description: t('home.features.explore.desc'),
    },
    {
      icon: GitCompare,
      title: t('home.features.compare.title'),
      description: t('home.features.compare.desc'),
    },
    {
      icon: Heart,
      title: t('home.features.favorites.title'),
      description: t('home.features.favorites.desc'),
    },
    {
      icon: MapPin,
      title: t('home.features.tours.title'),
      description: t('home.features.tours.desc'),
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
        <div className="hero-glow top-0 left-1/4 -translate-x-1/2" />
        <div className="hero-glow-accent top-20 right-1/4 translate-x-1/2" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-slate-300 text-sm">{t('home.badge')}</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {t('home.title1')}
              <br />
              <span className="gradient-text">{t('home.title2')}</span> {t('home.title3')}
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/universities" className="btn-primary text-lg px-8 py-4">
                <span className="flex items-center gap-2">
                  {t('home.cta')}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
              <Link to="/compare" className="btn-secondary text-lg px-8 py-4">
                <span className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5" />
                  {t('home.compareCta')}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card p-6 group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 mb-4 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Universities Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {t('home.popular.title')}
              </h2>
              <p className="text-slate-400">
                {t('home.popular.subtitle')}
              </p>
            </div>
            <Link 
              to="/universities" 
              className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              {t('home.popular.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredUniversities.map(university => (
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
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10" />
            <div className="relative">
              <GraduationCap className="w-16 h-16 mx-auto mb-6 text-primary-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {t('home.ctaSection.title')}
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                {t('home.ctaSection.subtitle')}
              </p>
              <Link to="/universities" className="btn-primary text-lg px-8 py-4 inline-block">
                <span className="flex items-center gap-2">
                  {t('home.ctaSection.button')}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
