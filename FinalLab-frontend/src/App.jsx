import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Admin from './pages/Admin'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-logo">MediCare</h1>
          <ul className="nav-menu">
            <li>
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentPage('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'shop' ? 'active' : ''}`}
                onClick={() => setCurrentPage('shop')}
              >
                Shop
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentPage('admin')}
              >
                Admin
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'home' && <Home />}
        {currentPage === 'shop' && <Shop />}
        {currentPage === 'admin' && <Admin />}
      </main>

      <footer className="footer">
        <p>&copy; 2024 MediCare. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
