import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PonyList from '../pages/PonyList'
import * as poniesApi from '../api/ponies'

vi.mock('../api/ponies')

const mockListPonies = vi.mocked(poniesApi.listPonies)
const mockDeletePony = vi.mocked(poniesApi.deletePony)

beforeEach(() => {
    mockListPonies.mockResolvedValue({
        data: [
            {
                id: 1,
                name: 'Twilight',
                image_path: null,
                uuid: 'u1',
                created_timestamp: '',
                modified_timestamp: '',
            },
        ],
    } as never)
    mockDeletePony.mockResolvedValue({} as never)
})

describe('PonyList', () => {
    it('renders pony names', async () => {
        render(
            <MemoryRouter>
                <PonyList />
            </MemoryRouter>,
        )
        await waitFor(() => expect(screen.getByText('Twilight')).toBeInTheDocument())
    })

    it('shows Add Pony button', () => {
        render(
            <MemoryRouter>
                <PonyList />
            </MemoryRouter>,
        )
        expect(screen.getByText('Add Pony')).toBeInTheDocument()
    })
})
