import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Grid, Typography } from '@mui/material'

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

  useEffect(() => {
    listPonies().then((r) => {
      const loaded = r.data
      setPonies(loaded)
      Promise.all(loaded.map((p) => listPonyHobbies(p.id))).then((results) => {
        const map: Record<number, Hobby[]> = {}
        loaded.forEach((p, i) => {
          map[p.id] = results[i].data
        })
        setPonyHobbiesMap(map)
      })
    })
    listPonyFriendships().then((r) => setPonyFriendships(r.data))
    listFriendshipHobbies().then((r) => setFriendshipHobbies(r.data))
    listHobbies().then((r) => setHobbies(r.data))
  }, [])

  const handleDelete = async (id: number) => {
    await deletePony(id)
    setPonies((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Ponies</Typography>
        <Button variant="contained" component={Link} to="/ponies/new">
          Add Pony
        </Button>
      </Box>
      <Grid container spacing={2}>
        {ponies.map((pony) => (
          <Grid item xs={12} sm={6} md={4} key={pony.id}>
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
