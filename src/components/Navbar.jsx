import { Link, useLocation, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export function Navbar() {
  const location = useLocation()
  const { clubId } = useParams()
  const [club, setClub] = useState(null)

  useEffect(() => {
    if (clubId) {
      getClubInfo()
    }
  }, [clubId])

  async function getClubInfo() {
    const { data } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single()
    setClub(data)
  }

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          ⚽ GestorFútbol
        </Link>
        
        {club && (
          <div className="nav-club-info">
            <span className="nav-club-name">{club.name}</span>
          </div>
        )}

        {clubId && (
          <div className="nav-links">
            <Link to={`/clubs/${clubId}`} className={location.pathname === `/clubs/${clubId}` ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to={`/clubs/${clubId}/categories`} className={location.pathname.includes('/categories') ? 'active' : ''}>
              Categorías
            </Link>
            <Link to={`/clubs/${clubId}/players`} className={location.pathname.includes('/players') ? 'active' : ''}>
              Jugadores
            </Link>
            <Link to={`/clubs/${clubId}/trainings`} className={location.pathname.includes('/trainings') ? 'active' : ''}>
              Entrenamientos
            </Link>
            <Link to={`/clubs/${clubId}/matches`} className={location.pathname.includes('/matches') ? 'active' : ''}>
              Partidos
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
