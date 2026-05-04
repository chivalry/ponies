import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import {
  listHobbies,
  createHobby,
  deleteHobby,
  updateHobby,
  type Hobby,
} from '../api/hobbies'
import { useApiError } from '../hooks/useApiError'

/** Page listing all hobbies with options to create and delete them. */
export default function HobbyList() {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [open, setOpen] = useState(false)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [editTarget, setEditTarget] = useState<Hobby | null>(null)
  const [editName, setEditName] = useState('')
  const { error, onErr } = useApiError('Failed to load hobbies.')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listHobbies()
      .then((r) => setHobbies(r.data))
      .catch(onErr)
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!name) return
    try {
      const r = await createHobby({ name })
      setHobbies((prev) => [...prev, r.data])
      setName('')
      setOpen(false)
    } catch (err) {
      onErr(err)
    }
  }

  const openEdit = (h: Hobby) => {
    setEditTarget(h)
    setEditName(h.name)
  }

  const handleEdit = async () => {
    if (!editTarget || !editName.trim()) return
    try {
      const r = await updateHobby(editTarget.id, { name: editName.trim() })
      setHobbies((prev) => prev.map((h) => (h.id === r.data.id ? r.data : h)))
      setEditTarget(null)
      setEditName('')
    } catch (err) {
      onErr(err)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteHobby(id)
      setHobbies((prev) => prev.filter((h) => h.id !== id))
    } catch (err) {
      onErr(err)
    } finally {
      setConfirmId(null)
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
        <Typography variant="h4">Hobbies</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Hobby
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {hobbies.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography color="text.secondary">No hobbies yet.</Typography>
                </TableCell>
              </TableRow>
            )}
            {hobbies.map((h) => (
              <TableRow key={h.id}>
                <TableCell>{h.name}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => openEdit(h)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => setConfirmId(h.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New Hobby</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editTarget !== null} onClose={() => setEditTarget(null)}>
        <DialogTitle>Edit Hobby</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
            error={editName.trim() === ''}
            helperText={editName.trim() === '' ? 'Name is required.' : ' '}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTarget(null)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained" disabled={editName.trim() === ''}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmId !== null} onClose={() => setConfirmId(null)}>
        <DialogTitle>Delete Hobby</DialogTitle>
        <DialogContent>
          <Typography>
            {`Delete "${hobbies.find((h) => h.id === confirmId)?.name}"?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => confirmId !== null && handleDelete(confirmId)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
