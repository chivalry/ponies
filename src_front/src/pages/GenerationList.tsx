import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  listGenerations,
  createGeneration,
  updateGeneration,
  deleteGeneration,
  type Generation,
} from '../api/generations'
import { useApiError } from '../hooks/useApiError'

/** Page listing all generations with options to create, edit, and delete them. */
export default function GenerationList() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Generation | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const { error, onErr } = useApiError('Failed to load generations.')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    listGenerations()
      .then((r) => setGenerations(r.data))
      .catch(onErr)
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async () => {
    if (!name.trim()) return
    try {
      const r = await createGeneration({ name: name.trim() })
      setGenerations((prev) => [...prev, r.data])
      setName('')
      setCreateOpen(false)
    } catch (err) {
      onErr(err)
    }
  }

  const handleEdit = async () => {
    if (!editTarget || !name.trim()) return
    try {
      const r = await updateGeneration(editTarget.id, { name: name.trim() })
      setGenerations((prev) => prev.map((g) => (g.id === r.data.id ? r.data : g)))
      setEditTarget(null)
      setName('')
    } catch (err) {
      onErr(err)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteGeneration(id)
      setGenerations((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      onErr(err)
    } finally {
      setConfirmId(null)
    }
  }

  const openEdit = (g: Generation) => {
    setEditTarget(g)
    setName(g.name)
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Generations</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setName('')
            setCreateOpen(true)
          }}
        >
          Add Generation
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
            {generations.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography color="text.secondary">No generations yet.</Typography>
                </TableCell>
              </TableRow>
            )}
            {generations.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <Button variant="text" onClick={() => navigate(`/generations/${g.id}`)}>
                    {g.name}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button size="small" onClick={() => openEdit(g)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => setConfirmId(g.id)}>
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>New Generation</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editTarget !== null} onClose={() => setEditTarget(null)}>
        <DialogTitle>Edit Generation</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTarget(null)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmId !== null} onClose={() => setConfirmId(null)}>
        <DialogTitle>Delete Generation</DialogTitle>
        <DialogContent>
          <Typography>
            {`Delete "${generations.find((g) => g.id === confirmId)?.name}"?`}
            {' Ponies in this generation will be unassigned.'}
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
