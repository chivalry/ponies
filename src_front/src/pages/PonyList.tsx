import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'

import { listPonies, deletePony, type Pony, type PonySort } from '../api/ponies'
import {
  listPonyFriendships,
  listFriendshipHobbies,
  type PonyFriendship,
  type FriendshipHobby,
} from '../api/friendships'
import { listHobbies, listPonyHobbies, type Hobby } from '../api/hobbies'
import {
  listGenerations,
  listGenerationPonies,
  type Generation,
} from '../api/generations'
import { PonyCard } from '../components/PonyCard'
import { useApiError } from '../hooks/useApiError'

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
  const [generations, setGenerations] = useState<Generation[]>([])
  const [ponyHobbiesMap, setPonyHobbiesMap] = useState<Record<number, Hobby[]>>({})
  const [generationFilter, setGenerationFilter] = useState<number | 'all'>('all')
  const [sort, setSort] = useState<PonySort>('created_asc')
  const { error, onErr } = useApiError('Failed to load data.')
  const [loading, setLoading] = useState(true)

  const loadPonies = async (genFilter: number | 'all', sortOrder: PonySort) => {
    const poniesRes =
      genFilter === 'all'
        ? await listPonies(sortOrder)
        : await listGenerationPonies(genFilter, sortOrder)
    const loaded = poniesRes.data
    const hobbyResults = await Promise.all(loaded.map((p) => listPonyHobbies(p.id)))
    const map: Record<number, Hobby[]> = {}
    loaded.forEach((p, i) => {
      map[p.id] = hobbyResults[i].data
    })
    setPonies(loaded)
    setPonyHobbiesMap(map)
  }

  useEffect(() => {
    Promise.all([
      listPonyFriendships(),
      listFriendshipHobbies(),
      listHobbies(),
      listGenerations(),
      listPonies(sort),
    ])
      .then(async ([friendshipsRes, fhRes, hobbiesRes, genRes, poniesRes]) => {
        const loaded = poniesRes.data
        const hobbyResults = await Promise.all(loaded.map((p) => listPonyHobbies(p.id)))
        const map: Record<number, Hobby[]> = {}
        loaded.forEach((p, i) => {
          map[p.id] = hobbyResults[i].data
        })
        setPonies(loaded)
        setPonyFriendships(friendshipsRes.data)
        setFriendshipHobbies(fhRes.data)
        setHobbies(hobbiesRes.data)
        setGenerations(genRes.data)
        setPonyHobbiesMap(map)
      })
      .catch(onErr)
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = async (genFilter: number | 'all', sortOrder: PonySort) => {
    setLoading(true)
    try {
      await loadPonies(genFilter, sortOrder)
    } catch (err) {
      onErr(err)
    } finally {
      setLoading(false)
    }
  }

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
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Generation</InputLabel>
          <Select
            value={generationFilter}
            label="Generation"
            onChange={(e) => {
              const val = e.target.value as number | 'all'
              setGenerationFilter(val)
              handleFilterChange(val, sort)
            }}
          >
            <MenuItem value="all">All Generations</MenuItem>
            {generations.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sort}
            label="Sort"
            onChange={(e) => {
              const val = e.target.value as PonySort
              setSort(val)
              handleFilterChange(generationFilter, val)
            }}
          >
            <MenuItem value="name_asc">Name A → Z</MenuItem>
            <MenuItem value="name_desc">Name Z → A</MenuItem>
            <MenuItem value="created_asc">Oldest first</MenuItem>
            <MenuItem value="created_desc">Newest first</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : ponies.length === 0 ? (
        <Typography color="text.secondary">
          No ponies yet. Add one to get started.
        </Typography>
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
                generations={generations}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
