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

interface FriendshipRowProps {
    friendship: Friendship
    ponies: PonyFriendship[]
    ponyName: (id: number) => string | number
    onDelete: (id: number) => void
    onAddHobby: (id: number) => void
}

/** Renders a single friendship row with pony chips and action buttons. */
const FriendshipRow = ({
    friendship: f,
    ponies,
    ponyName,
    onDelete,
    onAddHobby,
}: FriendshipRowProps) => (
    <TableRow key={f.id}>
        <TableCell>{f.id}</TableCell>
        <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
                {ponies.map((pf) => (
                    <Chip key={pf.id} label={ponyName(pf.pony_id)} />
                ))}
            </Box>
        </TableCell>
        <TableCell>
            <Button size="small" onClick={() => onAddHobby(f.id)}>
                Add Hobby
            </Button>
            <Button size="small" color="error" onClick={() => onDelete(f.id)}>
                Delete
            </Button>
        </TableCell>
    </TableRow>
)

interface CreateFriendshipDialogProps {
    open: boolean
    ponies: Pony[]
    selectedPonies: number[]
    onTogglePony: (id: number) => void
    onCreate: () => void
    onClose: () => void
}

/** Dialog for selecting two ponies and creating a friendship between them. */
const CreateFriendshipDialog = ({
    open,
    ponies,
    selectedPonies,
    onTogglePony,
    onCreate,
    onClose,
}: CreateFriendshipDialogProps) => (
    <Dialog open={open} onClose={onClose}>
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
                        onClick={() => onTogglePony(p.id)}
                        color={selectedPonies.includes(p.id) ? 'primary' : 'default'}
                        clickable
                    />
                ))}
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
    const togglePony = (id: number) =>
        setSelectedPonies((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        )
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
                        <FriendshipRow
                            key={f.id}
                            friendship={f}
                            ponies={friendshipPonies(f.id)}
                            ponyName={ponyName}
                            onDelete={handleDelete}
                            onAddHobby={setHobbyOpen}
                        />
                    ))}
                </TableBody>
            </Table>
            <CreateFriendshipDialog
                open={createOpen}
                ponies={ponies}
                selectedPonies={selectedPonies}
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
