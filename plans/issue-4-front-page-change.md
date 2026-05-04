# Issue #4: Front Page Change

## Context

The site currently opens to the full pony catalog (`/`), which lists all ponies across all generations in an unordered heap. The user wants: (1) the home page to be the Generations list instead, (2) the Ponies page to support filtering by generation, and (3) the Ponies page to support sorting by name A–Z, name Z–A, oldest, or newest.

The `/api/generations/<id>/ponies/` endpoint already exists and filters ponies by generation. No new backend endpoints are needed — only `list_ponies` needs sort support added.

## Changes

**4 files to edit**

### [src_front/src/App.tsx](src_front/src/App.tsx) — swap home route, move Ponies to `/ponies`

- Line 28: Change `{ label: 'Ponies', to: '/' }` → `{ label: 'Ponies', to: '/ponies' }`
- Line 31: Change `{ label: 'Generations', to: '/generations' }` → `{ label: 'Generations', to: '/' }` (or keep `/generations` and just swap which route is `/`)
- Line 85: Change `<Route path="/" element={<PonyList />} />` → `<Route path="/" element={<GenerationList />} />`
- Add: `<Route path="/ponies" element={<PonyList />} />`

Nav links after change:
```tsx
const NAV_LINKS = [
  { label: 'Ponies', to: '/ponies' },
  { label: 'Hobbies', to: '/hobbies' },
  { label: 'Friendships', to: '/friendships' },
  { label: 'Generations', to: '/' },
]
```

Routes after change:
```tsx
<Route path="/" element={<GenerationList />} />
<Route path="/ponies" element={<PonyList />} />
<Route path="/ponies/new" element={<PonyForm />} />
<Route path="/ponies/:id/edit" element={<PonyForm />} />
<Route path="/ponies/:id" element={<PonyDetail />} />
```

### [src_back/api/pony_routes.py](src_back/api/pony_routes.py) — add sort query param to `list_ponies`

Update `list_ponies` (line 23) to accept a `?sort=` query parameter:

```python
@pony_bp.route("/", methods=["GET"])
def list_ponies():
    sort = request.args.get("sort", "created_asc")
    order_map = {
        "name_asc":      Pony.name.asc(),
        "name_desc":     Pony.name.desc(),
        "created_asc":   Pony.created_timestamp.asc(),
        "created_desc":  Pony.created_timestamp.desc(),
    }
    order = order_map.get(sort, Pony.created_timestamp.asc())
    ponies = Pony.query.order_by(order).all()
    return jsonify([p.to_dict() for p in ponies])
```

Also update `list_generation_ponies` in [src_back/api/generation_routes.py](src_back/api/generation_routes.py) (line 65) the same way for consistency.

### [src_front/src/api/ponies.ts](src_front/src/api/ponies.ts) — add sort param to `listPonies`

```typescript
export type PonySort = 'name_asc' | 'name_desc' | 'created_asc' | 'created_desc'

export const listPonies = (sort?: PonySort) =>
  client.get<Pony[]>('/ponies/', { params: sort ? { sort } : undefined })
```

### [src_front/src/pages/PonyList.tsx](src_front/src/pages/PonyList.tsx) — add generation filter + sort controls

1. Add state for `generationFilter` (`number | 'all'`, default `'all'`) and `sort` (`PonySort`, default `'created_asc'`).

2. On filter/sort change, re-fetch. When `generationFilter` is `'all'`, call `listPonies(sort)`; otherwise call `listGenerationPonies(generationFilter)` (already exists in `src_front/src/api/generations.ts`). Sort for the generation-filtered call should be done client-side since that endpoint doesn't support sort params yet (or add sort support there too — see backend note above).

3. Add a controls row between the title header and the grid, using MUI `Select` components:

```tsx
<Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
  <FormControl size="small" sx={{ minWidth: 160 }}>
    <InputLabel>Generation</InputLabel>
    <Select value={generationFilter} label="Generation" onChange={...}>
      <MenuItem value="all">All Generations</MenuItem>
      {generations.map(g => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
    </Select>
  </FormControl>
  <FormControl size="small" sx={{ minWidth: 180 }}>
    <InputLabel>Sort</InputLabel>
    <Select value={sort} label="Sort" onChange={...}>
      <MenuItem value="name_asc">Name A → Z</MenuItem>
      <MenuItem value="name_desc">Name Z → A</MenuItem>
      <MenuItem value="created_asc">Oldest first</MenuItem>
      <MenuItem value="created_desc">Newest first</MenuItem>
    </Select>
  </FormControl>
</Box>
```

4. The `generations` array is already fetched in PonyList (line 31, 55) — reuse it for the generation dropdown.

5. Re-fetch ponies whenever `generationFilter` or `sort` changes using a `useEffect` that depends on both. Extract the fetch logic into a standalone function callable from both the initial `useEffect` and on filter/sort changes.

## No other changes needed

- `listGenerationPonies` in `src_front/src/api/generations.ts` already exists — reuse it for the filtered fetch.
- `GenerationList` component already exists at `src_front/src/pages/GenerationList.tsx` — just needs to be the home route.
- Pony model fields `name`, `created_timestamp` already exist in [src_back/models.py](src_back/models.py) — no migration needed.

## Verification

1. Open the app — home page should show the Generations list, not ponies.
2. Navigate to Ponies — should show all ponies with Generation and Sort dropdowns visible.
3. Select a specific generation — only ponies from that generation should appear.
4. Change sort to "Name A → Z" — ponies should reorder alphabetically.
5. Change sort to "Newest first" — ponies should reorder by `created_timestamp` descending.
6. Select "All Generations" again — all ponies return, sorted by selected sort.
7. Verify `/ponies/new`, `/ponies/:id`, and `/ponies/:id/edit` routes still work.
8. Verify existing nav links ("Hobbies", "Friendships") still work.
