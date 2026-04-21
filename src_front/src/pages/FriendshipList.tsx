import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Chip,
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
import { listHobbies, type Hobby } from '../api/hobbies'

export default function FriendshipList() {
    const [friendships, setFriendships] = useState<Friendship[]>([])
    const [ponyFriendships, setPonyFriendships] = useState<PonyFriendship[]>([])
    const [ponies, setPonies] = useState<Pony[]>([])
    const [hobbies, setHobbies] = useState<Hobby[]>([])
    const [createOpen, setCreateOpen] = useState(false)
    const [hobbyOpen, setHobbyOpen] = useState<number | null>(null)
    const [selectedPonies, setSelectedPonies] = useState<number[]>([])
    const [selectedHobby, setSelectedHobby] = useState<number | ''>('')

    useEffect(() => {
        listFriendships().then((r) => setFriendships(r.data))
        listPonyFriendships().then((r) => setPonyFriendships(r.data))
        listPonies().then((r) => setPonies(r.data))
        listHobbies().then((r) => setHobbies(r.data))
    }, [])

    const ponyName = (id: number) => ponies.find((p) => p.id === id)?.name ?? id

    const friendshipPonies = (fid: number) =>
        ponyFriendships.filter((pf) => pf.friendship_id === fid)

    const handleCreate = async () => {
        if (selectedPonies.length !== 2) return
        const r = await createFriendship({ pony_ids: selectedPonies })
        setFriendships((prev) => [...prev, r.data])
        const pfs = await listPonyFriendships()
        setPonyFriendships(pfs.data)
        setSelectedPonies([])
        setCreateOpen(false)
    }

    const handleDelete = async (id: number) => {
        await deleteFriendship(id)
        setFriendships((prev) => prev.filter((f) => f.id !== id))
        setPonyFriendships((prev) => prev.filter((pf) => pf.friendship_id !== id))
    }

    const handleAssignHobby = async () => {
        if (!hobbyOpen || !selectedHobby) return
        await assignHobbyToFriendship(hobbyOpen, { hobby_id: selectedHobby as number })
        setSelectedHobby('')
        setHobbyOpen(null)
    }

    const togglePony = (id: number) => {
        setSelectedPonies((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        )
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Friendships</Typography>
                <Button variant="contained" onClick={() => setCreateOpen(true)}>
                    New Friendship
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Ponies</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {friendships.map((f) => (
                        <TableRow key={f.id}>
                            <TableCell>{f.id}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {friendshipPonies(f.id).map((pf) => (
                                        <Chip key={pf.id} label={ponyName(pf.pony_id)} />
                                    ))}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => setHobbyOpen(f.id)}>
                                    Add Hobby
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(f.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Create friendship dialog */}
            <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
                <DialogTitle>New Friendship</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Select exactly 2 ponies:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {ponies.map((p) => (
                            <Chip
                                key={p.id}
                                label={p.name}
                                onClick={() => togglePony(p.id)}
                                color={
                                    selectedPonies.includes(p.id) ? 'primary' : 'default'
                                }
                                clickable
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        disabled={selectedPonies.length !== 2}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Assign hobby dialog */}
            <Dialog open={hobbyOpen !== null} onClose={() => setHobbyOpen(null)}>
                <DialogTitle>Assign Hobby to Friendship</DialogTitle>
                <DialogContent>
                    <Select
                        value={selectedHobby}
                        onChange={(e) => setSelectedHobby(e.target.value as number)}
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
                    <Button onClick={() => setHobbyOpen(null)}>Cancel</Button>
                    <Button onClick={handleAssignHobby} variant="contained">
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
