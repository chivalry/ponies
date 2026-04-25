import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PonyForm from '../pages/PonyForm'
import * as poniesApi from '../api/ponies'

vi.mock('../api/ponies')

const mockCreatePony = vi.mocked(poniesApi.createPony)
const mockGetPony = vi.mocked(poniesApi.getPony)
const mockUpdatePony = vi.mocked(poniesApi.updatePony)

const pony = {
  id: 1,
  name: 'Twilight',
  image_path: null,
  uuid: 'u1',
  created_timestamp: '',
  modified_timestamp: '',
}

beforeEach(() => {
  mockCreatePony.mockResolvedValue({ data: pony } as never)
  mockGetPony.mockResolvedValue({ data: pony } as never)
  mockUpdatePony.mockResolvedValue({ data: pony } as never)
})

const renderNew = () =>
  render(
    <MemoryRouter initialEntries={['/ponies/new']}>
      <Routes>
        <Route path="/ponies/new" element={<PonyForm />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
  )

const renderEdit = () =>
  render(
    <MemoryRouter initialEntries={['/ponies/1/edit']}>
      <Routes>
        <Route path="/ponies/:id/edit" element={<PonyForm />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('PonyForm (new)', () => {
  it('shows New Pony heading', () => {
    renderNew()
    expect(screen.getByText('New Pony')).toBeInTheDocument()
  })

  it('shows a Name field', () => {
    renderNew()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('shows validation error when name is empty on submit', async () => {
    renderNew()
    fireEvent.click(screen.getByRole('button', { name: /create/i }))
    await waitFor(() => expect(screen.getByText(/name is required/i)).toBeInTheDocument())
  })
})

describe('PonyForm (edit)', () => {
  it('shows Edit Pony heading', async () => {
    renderEdit()
    await waitFor(() => expect(screen.getByText('Edit Pony')).toBeInTheDocument())
  })

  it('pre-fills name from the API', async () => {
    renderEdit()
    await waitFor(() => expect(screen.getByDisplayValue('Twilight')).toBeInTheDocument())
  })
})
