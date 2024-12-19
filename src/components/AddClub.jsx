import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export function AddClub() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    founded_year: '',
    city: ''
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase
        .from('clubs')
        .insert([formData])
      
      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Agregar Club</h2>
      <input
        type="text"
        placeholder="Nombre"
        onChange={e => setFormData({...formData, name: e.target.value})}
      />
      <input
        type="number"
        placeholder="Año de fundación"
        onChange={e => setFormData({...formData, founded_year: e.target.value})}
      />
      <input
        type="text"
        placeholder="Ciudad"
        onChange={e => setFormData({...formData, city: e.target.value})}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
