import client from './client'

export interface Pony {
  id: number
  name: string
  image_path: string | null
  uuid: string
  created_timestamp: string
  modified_timestamp: string
}

export const listPonies = () => client.get<Pony[]>('/ponies/')
export const getPony = (id: number) => client.get<Pony>(`/ponies/${id}/`)
export const createPony = (data: FormData) => client.post<Pony>('/ponies/', data)
export const updatePony = (id: number, data: FormData) =>
  client.put<Pony>(`/ponies/${id}/`, data)
export const deletePony = (id: number) => client.delete(`/ponies/${id}/`)
