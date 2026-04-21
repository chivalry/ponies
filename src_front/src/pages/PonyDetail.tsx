import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Button, Chip, Divider, Typography } from '@mui/material'
import { getPony, type Pony } from '../api/ponies'
import { listHobbies, type Hobby } from '../api/hobbies'
import { listPonyFriendships, type PonyFriendship } from '../api/friendships'

export default function PonyDetail() {
    const { id } = useParams<{ id: string }>()
    const [pony, setPony] = useState<Pony | null>(null)
    const [hobbies, setHobbies] = useState<Hobby[]>([])
    const [friendships, setFriendships] = useState<PonyFriendship[]>([])

    useEffect(() => {
        const numId = Number(id)
        getPony(numId).then((r) => setPony(r.data))
        listHobbies().then((r) => setHobbies(r.data.filter((h) => h.pony_id === numId)))
        listPonyFriendships().then((r) =>
            setFriendships(r.data.filter((pf) => pf.pony_id === numId)),
        )
    }, [id])

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
                    <Chip key={h.id} label={h.name} />
                ))}
            </Box>
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
