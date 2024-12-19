import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../supabase'

export function AddCategory() {
  const { clubId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState('')
  const [error, setError] = useState(null)

  // Generar años desde 2012 hasta 2019
  const years = Array.from({ length: 8 }, (_, i) => 2019 - i)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!selectedYear) {
      setError('Por favor selecciona un año')
      setLoading(false)
      return
    }

    try {
      // Primero verificamos si la categoría ya existe
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('club_id', clubId)
        .eq('name', selectedYear)
        .single()

      if (existingCategory) {
        setError('Esta categoría ya existe para este club')
        setLoading(false)
        return
      }

      // Si no existe, la creamos
      const { error: insertError } = await supabase
        .from('categories')
        .insert({
          name: selectedYear,
          club_id: clubId
        })

      if (insertError) throw insertError

      navigate(`/clubs/${clubId}/categories`)
    } catch (error) {
      console.error('Error al crear categoría:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          to={`/clubs/${clubId}/categories`} 
          className="text-gray-600 hover:text-primary-600 inline-flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i>
          Volver a categorías
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Nueva Categoría</h1>
      </div>

      <div className="card max-w-2xl">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Año de la Categoría</label>
            <select
              className="form-input"
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              required
            >
              <option value="">Selecciona un año</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              Selecciona el año correspondiente a la categoría
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !selectedYear}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Guardar Categoría
                </>
              )}
            </button>

            <Link
              to={`/clubs/${clubId}/categories`}
              className="btn btn-outline"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-600">
          <i className="fas fa-info-circle mr-2"></i>
          Las categorías corresponden a los años desde 2012 hasta 2019.
          Cada año representa una categoría diferente de jugadores.
        </p>
      </div>
    </div>
  )
}
