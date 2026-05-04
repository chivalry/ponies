import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import {
  listFriendships,
  createFriendship,
  deleteFriendship,
  assignHobbyToFriendship,
  listPonyFriendships,
  type Friendship,
  type PonyFriendship,
} from '../api/friendships'
import { listPonies, type Pony } from '../api/ponies'
import { listGenerations, type Generation } from '../api/generations'
import { listHobbies, type Hobby } from '../api/hobbies'
import { useApiError } from '../hooks/useApiError'
import { CircularImage } from '../components/CircularImage'

interface FriendshipCardProps {
  friendship: Friendship
  ponies: PonyFriendship[]
  ponyName: (id: number) => string | number
  ponyImage: (id: number) => string | null
  ponyGeneration: (id: number) => string | null
  onDelete: (id: number) => void
  onAddHobby: (id: number) => void
}

/** Renders a single friendship as a compact card with pony images and actions. */
const FriendshipCard = ({
  friendship: f,
  ponies,
  ponyName,
  ponyImage,
  ponyGeneration,
  onDelete,
  onAddHobby,
}: FriendshipCardProps) => (
  <Card sx={{ width: 'fit-content', minWidth: 160 }}>
    <CardContent>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
        {ponies.map((pf) => {
          const imgPath = ponyImage(pf.pony_id)
          const name = String(ponyName(pf.pony_id))
          const gen = ponyGeneration(pf.pony_id)
          return (
            <Box
              key={pf.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {imgPath && <CircularImage src={`/${imgPath}`} alt={name} size={40} />}
              <Chip label={name} size="small" />
              {gen && <Chip label={gen} size="small" color="secondary" />}
            </Box>
          )
        })}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button size="small" onClick={() => onAddHobby(f.id)}>
          Add Hobby
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(f.id)}>
          Delete
        </Button>
      </Box>
    </CardContent>
  </Card>
)

interface CreateFriendshipDialogProps {
  open: boolean
  ponies: Pony[]
  generations: Generation[]
  generationFilter: number | 'all'
  onFilterChange: (val: number | 'all') => void
  selectedPonies: number[]
  disabledPonies: Set<number>
  onTogglePony: (id: number) => void
  onCreate: () => void
  onClose: () => void
}

/** Dialog for selecting two ponies and creating a friendship between them. */
const CreateFriendshipDialog = ({
  open,
  ponies,
  generations,
  generationFilter,
  onFilterChange,
  selectedPonies,
  disabledPonies,
  onTogglePony,
  onCreate,
  onClose,
}: CreateFriendshipDialogProps) => {
  const visiblePonies =
    generationFilter === 'all'
      ? ponies
      : ponies.filter((p) => p.generation_id === generationFilter)

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Friendship</DialogTitle>
      <DialogContent>
        <FormControl size="small" sx={{ minWidth: 160, mb: 2 }}>
          <InputLabel>Generation</InputLabel>
          <Select
            value={generationFilter}
            label="Generation"
            onChange={(e) => onFilterChange(e.target.value as number | 'all')}
          >
            <MenuItem value="all">All Generations</MenuItem>
            {generations.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Select exactly 2 ponies:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {visiblePonies.map((p) => {
            const genName = generations.find((g) => g.id === p.generation_id)?.name
            return (
              <Chip
                key={p.id}
                label={genName ? `${p.name} (${genName})` : p.name}
                onClick={() => onTogglePony(p.id)}
                color={selectedPonies.includes(p.id) ? 'primary' : 'default'}
                clickable
                disabled={disabledPonies.has(p.id)}
              />
            )
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onCreate}
          variant="contained"
          disabled={selectedPonies.length !== 2}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface AssignHobbyDialogProps {
  open: boolean
  hobbies: Hobby[]
  selectedHobby: number | ''
  onSelectHobby: (id: number | '') => void
  onAssign: () => void
  onClose: () => void
}

/** Dialog for selecting a hobby and assigning it to a friendship. */
const AssignHobbyDialog = ({
  open,
  hobbies,
  selectedHobby,
  onSelectHobby,
  onAssign,
  onClose,
}: AssignHobbyDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Assign Hobby to Friendship</DialogTitle>
    <DialogContent>
      <Select
        value={selectedHobby}
        onChange={(e) => onSelectHobby(e.target.value as number | '')}
        displayEmpty
        fullWidth
        sx={{ mt: 1 }}
      >
        <MenuItem value="">Select hobby…</MenuItem>
        {hobbies.map((h) => (
          <MenuItem key={h.id} value={h.id}>
            {h.name}
          </MenuItem>
        ))}
      </Select>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onAssign} variant="contained">
        Assign
      </Button>
    </DialogActions>
  </Dialog>
)

/** Page listing all friendships with options to create, delete, and assign hobbies. */
export default function FriendshipList() {
  const [friendships, setFriendships] = useState<Friendship[]>([])
  const [ponyFriendships, setPonyFriendships] = useState<PonyFriendship[]>([])
  const [ponies, setPonies] = useState<Pony[]>([])
  const [generations, setGenerations] = useState<Generation[]>([])
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [hobbyOpen, setHobbyOpen] = useState<number | null>(null)
  const [selectedPonies, setSelectedPonies] = useState<number[]>([])
  const [generationFilter, setGenerationFilter] = useState<number | 'all'>('all')
  const [selectedHobby, setSelectedHobby] = useState<number | ''>('')
  const { error, onErr } = useApiError('Failed to load data.')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      listFriendships(),
      listPonyFriendships(),
      listPonies(),
      listHobbies(),
      listGenerations(),
    ])
      .then(([friendshipsRes, ponyFriendshipsRes, poniesRes, hobbiesRes, genRes]) => {
        setFriendships(friendshipsRes.data)
        setPonyFriendships(ponyFriendshipsRes.data)
        setPonies(poniesRes.data)
        setHobbies(hobbiesRes.data)
        setGenerations(genRes.data)
      })
      .catch(onErr)
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const ponyName = (id: number) => ponies.find((p) => p.id === id)?.name ?? id

  const ponyImage = (id: number) => ponies.find((p) => p.id === id)?.image_path ?? null

  const ponyGeneration = (id: number) => {
    const genId = ponies.find((p) => p.id === id)?.generation_id
    return genId ? (generations.find((g) => g.id === genId)?.name ?? null) : null
  }

  const friendshipPonies = (fid: number) =>
    ponyFriendships.filter((pf) => pf.friendship_id === fid)

  const handleCreate = async () => {
    if (selectedPonies.length !== 2) return
    try {
      const r = await createFriendship({ pony_ids: selectedPonies })
      setFriendships((prev) => [...prev, r.data])
      const pfs = await listPonyFriendships()
      setPonyFriendships(pfs.data)
      setSelectedPonies([])
      setCreateOpen(false)
    } catch (err) {
      onErr(err)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteFriendship(id)
      setFriendships((prev) => prev.filter((f) => f.id !== id))
      setPonyFriendships((prev) => prev.filter((pf) => pf.friendship_id !== id))
    } catch (err) {
      onErr(err)
    }
  }

  const handleAssignHobby = async () => {
    if (!hobbyOpen || !selectedHobby) return
    try {
      await assignHobbyToFriendship(hobbyOpen, { hobby_id: selectedHobby as number })
      setSelectedHobby('')
      setHobbyOpen(null)
    } catch (err) {
      onErr(err)
    }
  }

  const togglePony = (id: number) =>
    setSelectedPonies((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )

  const disabledPonies: Set<number> = (() => {
    if (selectedPonies.length !== 1) return new Set()
    const firstId = selectedPonies[0]
    const friendshipIds = ponyFriendships
      .filter((pf) => pf.pony_id === firstId)
      .map((pf) => pf.friendship_id)
    const inSharedFriendship = (pf: PonyFriendship) =>
      friendshipIds.includes(pf.friendship_id) && pf.pony_id !== firstId
    return new Set(ponyFriendships.filter(inSharedFriendship).map((pf) => pf.pony_id))
  })()
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Friendships</Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ alignSelf: 'center' }}
          disabled={loading}
          onClick={() => setCreateOpen(true)}
        >
          New Friendship
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {friendships.length === 0 && (
            <Typography color="text.secondary">No friendships yet.</Typography>
          )}
          {friendships.map((f) => (
            <FriendshipCard
              key={f.id}
              friendship={f}
              ponies={friendshipPonies(f.id)}
              ponyName={ponyName}
              ponyImage={ponyImage}
              ponyGeneration={ponyGeneration}
              onDelete={handleDelete}
              onAddHobby={setHobbyOpen}
            />
          ))}
        </Box>
      )}
      <CreateFriendshipDialog
        open={createOpen}
        ponies={ponies}
        generations={generations}
        generationFilter={generationFilter}
        onFilterChange={setGenerationFilter}
        selectedPonies={selectedPonies}
        disabledPonies={disabledPonies}
        onTogglePony={togglePony}
        onCreate={handleCreate}
        onClose={() => setCreateOpen(false)}
      />
      <AssignHobbyDialog
        open={hobbyOpen !== null}
        hobbies={hobbies}
        selectedHobby={selectedHobby}
        onSelectHobby={setSelectedHobby}
        onAssign={handleAssignHobby}
        onClose={() => setHobbyOpen(null)}
      />
    </Box>
  )
}
