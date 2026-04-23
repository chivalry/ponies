import { Link } from 'react-router-dom'
import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material'
import type { Pony } from '../api/ponies'
import type { PonyFriendship, FriendshipHobby } from '../api/friendships'
import type { Hobby } from '../api/hobbies'
import { CircularImage } from './CircularImage'

interface Props {
  pony: Pony
  ponies: Pony[]
  ponyFriendships: PonyFriendship[]
  friendshipHobbies: FriendshipHobby[]
  hobbies: Hobby[]
  ponyHobbies: Hobby[]
  onDelete: (id: number) => void
}

/**
 * Displays a pony card with circular image on the left and details on the right.
 * @param pony - The pony to display.
 * @param ponies - All ponies, used to look up friend names and images.
 * @param ponyFriendships - All pony-friendship join records.
 * @param friendshipHobbies - All friendship-hobby join records.
 * @param hobbies - All hobbies, used to look up hobby names for friendships.
 * @param ponyHobbies - Hobbies belonging to this pony.
 * @param onDelete - Callback invoked with the pony's id when Delete is clicked.
 */
export const PonyCard = ({
  pony,
  ponies,
  ponyFriendships,
  friendshipHobbies,
  hobbies,
  ponyHobbies,
  onDelete,
}: Props) => {
  const myFriendshipIds = ponyFriendships
    .filter((pf) => pf.pony_id === pony.id)
    .map((pf) => pf.friendship_id)

  const friendPonyIds = ponyFriendships
    .filter((pf) => {
      const isFriend = myFriendshipIds.includes(pf.friendship_id)
      return isFriend && pf.pony_id !== pony.id
    })
    .map((pf) => pf.pony_id)
  const friends = friendPonyIds
    .map((id) => ponies.find((p) => p.id === id))
    .filter((p): p is Pony => p !== undefined)

  const friendshipHobbyNames = friendshipHobbies
    .filter((fh) => myFriendshipIds.includes(fh.friendship_id))
    .map((fh) => hobbies.find((h) => h.id === fh.hobby_id)?.name)
    .filter((n): n is string => n !== undefined)

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {pony.image_path && (
            <Box sx={{ flexShrink: 0 }}>
              <CircularImage src={`/${pony.image_path}`} alt={pony.name} size={160} />
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {pony.name}
            </Typography>

            {ponyHobbies.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Hobbies
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {ponyHobbies.map((h) => (
                    <Chip key={h.id} label={h.name} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {friends.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Friends
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                  {friends.map((friend) => (
                    <Box
                      key={friend.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      {friend.image_path && (
                        <CircularImage
                          src={`/${friend.image_path}`}
                          alt={friend.name}
                          size={48}
                        />
                      )}
                      <Typography variant="caption">{friend.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {friendshipHobbyNames.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Friendship hobbies
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    flexWrap: 'wrap',
                    mt: 0.5,
                  }}
                >
                  {friendshipHobbyNames.map((name) => (
                    <Chip key={name} label={name} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

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
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
