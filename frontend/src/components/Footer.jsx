import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Github } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img 
                src="/images/logo.jpeg" 
                alt="StudentHub" 
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="text-xl font-bold text-white">
                Student<span className="text-primary-400">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 mb-4 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/blxitze/datahub-rk-hackathon" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-primary-400 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/universities" className="text-slate-400 hover:text-primary-400 transition-colors">
                  {t('nav.universities')}
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-slate-400 hover:text-primary-400 transition-colors">
                  {t('nav.compare')}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-slate-400 hover:text-primary-400 transition-colors">
                  {t('nav.favorites')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.contacts')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>info@studenthub.kz</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>+7 (677) 676-7676</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>Алматы, Казахстан</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            Сделано командой Bed Action Inc. Название проекта: StudentHub. IT FEST 2025.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
