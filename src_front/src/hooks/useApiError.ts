import axios from 'axios'
import { useState } from 'react'

export function useApiError(defaultMessage = 'An unexpected error occurred.') {
  const [error, setError] = useState<string | null>(null)

  const onErr = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.error ?? err.message)
    } else {
      setError(err instanceof Error ? err.message : defaultMessage)
    }
  }

  const clearError = () => setError(null)

  return { error, onErr, clearError }
}
