import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export function PlayerList() {
  const { clubId } = useParams()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getPlayers()
    getCategories()
  }, [])

  async function getPlayers() {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('club_id', clubId)

      if (error) throw error
      setPlayers(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function getCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('club_id', clubId)
    setCategories(data || [])
  }

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(filter.toLowerCase())
    const matchesCategory = !categoryFilter || player.category_id === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return <div className="loading-spinner" />
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Jugadores</h1>
        <Link to={`/clubs/${clubId}/players/new`} className="button-primary">
          + Nuevo Jugador
        </Link>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Número</th>
              <th>Posición</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map(player => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.number}</td>
                <td>{player.position}</td>
                <td>{player.categories?.name}</td>
                <td>
                  <div className="table-actions">
                    <button className="button-icon" title="Editar">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="button-icon" title="Ver detalles">
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPlayers.length === 0 && (
        <div className="empty-state">
          <h3>No se encontraron jugadores</h3>
          <p>Agrega jugadores a tu club o ajusta los filtros de búsqueda</p>
          <Link to={`/clubs/${clubId}/players/new`} className="button-primary">
            Agregar Primer Jugador
          </Link>
        </div>
      )}
    </div>
  )
}
