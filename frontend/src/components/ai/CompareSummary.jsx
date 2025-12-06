/**
 * CompareSummary Component
 * 
 * Displays the AI-generated comparison summary for universities.
 * Renders markdown-formatted content from the AI response.
 */

import { Sparkles, X } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

function CompareSummary({ summary, onClose }) {
  const { t } = useLanguage()

  // Simple markdown-like formatting (bold, headers, lists)
  const formatText = (text) => {
    if (!text) return null

    // Split by lines and process each
    const lines = text.split('\n')
    const elements = []
    let currentList = []
    let listType = null

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 text-slate-300">
            {currentList}
          </ul>
        )
        currentList = []
        listType = null
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Headers
      if (trimmedLine.startsWith('### ')) {
        flushList()
        elements.push(
          <h4 key={index} className="text-lg font-semibold text-white mt-4 mb-2">
            {trimmedLine.replace('### ', '')}
          </h4>
        )
      } else if (trimmedLine.startsWith('## ')) {
        flushList()
        elements.push(
          <h3 key={index} className="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            {trimmedLine.replace('## ', '')}
          </h3>
        )
      } else if (trimmedLine.startsWith('# ')) {
        flushList()
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">
            {trimmedLine.replace('# ', '')}
          </h2>
        )
      }
      // Bold text with **
      else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList()
        elements.push(
          <p key={index} className="font-semibold text-white mb-2">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        )
      }
      // List items
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        const content = trimmedLine.replace(/^[-•]\s*/, '')
        // Process bold within list items
        const processedContent = content.split(/(\*\*.*?\*\*)/).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-white">{part.replace(/\*\*/g, '')}</strong>
          }
          return part
        })
        currentList.push(
          <li key={`item-${index}`} className="text-slate-300">
            {processedContent}
          </li>
        )
      }
      // Numbered list items
      else if (/^\d+\.\s/.test(trimmedLine)) {
        const content = trimmedLine.replace(/^\d+\.\s*/, '')
        const processedContent = content.split(/(\*\*.*?\*\*)/).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-white">{part.replace(/\*\*/g, '')}</strong>
          }
          return part
        })
        currentList.push(
          <li key={`item-${index}`} className="text-slate-300">
            {processedContent}
          </li>
        )
      }
      // Regular text
      else if (trimmedLine) {
        flushList()
        // Process bold within regular text
        const processedContent = trimmedLine.split(/(\*\*.*?\*\*)/).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-white">{part.replace(/\*\*/g, '')}</strong>
          }
          return part
        })
        elements.push(
          <p key={index} className="text-slate-300 mb-3 leading-relaxed">
            {processedContent}
          </p>
        )
      }
      // Empty lines
      else {
        flushList()
      }
    })

    // Flush any remaining list items
    flushList()

    return elements
  }

  return (
    <div className="mt-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl 
                          flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t('ai.summaryTitle')}</h3>
            <p className="text-sm text-slate-400">{t('ai.summarySubtitle')}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
            aria-label={t('ai.close')}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="summary-box bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6
                      hover:border-primary-500/30 transition-all duration-300">
        <div className="prose prose-invert max-w-none">
          {formatText(summary)}
        </div>
      </div>
    </div>
  )
}

export default CompareSummary



