import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PonyCard } from '../components/PonyCard'
import type { Pony } from '../api/ponies'
import type { Hobby } from '../api/hobbies'
import type { PonyFriendship, FriendshipHobby } from '../api/friendships'

const pony: Pony = {
  id: 1,
  name: 'Twilight',
  image_path: null,
  uuid: 'u1',
  created_timestamp: '',
  modified_timestamp: '',
}

const hobby: Hobby = {
  id: 10,
  name: 'Reading',
  uuid: 'h1',
  created_timestamp: '',
  modified_timestamp: '',
}

const empty = {
  ponies: [] as Pony[],
  ponyFriendships: [] as PonyFriendship[],
  friendshipHobbies: [] as FriendshipHobby[],
  hobbies: [] as Hobby[],
  ponyHobbies: [] as Hobby[],
}

const wrap = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('PonyCard', () => {
  it('renders the pony name', () => {
    wrap(<PonyCard pony={pony} {...empty} onDelete={vi.fn()} />)
    expect(screen.getByText('Twilight')).toBeInTheDocument()
  })

  it('shows View and Edit links', () => {
    wrap(<PonyCard pony={pony} {...empty} onDelete={vi.fn()} />)
    expect(screen.getByRole('link', { name: /view/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /edit/i })).toBeInTheDocument()
  })

  it('calls onDelete with pony id when Delete is clicked', () => {
    const onDelete = vi.fn()
    wrap(<PonyCard pony={pony} {...empty} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('renders pony hobbies as chips', () => {
    wrap(<PonyCard pony={pony} {...empty} ponyHobbies={[hobby]} onDelete={vi.fn()} />)
    expect(screen.getByText('Reading')).toBeInTheDocument()
  })
})
