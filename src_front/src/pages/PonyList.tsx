import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material'
import { listPonies, deletePony, type Pony } from '../api/ponies'

export default function PonyList() {
  const [ponies, setPonies] = useState<Pony[]>([])

  useEffect(() => {
    listPonies().then((r) => setPonies(r.data))
  }, [])

  const handleDelete = async (id: number) => {
    await deletePony(id)
    setPonies((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant='h4'>Ponies</Typography>
        <Button variant='contained' component={Link} to='/ponies/new'>
          Add Pony
        </Button>
      </Box>
      <Grid container spacing={2}>
        {ponies.map((pony) => (
          <Grid item xs={12} sm={6} md={4} key={pony.id}>
            <Card>
              {pony.image_path && (
                <CardMedia
                  component='img'
                  height='160'
                  image={`/${pony.image_path}`}
                  alt={pony.name}
                />
              )}
              <CardContent>
                <Typography variant='h6'>{pony.name}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    size='small'
                    component={Link}
                    to={`/ponies/${pony.id}`}
                  >
                    View
                  </Button>
                  <Button
                    size='small'
                    component={Link}
                    to={`/ponies/${pony.id}/edit`}
                  >
                    Edit
                  </Button>
                  <Button
                    size='small'
                    color='error'
                    onClick={() => handleDelete(pony.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
