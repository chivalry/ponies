import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { listHobbies, createHobby, deleteHobby, type Hobby } from '../api/hobbies'
import { listPonies, type Pony } from '../api/ponies'

export default function HobbyList() {
    const [hobbies, setHobbies] = useState<Hobby[]>([])
    const [ponies, setPonies] = useState<Pony[]>([])
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [ponyId, setPonyId] = useState<number | ''>('')

    useEffect(() => {
        listHobbies().then((r) => setHobbies(r.data))
        listPonies().then((r) => setPonies(r.data))
    }, [])

    const handleCreate = async () => {
        if (!name || !ponyId) return
        const r = await createHobby({ name, pony_id: ponyId as number })
        setHobbies((prev) => [...prev, r.data])
        setName('')
        setPonyId('')
        setOpen(false)
    }

    const handleDelete = async (id: number) => {
        await deleteHobby(id)
        setHobbies((prev) => prev.filter((h) => h.id !== id))
    }

    const ponyName = (id: number) => ponies.find((p) => p.id === id)?.name ?? id

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
                        <TableCell>Pony</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hobbies.map((h) => (
                        <TableRow key={h.id}>
                            <TableCell>{h.name}</TableCell>
                            <TableCell>{ponyName(h.pony_id)}</TableCell>
                            <TableCell>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(h.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New Hobby</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
                >
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />
                    <Select
                        value={ponyId}
                        onChange={(e) => setPonyId(e.target.value as number)}
                        displayEmpty
                        fullWidth
                    >
                        <MenuItem value="">Select pony…</MenuItem>
                        {ponies.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </Select>
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
