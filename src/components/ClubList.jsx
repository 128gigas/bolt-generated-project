import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

export function ClubList() {
  const [clubs, setClubs] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClub, setNewClub] = useState({
    name: '',
    city: '',
    founded_year: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClubs()
  }, [])

  async function getClubs() {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name')
      
      if (error) throw error
      setClubs(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddClub(e) {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('clubs')
        .insert([newClub])
      
      if (error) throw error
      
      setNewClub({ name: '', city: '', founded_year: '' })
      setShowAddForm(false)
      getClubs()
    } catch (error) {
      console.error('Error:', error)
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
        <h1 className="text-3xl font-bold text-gray-900">Clubes de Fútbol</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <i className="fas fa-plus"></i>
          {showAddForm ? 'Cancelar' : 'Nuevo Club'}
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-6">Nuevo Club</h2>
          <form onSubmit={handleAddClub} className="space-y-6">
            <div>
              <label className="form-label">Nombre del Club</label>
              <input
                type="text"
                className="form-input"
                value={newClub.name}
                onChange={e => setNewClub({...newClub, name: e.target.value})}
                required
                placeholder="Ej: Real Madrid"
              />
            </div>

            <div>
              <label className="form-label">Ciudad</label>
              <input
                type="text"
                className="form-input"
                value={newClub.city}
                onChange={e => setNewClub({...newClub, city: e.target.value})}
                required
                placeholder="Ej: Madrid"
              />
            </div>

            <div>
              <label className="form-label">Año de Fundación</label>
              <input
                type="number"
                className="form-input"
                value={newClub.founded_year}
                onChange={e => setNewClub({...newClub, founded_year: e.target.value})}
                required
                placeholder="Ej: 1902"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <i className="fas fa-save"></i>
              Guardar Club
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map(club => (
          <Link 
            to={`/clubs/${club.id}`} 
            key={club.id} 
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-primary-600 mb-4">{club.name}</h2>
            <div className="space-y-2 mb-4">
              <p className="flex items-center text-gray-600">
                <i className="fas fa-map-marker-alt w-5"></i>
                {club.city}
              </p>
              <p className="flex items-center text-gray-600">
                <i className="fas fa-calendar w-5"></i>
                Fundado en {club.founded_year}
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <span className="btn btn-outline w-full justify-center">
                <i className="fas fa-arrow-right"></i>
                Ver Detalles
              </span>
            </div>
          </Link>
        ))}
      </div>

      {clubs.length === 0 && !showAddForm && (
        <div className="card text-center py-12">
          <i className="fas fa-futbol text-5xl text-primary-500 mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">No hay clubes registrados</h3>
          <p className="text-gray-600 mb-6">Comienza agregando tu primer club</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary mx-auto"
          >
            <i className="fas fa-plus"></i>
            Agregar Club
          </button>
        </div>
      )}
    </div>
  )
}
