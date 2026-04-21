import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Button, Chip, Divider, MenuItem, Select, Typography } from '@mui/material'
import { getPony, type Pony } from '../api/ponies'
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

export default function PonyDetail() {
    const { id } = useParams<{ id: string }>()
    const [pony, setPony] = useState<Pony | null>(null)
    const [hobbies, setHobbies] = useState<Hobby[]>([])
    const [ponyHobbies, setPonyHobbies] = useState<PonyHobby[]>([])
    const [allHobbies, setAllHobbies] = useState<Hobby[]>([])
    const [selectedHobbyId, setSelectedHobbyId] = useState<number | ''>('')
    const [friendships, setFriendships] = useState<PonyFriendship[]>([])

    const numId = Number(id)

    const refreshHobbyState = () => {
        Promise.all([
            listPonyHobbies(numId),
            listPonyHobbyAssignments(numId),
            listHobbies(),
        ]).then(([ponyHobbiesRes, assignmentsRes, allRes]) => {
            const assigned = new Set(ponyHobbiesRes.data.map((h) => h.id))
            setHobbies(ponyHobbiesRes.data)
            setPonyHobbies(assignmentsRes.data)
            setAllHobbies(allRes.data.filter((h) => !assigned.has(h.id)))
        })
    }

    useEffect(() => {
        getPony(numId).then((r) => setPony(r.data))
        refreshHobbyState()
        listPonyFriendships().then((r) =>
            setFriendships(r.data.filter((pf) => pf.pony_id === numId)),
        )
    }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleAssign = async () => {
        if (!selectedHobbyId) return
        await assignHobbyToPony(numId, selectedHobbyId as number)
        setSelectedHobbyId('')
        refreshHobbyState()
    }

    const handleUnassign = async (hobbyId: number) => {
        const ph = ponyHobbies.find((p) => p.hobby_id === hobbyId)
        if (!ph) return
        await unassignHobbyFromPony(ph.id)
        refreshHobbyState()
    }

    if (!pony) return <Typography>Loading…</Typography>

    return (
        <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
                {pony.name}
            </Typography>
            {pony.image_path && (
                <Box
                    component="img"
                    src={`/${pony.image_path}`}
                    alt={pony.name}
                    sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', mb: 2 }}
                />
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Hobbies</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
                {hobbies.length === 0 && <Typography>No hobbies yet.</Typography>}
                {hobbies.map((h) => (
                    <Chip
                        key={h.id}
                        label={h.name}
                        onDelete={() => handleUnassign(h.id)}
                    />
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
            <Typography variant="h6">Friendships</Typography>
            <Box sx={{ my: 1 }}>
                {friendships.length === 0 && <Typography>No friendships yet.</Typography>}
                {friendships.map((pf) => (
                    <Typography key={pf.id}>Friendship #{pf.friendship_id}</Typography>
                ))}
            </Box>
            <Box sx={{ mt: 2 }}>
                <Button component={Link} to={`/ponies/${id}/edit`} variant="outlined">
                    Edit
                </Button>
            </Box>
        </Box>
    )
}
