import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GitCompare, Plus, Trash2 } from 'lucide-react'
import { getUniversity } from '../services/api'
import ComparisonTable from '../components/ComparisonTable'
import { useLanguage } from '../contexts/LanguageContext'

function Compare({ compareList, clearCompare, toggleCompare }) {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchUniversities = async () => {
      if (compareList.length === 0) {
        setUniversities([])
        setLoading(false)
        return
      }

      try {
        const promises = compareList.map(id => getUniversity(id))
        const results = await Promise.all(promises)
        setUniversities(results)
      } catch (error) {
        console.error('Error fetching universities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUniversities()
  }, [compareList])

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <GitCompare className="w-8 h-8 text-primary-400" />
              {t('compare.title')}
            </h1>
            <p className="text-slate-400">
              {compareList.length === 0 
                ? t('compare.emptyDesc')
                : t('compare.comparing').replace('{count}', compareList.length) + ' ' + 
                  (compareList.length === 1 ? t('compare.universityWord') : t('compare.universitiesWord'))
              }
            </p>
          </div>
          
          <div className="flex gap-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="btn-secondary flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t('compare.clear')}
              </button>
            )}
            {compareList.length < 3 && (
              <Link to="/universities" className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('compare.add')}
              </Link>
            )}
          </div>
        </div>

        {/* Capacity indicator */}
        {compareList.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">{t('compare.slots')}</span>
              <span className="text-white text-sm">{compareList.length}/3</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
                style={{ width: `${(compareList.length / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="card p-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(Math.max(compareList.length, 1))].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-20 bg-slate-700 rounded-xl" />
                  <div className="h-8 bg-slate-700 rounded" />
                  <div className="h-8 bg-slate-700 rounded" />
                  <div className="h-8 bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Comparison Table */
          <div className="card overflow-hidden">
            <ComparisonTable 
              universities={universities}
              onRemove={toggleCompare}
            />
          </div>
        )}

        {/* Tips Section */}
        {compareList.length > 0 && compareList.length < 3 && (
          <div className="mt-8 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
            <h3 className="text-white font-semibold mb-2">💡 {t('compare.tip')}</h3>
            <p className="text-slate-400">
              {t('compare.tipText')}{' '}
              <Link to="/universities" className="text-primary-400 hover:text-primary-300">
                {t('compare.catalog')}
              </Link>{' '}
              {t('compare.forMore')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Compare
