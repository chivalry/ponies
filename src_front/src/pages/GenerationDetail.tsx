import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { listGenerationPonies, type Generation } from '../api/generations'
import { listGenerations } from '../api/generations'
import { deletePony, type Pony } from '../api/ponies'
import {
  listPonyFriendships,
  listFriendshipHobbies,
  type PonyFriendship,
  type FriendshipHobby,
} from '../api/friendships'
import { listHobbies, listPonyHobbies, type Hobby } from '../api/hobbies'
import { PonyCard } from '../components/PonyCard'
import { useApiError } from '../hooks/useApiError'

/** Shows all ponies belonging to a single generation, using the same grid as PonyList. */
export default function GenerationDetail() {
  const { id } = useParams<{ id: string }>()
  const generationId = Number(id)

  const [generation, setGeneration] = useState<Generation | null>(null)
  const [ponies, setPonies] = useState<Pony[]>([])
  const [ponyFriendships, setPonyFriendships] = useState<PonyFriendship[]>([])
  const [friendshipHobbies, setFriendshipHobbies] = useState<FriendshipHobby[]>([])
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [ponyHobbiesMap, setPonyHobbiesMap] = useState<Record<number, Hobby[]>>({})
  const { error, onErr } = useApiError('Failed to load data.')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      listGenerations(),
      listGenerationPonies(generationId),
      listPonyFriendships(),
      listFriendshipHobbies(),
      listHobbies(),
    ])
      .then(async ([genRes, poniesRes, friendshipsRes, fhRes, hobbiesRes]) => {
        const loaded = poniesRes.data
        const hobbyResults = await Promise.all(loaded.map((p) => listPonyHobbies(p.id)))
        const map: Record<number, Hobby[]> = {}
        loaded.forEach((p, i) => {
          map[p.id] = hobbyResults[i].data
        })
        setGeneration(genRes.data.find((g) => g.id === generationId) ?? null)
        setPonies(loaded)
        setPonyFriendships(friendshipsRes.data)
        setFriendshipHobbies(fhRes.data)
        setHobbies(hobbiesRes.data)
        setPonyHobbiesMap(map)
      })
      .catch(onErr)
      .finally(() => setLoading(false))
  }, [generationId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: number) => {
    try {
      await deletePony(id)
      setPonies((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      onErr(err)
    }
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h4">{generation?.name ?? 'Generation'}</Typography>
        <Button
          variant="contained"
          component={Link}
          to={`/ponies/new?generationId=${generationId}`}
          size="small"
        >
          Add Pony
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : ponies.length === 0 ? (
        <Typography color="text.secondary">No ponies in this generation.</Typography>
      ) : (
        <Grid container spacing={2}>
          {ponies.map((pony) => (
            <Grid key={pony.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <PonyCard
                pony={pony}
                ponies={ponies}
                ponyFriendships={ponyFriendships}
                friendshipHobbies={friendshipHobbies}
                hobbies={hobbies}
                ponyHobbies={ponyHobbiesMap[pony.id] ?? []}
                showGeneration={false}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
