import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 overflow-y-auto transition duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 z-50`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <span className="text-white text-2xl mx-2 font-semibold">⚽ GestorFútbol</span>
          </div>
        </div>

        <nav className="mt-10">
          <Link 
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}
          >
            <svg className="sidebar-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span className="mx-4">Dashboard</span>
          </Link>

          <Link 
            to="/clubs"
            className={`nav-link ${location.pathname.includes('/clubs') ? 'nav-link-active' : ''}`}
          >
            <svg className="sidebar-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span className="mx-4">Clubes</span>
          </Link>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-primary-600">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="relative z-10 block h-8 w-8 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus:border-white"
              >
                <img 
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80"
                  alt="Your avatar"
                />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="fixed inset-0 h-full w-full z-10"
                  onClick={() => setProfileDropdownOpen(false)}
                ></div>
              )}

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20"
                >
                  <a href="#" className="dropdown-link">
                    Perfil
                  </a>
                  <a href="#" className="dropdown-link">
                    Configuración
                  </a>
                  <a href="#" className="dropdown-link">
                    Cerrar Sesión
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
