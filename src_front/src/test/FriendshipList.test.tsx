import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FriendshipList from '../pages/FriendshipList'
import * as friendshipsApi from '../api/friendships'
import * as poniesApi from '../api/ponies'
import * as hobbiesApi from '../api/hobbies'

vi.mock('../api/friendships')
vi.mock('../api/ponies')
vi.mock('../api/hobbies')

const mockListFriendships = vi.mocked(friendshipsApi.listFriendships)
const mockListPonyFriendships = vi.mocked(friendshipsApi.listPonyFriendships)
const mockListPonies = vi.mocked(poniesApi.listPonies)
const mockListHobbies = vi.mocked(hobbiesApi.listHobbies)

const pony = {
  id: 1,
  name: 'Twilight',
  image_path: null,
  uuid: 'p1',
  created_timestamp: '',
  modified_timestamp: '',
}

const friendship = {
  id: 5,
  uuid: 'f1',
  created_timestamp: '',
  modified_timestamp: '',
}

const ponyFriendship = {
  id: 20,
  friendship_id: 5,
  pony_id: 1,
  uuid: 'pf1',
  created_timestamp: '',
  modified_timestamp: '',
}

beforeEach(() => {
  mockListFriendships.mockResolvedValue({ data: [friendship] } as never)
  mockListPonyFriendships.mockResolvedValue({ data: [ponyFriendship] } as never)
  mockListPonies.mockResolvedValue({ data: [pony] } as never)
  mockListHobbies.mockResolvedValue({ data: [] } as never)
})

describe('FriendshipList', () => {
  it('renders the page heading', () => {
    render(
      <MemoryRouter>
        <FriendshipList />
      </MemoryRouter>,
    )
    expect(screen.getByText('Friendships')).toBeInTheDocument()
  })

  it('shows New Friendship button', async () => {
    render(
      <MemoryRouter>
        <FriendshipList />
      </MemoryRouter>,
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new friendship/i })).toBeInTheDocument(),
    )
  })

  it('shows empty message when no friendships', async () => {
    mockListFriendships.mockResolvedValue({ data: [] } as never)
    mockListPonyFriendships.mockResolvedValue({ data: [] } as never)
    render(
      <MemoryRouter>
        <FriendshipList />
      </MemoryRouter>,
    )
    await waitFor(() =>
      expect(screen.getByText(/no friendships yet/i)).toBeInTheDocument(),
    )
  })

  it('shows error alert when data load fails', async () => {
    mockListFriendships.mockRejectedValue(new Error('network error'))
    render(
      <MemoryRouter>
        <FriendshipList />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })
})
