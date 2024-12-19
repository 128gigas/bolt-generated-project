import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../supabase'

export function AddPlayer() {
  const { clubId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    position: '',
    category_id: '',
    birth_date: '',
    health_card_expiry: '',
    profile_photo: null
  })
  const [photoPreview, setPhotoPreview] = useState(null)
  const [error, setError] = useState(null)

  const positions = [
    'Arquero',
    'Defensor Central',
    'Lateral Derecho',
    'Lateral Izquierdo',
    'Mediocampista Central',
    'Mediocampista Ofensivo',
    'Mediocampista Defensivo',
    'Extremo Derecho',
    'Extremo Izquierdo',
    'Delantero Centro'
  ]

  useEffect(() => {
    getCategories()
  }, [])

  async function getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('club_id', clubId)
        .order('name', { ascending: false })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      setError('Error al cargar las categorías')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validaciones básicas
      if (!formData.name.trim()) throw new Error('El nombre es requerido')
      if (!formData.number) throw new Error('El número es requerido')
      if (!formData.position) throw new Error('La posición es requerida')
      if (!formData.category_id) throw new Error('La categoría es requerida')
      if (!formData.birth_date) throw new Error('La fecha de nacimiento es requerida')
      if (!formData.health_card_expiry) throw new Error('La fecha de vencimiento del carnet es requerida')

      // Preparar datos para insertar
      const playerData = {
        name: formData.name.trim(),
        number: parseInt(formData.number),
        position: formData.position,
        category_id: formData.category_id,
        club_id: clubId,
        birth_date: formData.birth_date,
        health_card_expiry: formData.health_card_expiry,
        profile_photo: formData.profile_photo || null
      }

      console.log('Intentando crear jugador con datos:', playerData)

      const { data, error } = await supabase
        .from('players')
        .insert([playerData])

      if (error) {
        console.error('Error al insertar jugador:', error)
        throw new Error('Error al crear el jugador: ' + error.message)
      }

      console.log('Jugador creado exitosamente:', data)
      navigate(`/clubs/${clubId}/categories/${formData.category_id}`)
    } catch (error) {
      console.error('Error en el proceso:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          to={`/clubs/${clubId}`} 
          className="text-gray-600 hover:text-primary-600 inline-flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i>
          Volver al club
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Nuevo Jugador</h1>
      </div>

      <div className="card max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos básicos */}
          <div>
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Número</label>
              <input
                type="number"
                className="form-input"
                value={formData.number}
                onChange={e => setFormData({ ...formData, number: e.target.value })}
                required
                min="1"
                max="99"
                placeholder="Ej: 10"
              />
            </div>

            <div>
              <label className="form-label">Posición</label>
              <select
                className="form-input"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                required
              >
                <option value="">Selecciona una posición</option>
                {positions.map(position => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Categoría</label>
            <select
              className="form-input"
              value={formData.category_id}
              onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                className="form-input"
                value={formData.birth_date}
                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Vencimiento carnet de salud</label>
              <input
                type="date"
                className="form-input"
                value={formData.health_card_expiry}
                onChange={e => setFormData({ ...formData, health_card_expiry: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Guardar Jugador
                </>
              )}
            </button>

            <Link
              to={`/clubs/${clubId}`}
              className="btn btn-outline"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
