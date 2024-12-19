import { createClient } from '@supabase/supabase-js'

// Reemplaza con tus credenciales de Supabase
const supabaseUrl = 'https://vjtwvpdggttdrhdcfrqb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdHd2cGRnZ3R0ZHJoZGNmcnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1Mjg0MTksImV4cCI6MjA1MDEwNDQxOX0.UrjaXu-gBswwrk_FNufAEzqrD3s_wnGDHmvmEln9yrI'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const POSITIONS = [
  'Portero',
  'Defensa Central',
  'Lateral Derecho',
  'Lateral Izquierdo',
  'Mediocentro',
  'Centrocampista',
  'Extremo Derecho',
  'Extremo Izquierdo',
  'Delantero'
]

export const CATEGORIES = [
  'Primera División',
  'Sub-20',
  'Sub-17',
  'Sub-15',
  'Sub-13',
  'Femenino'
]
