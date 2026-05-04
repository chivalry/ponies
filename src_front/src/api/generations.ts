import client from './client'
import type { Pony, PonySort } from './ponies'

export interface Generation {
  id: number
  name: string
  uuid: string
  created_timestamp: string
  modified_timestamp: string
}

export const listGenerations = () => client.get<Generation[]>('/generations/')
export const createGeneration = (data: { name: string }) =>
  client.post<Generation>('/generations/', data)
export const updateGeneration = (id: number, data: { name: string }) =>
  client.put<Generation>(`/generations/${id}/`, data)
export const deleteGeneration = (id: number) => client.delete(`/generations/${id}/`)
export const listGenerationPonies = (id: number, sort?: PonySort) =>
  client.get<Pony[]>(`/generations/${id}/ponies/`, {
    params: sort ? { sort } : undefined,
  })
