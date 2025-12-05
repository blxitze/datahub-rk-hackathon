import { Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function FiltersPanel({ 
  filters, 
  setFilters, 
  cities, 
  programs, 
  onReset 
}) {
  const { t } = useLanguage()
  const [expandedSections, setExpandedSections] = useState({
    city: true,
    tuition: true,
    studyForm: true,
    programs: false,
    dormitory: true,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const studyFormOptions = [
    { value: '', label: t('universities.studyForms.all') },
    { value: 'full-time', label: t('universities.studyForms.fullTime') },
    { value: 'part-time', label: t('universities.studyForms.partTime') },
    { value: 'both', label: t('universities.studyForms.both') },
  ]

  const tuitionRanges = [
    { value: '', label: t('universities.tuitionRanges.any'), min: 0, max: Infinity },
    { value: 'free', label: t('universities.tuitionRanges.free'), min: 0, max: 0 },
    { value: 'low', label: t('universities.tuitionRanges.low'), min: 1, max: 1000000 },
    { value: 'medium', label: t('universities.tuitionRanges.medium'), min: 1000000, max: 2000000 },
    { value: 'high', label: t('universities.tuitionRanges.high'), min: 2000000, max: Infinity },
  ]

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-slate-700/50 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-white font-medium">{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="pb-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-white">{t('universities.filters')}</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-primary-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('universities.reset')}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={t('universities.search')}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="input-field"
        />
      </div>

      {/* City Filter */}
      <FilterSection title={t('universities.city')} section="city">
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="input-field"
        >
          <option value="">{t('universities.allCities')}</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </FilterSection>

      {/* Tuition Filter */}
      <FilterSection title={t('universities.tuition')} section="tuition">
        <div className="space-y-2">
          {tuitionRanges.map(range => (
            <label
              key={range.value}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                filters.tuitionRange === range.value
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'hover:bg-slate-700/50 text-slate-300'
              }`}
            >
              <input
                type="radio"
                name="tuition"
                value={range.value}
                checked={filters.tuitionRange === range.value}
                onChange={(e) => setFilters({ ...filters, tuitionRange: e.target.value })}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                filters.tuitionRange === range.value
                  ? 'border-primary-400'
                  : 'border-slate-500'
              }`}>
                {filters.tuitionRange === range.value && (
                  <div className="w-2 h-2 rounded-full bg-primary-400" />
                )}
              </div>
              <span className="text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Study Form Filter */}
      <FilterSection title={t('universities.studyForm')} section="studyForm">
        <select
          value={filters.studyForm}
          onChange={(e) => setFilters({ ...filters, studyForm: e.target.value })}
          className="input-field"
        >
          {studyFormOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Programs Filter */}
      <FilterSection title={t('universities.programs')} section="programs">
        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
          {programs.map(program => (
            <label
              key={program.id}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                filters.programs.includes(program.id)
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'hover:bg-slate-700/50 text-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={filters.programs.includes(program.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({ 
                      ...filters, 
                      programs: [...filters.programs, program.id] 
                    })
                  } else {
                    setFilters({ 
                      ...filters, 
                      programs: filters.programs.filter(id => id !== program.id) 
                    })
                  }
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                filters.programs.includes(program.id)
                  ? 'border-primary-400 bg-primary-400'
                  : 'border-slate-500'
              }`}>
                {filters.programs.includes(program.id) && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-sm">{program.title}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Dormitory Filter */}
      <FilterSection title={t('universities.dormitory')} section="dormitory">
        <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
          <input
            type="checkbox"
            checked={filters.hasDormitory}
            onChange={(e) => setFilters({ ...filters, hasDormitory: e.target.checked })}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
            filters.hasDormitory
              ? 'border-primary-400 bg-primary-400'
              : 'border-slate-500'
          }`}>
            {filters.hasDormitory && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-sm text-slate-300">{t('universities.hasDormitory')}</span>
        </label>
      </FilterSection>

      {/* Active Filters */}
      {(filters.search || filters.city || filters.tuitionRange || 
        filters.studyForm || filters.programs.length > 0 || filters.hasDormitory) && (
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-lg text-sm text-slate-300">
                "{filters.search}"
                <button onClick={() => setFilters({ ...filters, search: '' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-lg text-sm text-slate-300">
                {filters.city}
                <button onClick={() => setFilters({ ...filters, city: '' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.tuitionRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-lg text-sm text-slate-300">
                {tuitionRanges.find(r => r.value === filters.tuitionRange)?.label}
                <button onClick={() => setFilters({ ...filters, tuitionRange: '' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FiltersPanel
