import { useState } from 'react'

export function useApiError(defaultMessage = 'An unexpected error occurred.') {
  const [error, setError] = useState<string | null>(null)

  const onErr = (err: unknown) =>
    setError(err instanceof Error ? err.message : defaultMessage)

  const clearError = () => setError(null)

  return { error, onErr, clearError }
}
