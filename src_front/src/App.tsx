import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PonyList from './pages/PonyList'
import PonyDetail from './pages/PonyDetail'
import PonyForm from './pages/PonyForm'
import HobbyList from './pages/HobbyList'
import FriendshipList from './pages/FriendshipList'

const NAV_LINKS = [
  { label: 'Ponies', to: '/' },
  { label: 'Hobbies', to: '/hobbies' },
  { label: 'Friendships', to: '/friendships' },
]

/** Root application component providing the nav bar and client-side routes. */
export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()

  const handleNavClick = (to: string) => {
    navigate(to)
    setDrawerOpen(false)
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pony Tracker
          </Typography>
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <List sx={{ width: 200 }}>
                  {NAV_LINKS.map((link) => (
                    <ListItem key={link.to} disablePadding>
                      <ListItemButton onClick={() => handleNavClick(link.to)}>
                        <ListItemText primary={link.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            NAV_LINKS.map((link) => (
              <Button key={link.to} color="inherit" component={Link} to={link.to}>
                {link.label}
              </Button>
            ))
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
        <Routes>
          <Route path="/" element={<PonyList />} />
          <Route path="/ponies/new" element={<PonyForm />} />
          <Route path="/ponies/:id/edit" element={<PonyForm />} />
          <Route path="/ponies/:id" element={<PonyDetail />} />
          <Route path="/hobbies" element={<HobbyList />} />
          <Route path="/friendships" element={<FriendshipList />} />
        </Routes>
      </Box>
    </>
  )
}
