import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HobbyList from '../pages/HobbyList'
import * as hobbiesApi from '../api/hobbies'

vi.mock('../api/hobbies')

const mockListHobbies = vi.mocked(hobbiesApi.listHobbies)
const mockCreateHobby = vi.mocked(hobbiesApi.createHobby)
const mockDeleteHobby = vi.mocked(hobbiesApi.deleteHobby)

const hobbyRow = {
  id: 1,
  name: 'Painting',
  uuid: 'h1',
  created_timestamp: '',
  modified_timestamp: '',
}

beforeEach(() => {
  mockListHobbies.mockResolvedValue({ data: [hobbyRow] } as never)
  mockCreateHobby.mockResolvedValue({ data: hobbyRow } as never)
  mockDeleteHobby.mockResolvedValue({} as never)
})

describe('HobbyList', () => {
  it('renders hobby names after loading', async () => {
    render(
      <MemoryRouter>
        <HobbyList />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText('Painting')).toBeInTheDocument())
  })

  it('shows Add Hobby button', () => {
    render(
      <MemoryRouter>
        <HobbyList />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /add hobby/i })).toBeInTheDocument()
  })

  it('shows empty message when no hobbies', async () => {
    mockListHobbies.mockResolvedValue({ data: [] } as never)
    render(
      <MemoryRouter>
        <HobbyList />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText(/no hobbies yet/i)).toBeInTheDocument())
  })

  it('shows error alert when list call fails', async () => {
    mockListHobbies.mockRejectedValue(new Error('network error'))
    render(
      <MemoryRouter>
        <HobbyList />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('opens create dialog when Add Hobby is clicked', async () => {
    render(
      <MemoryRouter>
        <HobbyList />
      </MemoryRouter>,
    )
    await waitFor(() => screen.getByText('Painting'))
    fireEvent.click(screen.getByRole('button', { name: /add hobby/i }))
    expect(screen.getByText('New Hobby')).toBeInTheDocument()
  })
})
