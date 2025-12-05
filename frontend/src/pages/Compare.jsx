import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GitCompare, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { getUniversity } from '../services/api'
import { getCompareSummary } from '../services/ai'
import ComparisonTable from '../components/ComparisonTable'
import { CompareSummary } from '../components/ai'
import { useLanguage } from '../contexts/LanguageContext'

function Compare({ compareList, clearCompare, toggleCompare }) {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState(null)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchUniversities = async () => {
      if (compareList.length === 0) {
        setUniversities([])
        setLoading(false)
        setSummary(null) // Clear summary when no universities
        return
      }

      try {
        const promises = compareList.map(id => getUniversity(id))
        const results = await Promise.all(promises)
        setUniversities(results)
        setSummary(null) // Clear summary when universities change
      } catch (error) {
        console.error('Error fetching universities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUniversities()
  }, [compareList])

  // Handle generating AI comparison summary
  const handleGenerateSummary = async () => {
    if (compareList.length < 2) return

    setSummaryLoading(true)
    setSummaryError(null)
    
    try {
      const response = await getCompareSummary(compareList)
      if (response.success) {
        setSummary(response.summary)
      } else {
        throw new Error(response.error || 'Failed to generate summary')
      }
    } catch (error) {
      console.error('Summary generation error:', error)
      setSummaryError(error.error || t('ai.summaryError'))
    } finally {
      setSummaryLoading(false)
    }
  }

  const handleCloseSummary = () => {
    setSummary(null)
  }

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
          
          <div className="flex gap-3 flex-wrap">
            {/* AI Summarize Button */}
            {compareList.length >= 2 && (
              <button
                onClick={handleGenerateSummary}
                disabled={summaryLoading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {summaryLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {summaryLoading ? t('ai.generating') : t('ai.summarize')}
              </button>
            )}
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
          <>
            {/* Comparison Table */}
            <div className="card overflow-hidden">
              <ComparisonTable 
                universities={universities}
                onRemove={toggleCompare}
              />
            </div>

            {/* AI Summary Error Message */}
            {summaryError && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{summaryError}</p>
              </div>
            )}

            {/* AI Summary Loading State */}
            {summaryLoading && (
              <div className="mt-8 p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-slate-700 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-slate-700 rounded" />
                    <div className="h-3 w-32 bg-slate-700 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-700 rounded w-5/6" />
                  <div className="h-4 bg-slate-700 rounded w-4/6" />
                  <div className="h-4 bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-700 rounded w-3/4" />
                </div>
              </div>
            )}

            {/* AI Comparison Summary */}
            {summary && !summaryLoading && (
              <CompareSummary 
                summary={summary} 
                onClose={handleCloseSummary}
              />
            )}
          </>
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
