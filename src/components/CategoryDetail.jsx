import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export function CategoryDetail() {
  const { clubId, categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [players, setPlayers] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('players')

  useEffect(() => {
    getData()
  }, [categoryId])

  async function getData() {
    try {
      // Obtener datos de la categoría
      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single()

      // Obtener jugadores de la categoría
      const { data: playersData } = await supabase
        .from('players')
        .select('*')
        .eq('category_id', categoryId)
        .order('number')

      // Obtener entrenadores de la categoría
      const { data: coachesData } = await supabase
        .from('coaches')
        .select('*')
        .eq('category_id', categoryId)

      setCategory(categoryData)
      setPlayers(playersData || [])
      setCoaches(coachesData || [])
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

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h3 className="text-xl font-semibold mb-4">Categoría no encontrada</h3>
          <Link to={`/clubs/${clubId}/categories`} className="btn btn-primary inline-flex">
            <i className="fas fa-arrow-left"></i>
            Volver a categorías
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to={`/clubs/${clubId}/categories`} 
          className="text-gray-600 hover:text-primary-600 inline-flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i>
          Volver a categorías
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card flex items-center">
          <div className="h-12 w-12 rounded-lg bg-primary-500 text-white flex items-center justify-center">
            <i className="fas fa-users text-xl"></i>
          </div>
          <div className="ml-4 flex-1">
            <div className="text-2xl font-bold">{players.length}</div>
            <div className="text-gray-600">Jugadores</div>
          </div>
          <Link to={`/clubs/${clubId}/categories/${categoryId}/players/new`} className="btn btn-outline">
            <i className="fas fa-plus"></i>
          </Link>
        </div>

        <div className="card flex items-center">
          <div className="h-12 w-12 rounded-lg bg-primary-500 text-white flex items-center justify-center">
            <i className="fas fa-user-tie text-xl"></i>
          </div>
          <div className="ml-4 flex-1">
            <div className="text-2xl font-bold">{coaches.length}</div>
            <div className="text-gray-600">Entrenadores</div>
          </div>
          <Link to={`/clubs/${clubId}/categories/${categoryId}/coaches/new`} className="btn btn-outline">
            <i className="fas fa-plus"></i>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          <button
            className={`pb-4 px-1 ${
              activeTab === 'players'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('players')}
          >
            Jugadores
          </button>
          <button
            className={`pb-4 px-1 ${
              activeTab === 'coaches'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('coaches')}
          >
            Entrenadores
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'players' ? (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Jugadores</h2>
            <Link 
              to={`/clubs/${clubId}/categories/${categoryId}/players/new`}
              className="btn btn-primary"
            >
              <i className="fas fa-plus"></i>
              Agregar Jugador
            </Link>
          </div>

          {players.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posición
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {players.map(player => (
                    <tr key={player.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {player.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {player.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {player.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-users text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-500 mb-4">No hay jugadores registrados en esta categoría</p>
              <Link 
                to={`/clubs/${clubId}/categories/${categoryId}/players/new`}
                className="btn btn-primary inline-flex"
              >
                <i className="fas fa-plus"></i>
                Agregar Jugador
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Entrenadores</h2>
            <Link 
              to={`/clubs/${clubId}/categories/${categoryId}/coaches/new`}
              className="btn btn-primary"
            >
              <i className="fas fa-plus"></i>
              Agregar Entrenador
            </Link>
          </div>

          {coaches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coaches.map(coach => (
                    <tr key={coach.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {coach.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coach.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-user-tie text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-500 mb-4">No hay entrenadores registrados en esta categoría</p>
              <Link 
                to={`/clubs/${clubId}/categories/${categoryId}/coaches/new`}
                className="btn btn-primary inline-flex"
              >
                <i className="fas fa-plus"></i>
                Agregar Entrenador
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
