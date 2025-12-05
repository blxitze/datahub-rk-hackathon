import { useLanguage } from '../contexts/LanguageContext'
import { Globe } from 'lucide-react'

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 transition-all duration-300 group"
      title={language === 'ru' ? 'Қазақ тіліне ауысу' : 'Переключить на русский'}
    >
      <Globe className="w-4 h-4 text-primary-400 group-hover:rotate-12 transition-transform" />
      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
        {language === 'ru' ? 'ҚАЗ' : 'РУС'}
      </span>
      <div className="w-px h-4 bg-slate-600" />
      <span className="text-xs text-slate-500">
        {language === 'ru' ? 'RU' : 'KK'}
      </span>
    </button>
  )
}

export default LanguageSwitcher

