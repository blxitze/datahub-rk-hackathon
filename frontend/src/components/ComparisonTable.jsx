import { Link } from 'react-router-dom'
import { X, Building2, Star, Check, Minus } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

function ComparisonTable({ universities, onRemove }) {
  const { t } = useLanguage()

  const formatTuition = (amount) => {
    if (amount === 0 || amount === '0.00') return t('card.free')
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸'
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${
            i < fullStars 
              ? 'fill-amber-400 text-amber-400' 
              : 'text-slate-600'
          }`} 
        />
      )
    }
    return stars
  }

  const getStudyFormLabel = (studyForm) => {
    if (studyForm === 'full-time') return t('universities.studyForms.fullTime')
    if (studyForm === 'part-time') return t('universities.studyForms.partTime')
    if (studyForm === 'both') return t('universities.studyForms.both')
    return studyForm
  }

  const comparisonRows = [
    {
      label: t('compare.city'),
      getValue: (uni) => uni.city
    },
    {
      label: t('compare.tuition'),
      getValue: (uni) => formatTuition(uni.tuition)
    },
    {
      label: t('compare.rating'),
      getValue: (uni) => (
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(parseFloat(uni.rating))}</div>
          <span className="font-semibold">{uni.rating}</span>
        </div>
      )
    },
    {
      label: t('compare.studyForm'),
      getValue: (uni) => getStudyFormLabel(uni.study_form)
    },
    {
      label: t('compare.dormitory'),
      getValue: (uni) => (
        uni.has_dormitory ? (
          <span className="inline-flex items-center gap-1 text-green-400">
            <Check className="w-4 h-4" />
            {t('compare.hasIt')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Minus className="w-4 h-4" />
            {t('compare.noIt')}
          </span>
        )
      )
    },
    {
      label: t('compare.programs'),
      getValue: (uni) => (
        <div className="max-h-32 overflow-y-auto">
          {uni.programs?.length > 0 ? (
            <ul className="space-y-1">
              {uni.programs.map(program => (
                <li key={program.id} className="text-sm text-slate-300">
                  • {program.title}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-slate-500">{t('compare.noData')}</span>
          )}
        </div>
      )
    },
    {
      label: t('compare.founded'),
      getValue: (uni) => uni.founded_year || t('compare.na')
    },
    {
      label: t('compare.students'),
      getValue: (uni) => uni.students_count 
        ? new Intl.NumberFormat('ru-RU').format(uni.students_count)
        : t('compare.na')
    },
    {
      label: t('compare.contacts'),
      getValue: (uni) => (
        <div className="space-y-1 text-sm">
          {uni.phone && <div className="text-slate-300">{uni.phone}</div>}
          {uni.email && <div className="text-slate-300">{uni.email}</div>}
        </div>
      )
    },
  ]

  if (universities.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t('compare.noUniversities')}</h3>
        <p className="text-slate-400 mb-6">
          {t('compare.noUniversitiesDesc')}
        </p>
        <Link to="/universities" className="btn-primary inline-block">
          {t('compare.goToCatalog')}
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-slate-900 p-4 text-left text-slate-400 font-medium border-b border-slate-700">
              {t('compare.characteristics')}
            </th>
            {universities.map(uni => (
              <th key={uni.id} className="p-4 text-left min-w-[280px] border-b border-slate-700">
                <div className="relative">
                  <button
                    onClick={() => onRemove(uni.id)}
                    className="absolute -top-2 -right-2 p-1 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors"
                    title={t('compare.removeFromCompare')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3 pr-6">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {uni.logo ? (
                        <img src={uni.logo} alt={uni.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <Link 
                        to={`/universities/${uni.id}`}
                        className="text-white font-semibold hover:text-primary-400 transition-colors line-clamp-2"
                      >
                        {uni.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row, index) => (
            <tr 
              key={row.label} 
              className={index % 2 === 0 ? 'bg-slate-800/30' : 'bg-transparent'}
            >
              <td className="sticky left-0 bg-inherit p-4 text-slate-400 font-medium border-b border-slate-700/50">
                {row.label}
              </td>
              {universities.map(uni => (
                <td key={uni.id} className="p-4 text-white border-b border-slate-700/50">
                  {row.getValue(uni)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="sticky left-0 bg-slate-900 p-4"></td>
            {universities.map(uni => (
              <td key={uni.id} className="p-4">
                <Link
                  to={`/universities/${uni.id}`}
                  className="btn-primary inline-block text-center w-full"
                >
                  {t('card.details')}
                </Link>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default ComparisonTable
