import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import PonyList from './pages/PonyList'
import PonyDetail from './pages/PonyDetail'
import PonyForm from './pages/PonyForm'
import HobbyList from './pages/HobbyList'
import FriendshipList from './pages/FriendshipList'

/** Root application component providing the nav bar and client-side routes. */
export default function App() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Pony Tracker
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Ponies
                    </Button>
                    <Button color="inherit" component={Link} to="/hobbies">
                        Hobbies
                    </Button>
                    <Button color="inherit" component={Link} to="/friendships">
                        Friendships
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 3 }}>
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
// test change
