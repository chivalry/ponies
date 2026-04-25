import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApiError } from '../hooks/useApiError'

describe('useApiError', () => {
  it('starts with null error', () => {
    const { result } = renderHook(() => useApiError())
    expect(result.current.error).toBeNull()
  })

  it('sets error message from an Error instance', () => {
    const { result } = renderHook(() => useApiError())
    act(() => result.current.onErr(new Error('oops')))
    expect(result.current.error).toBe('oops')
  })

  it('sets default message for non-Error values', () => {
    const { result } = renderHook(() => useApiError('default msg'))
    act(() => result.current.onErr('something bad'))
    expect(result.current.error).toBe('default msg')
  })

  it('clears error via clearError', () => {
    const { result } = renderHook(() => useApiError())
    act(() => result.current.onErr(new Error('oops')))
    act(() => result.current.clearError())
    expect(result.current.error).toBeNull()
  })
})
