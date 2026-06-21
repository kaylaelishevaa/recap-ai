import { useState, useEffect, useCallback } from 'react'
import { getMeeting } from '../services/api'

export default function useMeeting(id) {
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMeeting(id)
      setMeeting(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load meeting')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) fetch()
  }, [id, fetch])

  return { meeting, loading, error, refetch: fetch }
}
