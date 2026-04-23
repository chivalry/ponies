import { useEffect, useState } from 'react'
import {
  Box,
  Button,
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
import { listHobbies, createHobby, deleteHobby, type Hobby } from '../api/hobbies'

/** Page listing all hobbies with options to create and delete them. */
export default function HobbyList() {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    listHobbies().then((r) => setHobbies(r.data))
  }, [])

  const handleCreate = async () => {
    if (!name) return
    const r = await createHobby({ name })
    setHobbies((prev) => [...prev, r.data])
    setName('')
    setOpen(false)
  }

  const handleDelete = async (id: number) => {
    await deleteHobby(id)
    setHobbies((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Hobbies</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Hobby
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {hobbies.map((h) => (
            <TableRow key={h.id}>
              <TableCell>{h.name}</TableCell>
              <TableCell>
                <Button size="small" color="error" onClick={() => handleDelete(h.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
    </Box>
  )
}
