import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'

export function MatchList() {
  const { clubId } = useParams()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMatches()
  }, [clubId])

  async function getMatches() {
    try {
      const { data } = await supabase
        .from('matches')
        .select(`
          *,
          categories (name),
          opponent_team (name)
        `)
        .eq('club_id', clubId)
        .order('date', { ascending: false })

      setMatches(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="matches">
      <h2>Partidos</h2>
      <button onClick={() => window.location.href = `/clubs/${clubId}/matches/new`}>
        Nuevo Partido
      </button>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Rival</th>
            <th>Local/Visitante</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => (
            <tr key={match.id}>
              <td>{new Date(match.date).toLocaleDateString()}</td>
              <td>{match.categories?.name}</td>
              <td>{match.opponent_team?.name}</td>
              <td>{match.is_home ? 'Local' : 'Visitante'}</td>
              <td>{match.score_home} - {match.score_away}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
