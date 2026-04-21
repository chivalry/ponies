import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Grid, Typography } from '@mui/material'

import { listPonies, deletePony, type Pony } from '../api/ponies'
import { PonyCard } from '../components/PonyCard'

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
            <PonyCard pony={pony} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
