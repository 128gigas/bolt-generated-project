import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export function AddPlayer() {
  const navigate = useNavigate()
  const [clubs, setClubs] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    number: '',
    club_id: ''
  })
  const [loading, setLoading] = useState(false)

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
      setClubs(data)
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase
        .from('players')
        .insert([formData])
      
      if (error) throw error
      navigate('/players')
    } catch (error) {
      console.error('Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Agregar Jugador</h2>
      <input
        type="text"
        placeholder="Nombre"
        onChange={e => setFormData({...formData, name: e.target.value})}
      />
      <input
        type="text"
        placeholder="Posición"
        onChange={e => setFormData({...formData, position: e.target.value})}
      />
      <input
        type="number"
        placeholder="Número"
        onChange={e => setFormData({...formData, number: e.target.value})}
      />
      <select onChange={e => setFormData({...formData, club_id: e.target.value})}>
        <option value="">Seleccionar club</option>
        {clubs.map(club => (
          <option key={club.id} value={club.id}>{club.name}</option>
        ))}
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
