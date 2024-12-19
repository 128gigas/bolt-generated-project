import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export function Dashboard() {
  const { clubId } = useParams()
  const [club, setClub] = useState(null)
  const [stats, setStats] = useState({
    categories: 0,
    players: 0,
    coaches: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClubData()
  }, [clubId])

  async function getClubData() {
    try {
      setLoading(true)
      
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single()

      if (clubError) throw clubError

      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact' })
        .eq('club_id', clubId)

      const { count: playersCount } = await supabase
        .from('players')
        .select('*', { count: 'exact' })
        .eq('club_id', clubId)

      const { count: coachesCount } = await supabase
        .from('coaches')
        .select('*', { count: 'exact' })
        .eq('club_id', clubId)

      setClub(clubData)
      setStats({
        categories: categoriesCount || 0,
        players: playersCount || 0,
        coaches: coachesCount || 0
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Club no encontrado</h3>
        <Link to="/" className="btn-primary">
          <i className="fas fa-arrow-left mr-2"></i>
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{club.name}</h1>
            <p className="text-gray-600 mt-1">
              {club.city} | Fundado en {club.founded_year}
            </p>
          </div>
          <Link to="/" className="btn-outline">
            <i className="fas fa-arrow-left mr-2"></i>
            Volver a clubes
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <i className="fas fa-layer-group text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 uppercase">Categorías</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.categories}</p>
            </div>
          </div>
          <Link 
            to={`/clubs/${clubId}/categories/new`}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            <i className="fas fa-plus mr-1"></i> Agregar
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 uppercase">Jugadores</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.players}</p>
            </div>
          </div>
          <Link 
            to={`/clubs/${clubId}/players/new`}
            className="mt-4 text-sm text-green-600 hover:text-green-700 flex items-center"
          >
            <i className="fas fa-plus mr-1"></i> Agregar
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-user-tie text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 uppercase">Entrenadores</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.coaches}</p>
            </div>
          </div>
          <Link 
            to={`/clubs/${clubId}/coaches/new`}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <i className="fas fa-plus mr-1"></i> Agregar
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <i className="fas fa-cog mr-2 text-primary-600"></i>
            Gestión Deportiva
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to={`/clubs/${clubId}/categories`}
              className="btn-primary w-full justify-center"
            >
              <i className="fas fa-layer-group mr-2"></i>
              Categorías
            </Link>
            <Link 
              to={`/clubs/${clubId}/players`}
              className="btn-primary w-full justify-center"
            >
              <i className="fas fa-users mr-2"></i>
              Jugadores
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <i className="fas fa-calendar mr-2 text-primary-600"></i>
            Actividades
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to={`/clubs/${clubId}/trainings`}
              className="btn-primary w-full justify-center"
            >
              <i className="fas fa-running mr-2"></i>
              Entrenamientos
            </Link>
            <Link 
              to={`/clubs/${clubId}/matches`}
              className="btn-primary w-full justify-center"
            >
              <i className="fas fa-futbol mr-2"></i>
              Partidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
