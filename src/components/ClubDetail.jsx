import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export function ClubDetail() {
  const { clubId } = useParams()
  const [club, setClub] = useState(null)
  const [categories, setCategories] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClubData()
  }, [clubId])

  async function getClubData() {
    try {
      // Obtener datos del club
      const { data: clubData } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single()

      // Obtener categorías del club
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('club_id', clubId)

      // Obtener equipos por categoría
      const { data: teamsData } = await supabase
        .from('teams')
        .select(`
          *,
          categories (name)
        `)
        .eq('club_id', clubId)

      setClub(clubData)
      setCategories(categoriesData)
      setTeams(teamsData)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Cargando...</div>
  if (!club) return <div>Club no encontrado</div>

  return (
    <div className="club-detail">
      <h1>{club.name}</h1>
      <div className="club-info">
        <p>Ciudad: {club.city}</p>
        <p>Año de fundación: {club.founded_year}</p>
      </div>

      <div className="club-sections">
        <section>
          <h2>Categorías</h2>
          <Link to={`/clubs/${clubId}/categories/new`}>Agregar Categoría</Link>
          <ul>
            {categories.map(category => (
              <li key={category.id}>
                <Link to={`/clubs/${clubId}/categories/${category.id}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Gestión</h2>
          <nav className="management-links">
            <Link to={`/clubs/${clubId}/players`}>Jugadores</Link>
            <Link to={`/clubs/${clubId}/coaches`}>Entrenadores</Link>
            <Link to={`/clubs/${clubId}/trainings`}>Entrenamientos</Link>
            <Link to={`/clubs/${clubId}/matches`}>Partidos</Link>
          </nav>
        </section>
      </div>
    </div>
  )
}
