# Issue #2: Hobby Editing Feature

## Context
Users currently can't edit hobby titles — they must delete and recreate. The backend PUT endpoint and frontend `updateHobby` API function already exist; only the HobbyList UI is missing the edit affordance. `GenerationList.tsx` implements the identical pattern and is the direct model to follow.

## Change

**One file to edit**: `src_front/src/pages/HobbyList.tsx`

### 1. Add `updateHobby` to the import (line 19)
```ts
import { createHobby, deleteHobby, listHobbies, updateHobby } from '../api/hobbies'
```

### 2. Add state for edit target (after the existing `confirmId` state, ~line 26)
```ts
const [editTarget, setEditTarget] = useState<Hobby | null>(null)
const [editName, setEditName] = useState('')
```

### 3. Add `openEdit` helper and `handleEdit` handler (alongside existing handlers)
```ts
const openEdit = (h: Hobby) => {
  setEditTarget(h)
  setEditName(h.name)
}

const handleEdit = async () => {
  if (!editTarget || !editName.trim()) return
  try {
    const r = await updateHobby(editTarget.id, { name: editName.trim() })
    setHobbies((prev) => prev.map((h) => (h.id === r.data.id ? r.data : h)))
    setEditTarget(null)
    setEditName('')
  } catch (err) {
    onErr(err)
  }
}
```

### 4. Add Edit button in the table row (before the existing Delete button, ~line 98)
```tsx
<Button size="small" onClick={() => openEdit(h)}>Edit</Button>
```

### 5. Add edit Dialog (after the existing create Dialog, ~line 125)
```tsx
<Dialog open={editTarget !== null} onClose={() => setEditTarget(null)}>
  <DialogTitle>Edit Hobby</DialogTitle>
  <DialogContent sx={{ pt: 1 }}>
    <TextField
      label="Name"
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
      fullWidth
      sx={{ mt: 1 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditTarget(null)}>Cancel</Button>
    <Button onClick={handleEdit} variant="contained">Save</Button>
  </DialogActions>
</Dialog>
```

## No other changes needed
- Backend: PUT `/api/hobbies/<id>/` already exists (`src_back/api/hobby_routes.py:60-78`)
- API client: `updateHobby` already exported (`src_front/src/api/hobbies.ts:24-25`)
- Propagation: automatic — join tables store hobby IDs, not names; all cards/detail pages reflect the rename on next fetch

## Verification
1. `npm run dev` → navigate to Hobbies page
2. Click Edit on any hobby → dialog opens with current name pre-filled
3. Change name → Save → table updates in place, no page reload
4. Navigate to a pony that has that hobby → confirm new name appears on the pony's card/detail page
