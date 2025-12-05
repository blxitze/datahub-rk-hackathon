import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Universities from './pages/Universities'
import UniversityDetails from './pages/UniversityDetails'
import Compare from './pages/Compare'
import Favorites from './pages/Favorites'
import { AIChatWidget } from './components/ai'

function App() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('compareList')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList))
  }, [compareList])

  const toggleFavorite = (universityId) => {
    setFavorites(prev => 
      prev.includes(universityId)
        ? prev.filter(id => id !== universityId)
        : [...prev, universityId]
    )
  }

  const toggleCompare = (universityId) => {
    setCompareList(prev => {
      if (prev.includes(universityId)) {
        return prev.filter(id => id !== universityId)
      }
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, universityId]
    })
  }

  const clearCompare = () => {
    setCompareList([])
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar 
        favoritesCount={favorites.length} 
        compareCount={compareList.length} 
      />
      <main className="flex-grow">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                toggleCompare={toggleCompare}
                compareList={compareList}
              />
            } 
          />
          <Route 
            path="/universities" 
            element={
              <Universities 
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                toggleCompare={toggleCompare}
                compareList={compareList}
              />
            } 
          />
          <Route 
            path="/universities/:id" 
            element={
              <UniversityDetails 
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                toggleCompare={toggleCompare}
                compareList={compareList}
              />
            } 
          />
          <Route 
            path="/compare" 
            element={
              <Compare 
                compareList={compareList}
                clearCompare={clearCompare}
                toggleCompare={toggleCompare}
              />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <Favorites 
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                toggleCompare={toggleCompare}
                compareList={compareList}
              />
            } 
          />
        </Routes>
      </main>
      <Footer />
      
      {/* AI Chat Widget - Available globally */}
      <AIChatWidget />
    </div>
  )
}

export default App

