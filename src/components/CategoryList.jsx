import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export function CategoryList() {
  const { clubId } = useParams()
  const [categories, setCategories] = useState([])
  const [categoryStats, setCategoryStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategoryData()
  }, [])

  async function loadCategoryData() {
    try {
      setLoading(true)
      setError(null)

      // Obtener categorías
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('club_id', clubId)
        .order('name', { ascending: false })

      if (categoriesError) throw categoriesError

      // Para cada categoría, obtener estadísticas
      const stats = {}
      for (const category of categoriesData || []) {
        // Contar jugadores
        const { count: playersCount } = await supabase
          .from('players')
          .select('*', { count: 'exact' })
          .eq('category_id', category.id)

        // Contar entrenadores
        const { count: coachesCount } = await supabase
          .from('coaches')
          .select('*', { count: 'exact' })
          .eq('category_id', category.id)

        stats[category.id] = {
          players: playersCount || 0,
          coaches: coachesCount || 0
        }
      }

      setCategories(categoriesData || [])
      setCategoryStats(stats)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar las categorías')
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link 
            to={`/clubs/${clubId}`} 
            className="text-gray-600 hover:text-primary-600 inline-flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Volver al club
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Categorías</h1>
        </div>
        <Link to={`/clubs/${clubId}/categories/new`} className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Nueva Categoría
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary-600">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Categoría</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                <i className="fas fa-users text-xl"></i>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {categoryStats[category.id]?.players || 0}
                </div>
                <div className="text-sm text-gray-500">Jugadores</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {categoryStats[category.id]?.coaches || 0}
                </div>
                <div className="text-sm text-gray-500">Entrenadores</div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Link 
                to={`/clubs/${clubId}/categories/${category.id}`} 
                className="btn btn-primary w-full justify-center"
              >
                <i className="fas fa-users"></i>
                Gestionar Equipo
              </Link>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !error && (
        <div className="card text-center py-12">
          <i className="fas fa-layer-group text-5xl text-primary-500 mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">No hay categorías</h3>
          <p className="text-gray-600 mb-6">
            Comienza agregando una nueva categoría por año
          </p>
          <Link 
            to={`/clubs/${clubId}/categories/new`}
            className="btn btn-primary inline-flex"
          >
            <i className="fas fa-plus"></i>
            Agregar Categoría
          </Link>
        </div>
      )}
    </div>
  )
}
