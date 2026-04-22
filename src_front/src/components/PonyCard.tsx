import { Link } from 'react-router-dom'
import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material'
import type { Pony } from '../api/ponies'

interface Props {
    pony: Pony
    onDelete: (id: number) => void
}

/**
 * Displays a pony's image and name with View, Edit, and Delete actions.
 * @param pony - The pony to display.
 * @param onDelete - Callback invoked with the pony's id when Delete is clicked.
 */
export const PonyCard = ({ pony, onDelete }: Props) => (
    <Card>
        {pony.image_path && (
            <CardMedia
                component="img"
                height="160"
                image={`/${pony.image_path}`}
                alt={pony.name}
            />
        )}
        <CardContent>
            <Typography variant="h6">{pony.name}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button size="small" component={Link} to={`/ponies/${pony.id}`}>
                    View
                </Button>
                <Button size="small" component={Link} to={`/ponies/${pony.id}/edit`}>
                    Edit
                </Button>
                <Button size="small" color="error" onClick={() => onDelete(pony.id)}>
                    Delete
                </Button>
            </Box>
        </CardContent>
    </Card>
)
