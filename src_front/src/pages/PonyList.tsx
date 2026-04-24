import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Box, Button, Grid, Typography } from '@mui/material'

import { listPonies, deletePony, type Pony } from '../api/ponies'
import {
  listPonyFriendships,
  listFriendshipHobbies,
  type PonyFriendship,
  type FriendshipHobby,
} from '../api/friendships'
import { listHobbies, listPonyHobbies, type Hobby } from '../api/hobbies'
import { PonyCard } from '../components/PonyCard'

export interface PonyListData {
  ponies: Pony[]
  ponyFriendships: PonyFriendship[]
  friendshipHobbies: FriendshipHobby[]
  hobbies: Hobby[]
  ponyHobbies: Hobby[][]
}

export default function PonyList() {
  const [ponies, setPonies] = useState<Pony[]>([])
  const [ponyFriendships, setPonyFriendships] = useState<PonyFriendship[]>([])
  const [friendshipHobbies, setFriendshipHobbies] = useState<FriendshipHobby[]>([])
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [ponyHobbiesMap, setPonyHobbiesMap] = useState<Record<number, Hobby[]>>({})
  const [error, setError] = useState<string | null>(null)

  const onErr = (err: unknown) =>
    setError(err instanceof Error ? err.message : 'Failed to load data.')

  useEffect(() => {
    Promise.all([
      listPonies(),
      listPonyFriendships(),
      listFriendshipHobbies(),
      listHobbies(),
    ])
      .then(async ([poniesRes, friendshipsRes, friendshipHobbiesRes, hobbiesRes]) => {
        const loaded = poniesRes.data
        const hobbyResults = await Promise.all(loaded.map((p) => listPonyHobbies(p.id)))
        const map: Record<number, Hobby[]> = {}
        loaded.forEach((p, i) => {
          map[p.id] = hobbyResults[i].data
        })
        setPonies(loaded)
        setPonyFriendships(friendshipsRes.data)
        setFriendshipHobbies(friendshipHobbiesRes.data)
        setHobbies(hobbiesRes.data)
        setPonyHobbiesMap(map)
      })
      .catch(onErr)
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deletePony(id)
      setPonies((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pony.')
    }
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Ponies</Typography>
        <Button
          variant="contained"
          component={Link}
          to="/ponies/new"
          size="small"
          sx={{ alignSelf: 'center' }}
        >
          Add Pony
        </Button>
      </Box>
      <Grid container spacing={2}>
        {ponies.map((pony) => (
          <Grid item xs={12} sm={6} md={3} key={pony.id}>
            <PonyCard
              pony={pony}
              ponies={ponies}
              ponyFriendships={ponyFriendships}
              friendshipHobbies={friendshipHobbies}
              hobbies={hobbies}
              ponyHobbies={ponyHobbiesMap[pony.id] ?? []}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
