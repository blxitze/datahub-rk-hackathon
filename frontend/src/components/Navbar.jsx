import { Link, useLocation } from 'react-router-dom'
import { Heart, GitCompare, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

function Navbar({ favoritesCount, compareCount }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/universities', label: t('nav.universities') },
    { path: '/compare', label: t('nav.compare'), badge: compareCount },
    { path: '/favorites', label: t('nav.favorites'), badge: favoritesCount },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <img 
              src="/images/logo.jpeg" 
              alt="StudentHub" 
              className="w-10 h-10 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-xl font-bold text-white">
              Student<span className="text-primary-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, badge }) => (
              <Link
                key={path}
                to={path}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'text-white bg-slate-800'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {path === '/favorites' && <Heart className="w-4 h-4" />}
                  {path === '/compare' && <GitCompare className="w-4 h-4" />}
                  {label}
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                      {badge}
                    </span>
                  )}
                </span>
              </Link>
            ))}
            
            {/* Language Switcher */}
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="p-2 text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ path, label, badge }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(path)
                      ? 'text-white bg-slate-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {path === '/favorites' && <Heart className="w-4 h-4" />}
                    {path === '/compare' && <GitCompare className="w-4 h-4" />}
                    {label}
                    {badge > 0 && (
                      <span className="ml-auto w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                        {badge}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
