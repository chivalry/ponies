import client from './client'

export interface Hobby {
  id: number
  name: string
  pony_id: number
  uuid: string
  created_timestamp: string
  modified_timestamp: string
}

export const listHobbies = () => client.get<Hobby[]>('/hobbies/')
export const getHobby = (id: number) => client.get<Hobby>(`/hobbies/${id}/`)
export const createHobby = (data: { name: string; pony_id: number }) =>
  client.post<Hobby>('/hobbies/', data)
export const updateHobby = (id: number, data: { name: string }) =>
  client.put<Hobby>(`/hobbies/${id}/`, data)
export const deleteHobby = (id: number) => client.delete(`/hobbies/${id}/`)
