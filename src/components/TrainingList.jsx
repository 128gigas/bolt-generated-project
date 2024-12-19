import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'

export function TrainingList() {
  const { clubId } = useParams()
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrainings()
  }, [clubId])

  async function getTrainings() {
    try {
      const { data } = await supabase
        .from('trainings')
        .select(`
          *,
          categories (name),
          coaches (name)
        `)
        .eq('club_id', clubId)
        .order('date', { ascending: false })

      setTrainings(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="trainings">
      <h2>Entrenamientos</h2>
      <button onClick={() => window.location.href = `/clubs/${clubId}/trainings/new`}>
        Nuevo Entrenamiento
      </button>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Entrenador</th>
            <th>Tipo</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map(training => (
            <tr key={training.id}>
              <td>{new Date(training.date).toLocaleDateString()}</td>
              <td>{training.categories?.name}</td>
              <td>{training.coaches?.name}</td>
              <td>{training.type}</td>
              <td>{training.duration} minutos</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
