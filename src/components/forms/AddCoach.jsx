import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'

export function AddCoach() {
  const { clubId } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category_id: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories()
  }, [])

  async function getCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('club_id', clubId)
    setCategories(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase
        .from('coaches')
        .insert([{ ...formData, club_id: clubId }])
      
      if (error) throw error
      navigate(`/clubs/${clubId}`)
    } catch (error) {
      alert('Error al crear entrenador')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>Agregar Entrenador</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Rol:</label>
          <select
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value})}
            required
          >
            <option value="">Seleccionar rol</option>
            <option value="Principal">Entrenador Principal</option>
            <option value="Asistente">Entrenador Asistente</option>
            <option value="Preparador Físico">Preparador Físico</option>
            <option value="Entrenador de Porteros">Entrenador de Porteros</option>
          </select>
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          <select
            value={formData.category_id}
            onChange={e => setFormData({...formData, category_id: e.target.value})}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Entrenador'}
        </button>
      </form>
    </div>
  )
}
