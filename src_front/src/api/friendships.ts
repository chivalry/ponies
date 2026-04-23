import client from './client'

export interface Friendship {
  id: number
  uuid: string
  created_timestamp: string
  modified_timestamp: string
}

export interface FriendshipHobby {
  id: number
  friendship_id: number
  hobby_id: number
  uuid: string
  created_timestamp: string
  modified_timestamp: string
}

export interface PonyFriendship {
  id: number
  friendship_id: number
  pony_id: number
  uuid: string
  created_timestamp: string
  modified_timestamp: string
}

export const listFriendships = () => client.get<Friendship[]>('/friendships/')
export const getFriendship = (id: number) => client.get<Friendship>(`/friendships/${id}/`)
export const createFriendship = (data: { pony_ids: number[] }) =>
  client.post<Friendship>('/friendships/', data)
export const deleteFriendship = (id: number) => client.delete(`/friendships/${id}/`)
export const assignHobbyToFriendship = (
  friendshipId: number,
  data: { hobby_id: number },
) => client.post(`/friendships/${friendshipId}/hobbies/`, data)
export const listPonyFriendships = () =>
  client.get<PonyFriendship[]>('/pony_friendships/')
export const deletePonyFriendship = (id: number) =>
  client.delete(`/pony_friendships/${id}/`)
export const listFriendshipHobbies = () =>
  client.get<FriendshipHobby[]>('/friendship_hobbies/')
