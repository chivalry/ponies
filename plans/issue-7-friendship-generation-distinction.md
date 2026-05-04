# Issue #7: Friendships Need Generation Distinction

## Context
Ponies share names across generations (e.g., G3 and G4 Rainbow Dash), making the friendship creation dialog ambiguous — users can't tell which Rainbow Dash they're selecting. This change adds generation labels to pony chips in both the creation dialog and the friendship cards, plus a generation filter dropdown in the creation dialog so users can narrow their selection to one generation at a time.

## Change

**1 file to edit**: `src_front/src/pages/FriendshipList.tsx`

### FriendshipList.tsx — 4 targeted changes

#### 1. Add imports (lines 18–31)
Add `listGenerations` and `type Generation` to the existing generations import (currently the file doesn't import from generations at all):
```ts
import { listGenerations, type Generation } from '../api/generations'
```
Also add `FormControl`, `InputLabel` to the MUI imports (already has `Select`, `MenuItem`).

#### 2. Thread generations through `CreateFriendshipDialog` (lines 84–134)
- Add `generations: Generation[]` and `generationFilter: number | 'all'` and `onFilterChange` to `CreateFriendshipDialogProps`
- Inside the dialog, render a generation filter `Select` above the pony chips (mirror PonyList lines 133–151):
  ```tsx
  <FormControl size="small" sx={{ minWidth: 160, mb: 1 }}>
    <InputLabel>Generation</InputLabel>
    <Select value={generationFilter} label="Generation"
      onChange={(e) => onFilterChange(e.target.value as number | 'all')}>
      <MenuItem value="all">All Generations</MenuItem>
      {generations.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
    </Select>
  </FormControl>
  ```
- Filter the displayed ponies to only those matching `generationFilter` (or all if `'all'`)
- Change the chip label from `p.name` (line 114) to include generation:
  ```tsx
  label={`${p.name}${genName ? ` (${genName})` : ''}`}
  ```
  where `genName` is looked up from `generations.find(g => g.id === p.generation_id)?.name`.

#### 3. Add generation label to `FriendshipCard` (lines 50–70)
The card shows pony name chips. Add a small generation chip below each name chip, mirroring the PonyCard pattern (PonyCard.tsx lines 92–100):
```tsx
{ponyGeneration(pf.pony_id) && (
  <Chip
    label={ponyGeneration(pf.pony_id)}
    size="small"
    color="secondary"
  />
)}
```
This requires adding a `ponyGeneration: (id: number) => string | null` prop (follow the existing `ponyName`/`ponyImage` helper function pattern at lines 206–208).

#### 4. Load generations and wire state in `FriendshipList` (lines 182–323)
- Add `generations` state: `const [generations, setGenerations] = useState<Generation[]>([])`
- Add `generationFilter` state: `const [generationFilter, setGenerationFilter] = useState<number | 'all'>('all')`
- Extend the `Promise.all` at line 195 to include `listGenerations()`, setting `generations` state
- Add `ponyGeneration` helper (after line 208):
  ```ts
  const ponyGeneration = (id: number) => {
    const genId = ponies.find((p) => p.id === id)?.generation_id
    return genId ? (generations.find((g) => g.id === genId)?.name ?? null) : null
  }
  ```
- Pass `generations`, `generationFilter`, `onFilterChange={setGenerationFilter}` to `CreateFriendshipDialog`
- Pass `ponyGeneration` to `FriendshipCard`

## No other changes needed
- Backend already returns `generation_id` on each `Pony` object (models.py lines 53–60, ponies.ts line 7)
- `listGenerations()` API client already exists (generations.ts line 12)
- `listGenerationPonies()` is NOT needed here — load all ponies once and filter client-side (simpler, consistent with existing pattern)
- No backend changes required

## Verification
1. Start dev server (`npm run dev` in `src_front/`)
2. Navigate to Friendships page
3. Click "New Friendship" — confirm generation filter dropdown appears
4. Select a specific generation — confirm only ponies from that generation are shown
5. Select "All Generations" — confirm all ponies appear with generation labels in parentheses (e.g., "Rainbow Dash (G4)")
6. Create a friendship — confirm the card shows a secondary-colored generation chip under each pony name
7. Confirm ponies without a generation assigned show name only (no empty parentheses, no extra chip)
