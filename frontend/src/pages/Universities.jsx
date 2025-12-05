import { useState, useEffect, useMemo } from 'react'
import { Building2, SlidersHorizontal, X, Grid, List } from 'lucide-react'
import { getUniversities, getPrograms } from '../services/api'
import UniversityCard from '../components/UniversityCard'
import FiltersPanel from '../components/FiltersPanel'
import { useLanguage } from '../contexts/LanguageContext'

function Universities({ toggleFavorite, favorites, toggleCompare, compareList }) {
  const [universities, setUniversities] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const { t } = useLanguage()

  const [filters, setFilters] = useState({
    search: '',
    city: '',
    tuitionRange: '',
    studyForm: '',
    programs: [],
    hasDormitory: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uniData, programData] = await Promise.all([
          getUniversities(),
          getPrograms()
        ])
        setUniversities(uniData.results || uniData)
        setPrograms(programData.results || programData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(universities.map(u => u.city))]
    return uniqueCities.sort()
  }, [universities])

  const filteredUniversities = useMemo(() => {
    return universities.filter(uni => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase()
        if (!uni.name.toLowerCase().includes(search) && 
            !uni.city.toLowerCase().includes(search) &&
            !uni.description.toLowerCase().includes(search)) {
          return false
        }
      }

      // City filter
      if (filters.city && uni.city !== filters.city) {
        return false
      }

      // Tuition range filter
      if (filters.tuitionRange) {
        const tuition = parseFloat(uni.tuition)
        switch (filters.tuitionRange) {
          case 'free':
            if (tuition !== 0) return false
            break
          case 'low':
            if (tuition <= 0 || tuition > 1000000) return false
            break
          case 'medium':
            if (tuition < 1000000 || tuition > 2000000) return false
            break
          case 'high':
            if (tuition < 2000000) return false
            break
        }
      }

      // Study form filter
      if (filters.studyForm) {
        if (filters.studyForm === 'full-time' && uni.study_form !== 'full-time' && uni.study_form !== 'both') {
          return false
        }
        if (filters.studyForm === 'part-time' && uni.study_form !== 'part-time' && uni.study_form !== 'both') {
          return false
        }
        if (filters.studyForm === 'both' && uni.study_form !== 'both') {
          return false
        }
      }

      // Dormitory filter
      if (filters.hasDormitory && !uni.has_dormitory) {
        return false
      }

      return true
    })
  }, [universities, filters])

  const resetFilters = () => {
    setFilters({
      search: '',
      city: '',
      tuitionRange: '',
      studyForm: '',
      programs: [],
      hasDormitory: false,
    })
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.city) count++
    if (filters.tuitionRange) count++
    if (filters.studyForm) count++
    if (filters.programs.length > 0) count++
    if (filters.hasDormitory) count++
    return count
  }, [filters])

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {t('universities.title')}
          </h1>
          <p className="text-slate-400">
            {t('universities.subtitle').replace('{count}', universities.length)}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 rounded-xl text-white font-medium"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {t('universities.filters')}
            {activeFiltersCount > 0 && (
              <span className="w-6 h-6 bg-primary-500 rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                cities={cities}
                programs={programs}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-slate-400">
                {t('universities.showing')} <span className="text-white font-medium">{filteredUniversities.length}</span> {t('universities.of')}{' '}
                <span className="text-white font-medium">{universities.length}</span> {t('universities.universitiesWord')}
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-slate-700 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-slate-700 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.search && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-white">
                    {t('universities.searchLabel')}: "{filters.search}"
                    <button 
                      onClick={() => setFilters({ ...filters, search: '' })}
                      className="hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.city && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-white">
                    {t('universities.cityLabel')}: {filters.city}
                    <button 
                      onClick={() => setFilters({ ...filters, city: '' })}
                      className="hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.hasDormitory && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-white">
                    {t('universities.withDormitory')}
                    <button 
                      onClick={() => setFilters({ ...filters, hasDormitory: false })}
                      className="hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 text-sm text-primary-400 hover:text-primary-300"
                >
                  {t('universities.resetAll')}
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
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
            ) : filteredUniversities.length === 0 ? (
              /* Empty State */
              <div className="card p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('universities.notFound')}</h3>
                <p className="text-slate-400 mb-6">
                  {t('universities.notFoundDesc')}
                </p>
                <button 
                  onClick={resetFilters}
                  className="btn-primary"
                >
                  {t('universities.resetFilters')}
                </button>
              </div>
            ) : (
              /* University Grid/List */
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredUniversities.map(university => (
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
          </main>
        </div>
      </div>
    </div>
  )
}

export default Universities
