import client from './client'

export interface Hobby {
  id: number
  name: string
  uuid: string
  created_timestamp: string
  modified_timestamp: string
}

export interface PonyHobby {
  id: number
  pony_id: number
  hobby_id: number
  uuid: string
  created_timestamp: string
  modified_timestamp: string
}

export const listHobbies = () => client.get<Hobby[]>('/hobbies/')
export const getHobby = (id: number) => client.get<Hobby>(`/hobbies/${id}/`)
export const createHobby = (data: { name: string }) =>
  client.post<Hobby>('/hobbies/', data)
export const updateHobby = (id: number, data: { name: string }) =>
  client.put<Hobby>(`/hobbies/${id}/`, data)
export const deleteHobby = (id: number) => client.delete(`/hobbies/${id}/`)
export const listPonyHobbies = (ponyId: number) =>
  client.get<Hobby[]>(`/ponies/${ponyId}/hobbies/`)
export const listPonyHobbyAssignments = (ponyId: number): Promise<PonyHobby[]> =>
  client
    .get<PonyHobby[]>('/pony_hobbies/')
    .then((r) => r.data.filter((ph) => ph.pony_id === ponyId))
export const assignHobbyToPony = (ponyId: number, hobbyId: number) =>
  client.post<PonyHobby>('/pony_hobbies/', { pony_id: ponyId, hobby_id: hobbyId })
export const unassignHobbyFromPony = (ponyHobbyId: number) =>
  client.delete(`/pony_hobbies/${ponyHobbyId}/`)
