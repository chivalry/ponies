import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CircularImage } from '../components/CircularImage'

describe('CircularImage', () => {
  it('renders an img with correct src and alt', () => {
    render(<CircularImage src="/uploads/pony.jpg" alt="Rainbow Dash" size={80} />)
    const img = screen.getByRole('img', { name: 'Rainbow Dash' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/uploads/pony.jpg')
  })
})
