import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { getPony, listPonies, type Pony } from '../api/ponies'
import {
  listHobbies,
  listPonyHobbies,
  listPonyHobbyAssignments,
  assignHobbyToPony,
  unassignHobbyFromPony,
  type Hobby,
  type PonyHobby,
} from '../api/hobbies'
import { listPonyFriendships, type PonyFriendship } from '../api/friendships'
import { CircularImage } from '../components/CircularImage'

/** Page showing a pony's details, hobbies, and friendships with hobby assignment. */
export default function PonyDetail() {
  const { id } = useParams<{ id: string }>()
  const [pony, setPony] = useState<Pony | null>(null)
  const [allPonies, setAllPonies] = useState<Pony[]>([])
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [ponyHobbies, setPonyHobbies] = useState<PonyHobby[]>([])
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([])
  const [selectedHobbyId, setSelectedHobbyId] = useState<number | ''>('')
  const [allPonyFriendships, setAllPonyFriendships] = useState<PonyFriendship[]>([])

  const numId = Number(id)
  const [error, setError] = useState<string | null>(null)

  const onErr = (err: unknown) =>
    setError(err instanceof Error ? err.message : 'Failed to load data.')

  const refreshHobbyState = (id: number) => {
    Promise.all([listPonyHobbies(id), listPonyHobbyAssignments(id), listHobbies()])
      .then(([ponyHobbiesRes, assignmentsRes, allRes]) => {
        const assigned = new Set(ponyHobbiesRes.data.map((h) => h.id))
        setHobbies(ponyHobbiesRes.data)
        setPonyHobbies(assignmentsRes.data)
        setAllHobbies(allRes.data.filter((h) => !assigned.has(h.id)))
      })
      .catch(onErr)
  }

  useEffect(() => {
    Promise.all([getPony(numId), listPonies(), listPonyFriendships()])
      .then(([ponyRes, poniesRes, friendshipsRes]) => {
        setPony(ponyRes.data)
        setAllPonies(poniesRes.data)
        setAllPonyFriendships(friendshipsRes.data)
      })
      .catch(onErr)
    refreshHobbyState(numId)
  }, [numId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAssign = async () => {
    if (!selectedHobbyId) return
    try {
      await assignHobbyToPony(numId, selectedHobbyId as number)
      setSelectedHobbyId('')
      refreshHobbyState(numId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign hobby.')
    }
  }

  const handleUnassign = async (hobbyId: number) => {
    const ph = ponyHobbies.find((p) => p.hobby_id === hobbyId)
    if (!ph) return
    try {
      await unassignHobbyFromPony(ph.id)
      refreshHobbyState(numId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unassign hobby.')
    }
  }

  const myFriendshipIds = allPonyFriendships
    .filter((pf) => pf.pony_id === numId)
    .map((pf) => pf.friendship_id)

  const friends = allPonyFriendships
    .filter((pf) => myFriendshipIds.includes(pf.friendship_id) && pf.pony_id !== numId)
    .map((pf) => allPonies.find((p) => p.id === pf.pony_id))
    .filter((p): p is Pony => p !== undefined)

  if (!pony)
    return error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <Typography>Loading…</Typography>
    )

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {pony.name}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        {pony.image_path && (
          <Box sx={{ flexShrink: 0 }}>
            <CircularImage src={`/${pony.image_path}`} alt={pony.name} size={300} />
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">Hobbies</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
            {hobbies.length === 0 && <Typography>No hobbies yet.</Typography>}
            {hobbies.map((h) => (
              <Chip key={h.id} label={h.name} onDelete={() => handleUnassign(h.id)} />
            ))}
          </Box>
          {allHobbies.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Select
                value={selectedHobbyId}
                onChange={(e) => setSelectedHobbyId(e.target.value as number)}
                displayEmpty
                size="small"
              >
                <MenuItem value="">Assign hobby…</MenuItem>
                {allHobbies.map((h) => (
                  <MenuItem key={h.id} value={h.id}>
                    {h.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="outlined"
                size="small"
                disabled={!selectedHobbyId}
                onClick={handleAssign}
              >
                Assign
              </Button>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Friends</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 1 }}>
            {friends.length === 0 && <Typography>No friends yet.</Typography>}
            {friends.map((friend) => (
              <Box
                key={friend.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {friend.image_path && (
                  <CircularImage
                    src={`/${friend.image_path}`}
                    alt={friend.name}
                    size={80}
                  />
                )}
                <Typography variant="caption">{friend.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button component={Link} to={`/ponies/${id}/edit`} variant="outlined">
          Edit
        </Button>
      </Box>
    </Box>
  )
}
