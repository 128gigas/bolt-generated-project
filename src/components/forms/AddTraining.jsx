import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'

export function AddTraining() {
  const { clubId } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [coaches, setCoaches] = useState([])
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    duration: '',
    description: '',
    category_id: '',
    coach_id: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories()
    getCoaches()
  }, [])

  async function getCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('club_id', clubId)
    setCategories(data || [])
  }

  async function getCoaches() {
    const { data } = await supabase
      .from('coaches')
      .select('*')
      .eq('club_id', clubId)
    setCoaches(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase
        .from('trainings')
        .insert([{ ...formData, club_id: clubId }])
      
      if (error) throw error
      navigate(`/clubs/${clubId}/trainings`)
    } catch (error) {
      alert('Error al crear entrenamiento')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>Agregar Entrenamiento</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha y Hora:</label>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo:</label>
          <select
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
            required
          >
            <option value="">Seleccionar tipo</option>
            <option value="Físico">Físico</option>
            <option value="Táctico">Táctico</option>
            <option value="Técnico">Técnico</option>
            <option value="Partido">Partido de práctica</option>
          </select>
        </div>

        <div className="form-group">
          <label>Duración (minutos):</label>
          <input
            type="number"
            value={formData.duration}
            onChange={e => setFormData({...formData, duration: e.target.value})}
            required
          />
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

        <div className="form-group">
          <label>Entrenador:</label>
          <select
            value={formData.coach_id}
            onChange={e => setFormData({...formData, coach_id: e.target.value})}
            required
          >
            <option value="">Seleccionar entrenador</option>
            {coaches.map(coach => (
              <option key={coach.id} value={coach.id}>{coach.name} - {coach.role}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            rows="4"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Entrenamiento'}
        </button>
      </form>
    </div>
  )
}
