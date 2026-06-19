import { useMemo, useState } from 'react'
import { Alert, Box, Card, CardContent, Chip, InputAdornment, MenuItem, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { SearchRounded, StorageRounded } from '@mui/icons-material'
import { useLibrary } from '../features/library/useLibrary'
import { useUpdateLibraryStatusMutation } from '../features/games/useGames'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { GameStatus } from '../types/api'
import { gameStatusOptions, getGameStatusLabel } from '../utils/gameStatus'
import { formatCurrency, formatRating } from '../utils/format'

export const LibraryPage = () => {
  const libraryQuery = useLibrary()
  const updateStatusMutation = useUpdateLibraryStatusMutation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const filteredItems = useMemo(() => {
    const items = libraryQuery.data ?? []

    return items.filter((item) => {
      const matchesSearch =
        !debouncedSearch ||
        item.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesStatus = statusFilter === '' || String(item.status) === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [debouncedSearch, libraryQuery.data, statusFilter])

  return (
    <Stack spacing={3.5}>
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          background:
            'linear-gradient(135deg, rgba(19, 35, 52, 0.98) 0%, rgba(10, 16, 25, 0.98) 60%, rgba(8, 12, 18, 0.98) 100%)',
          border: '1px solid rgba(102, 192, 244, 0.12)',
        }}
      >
        <Stack spacing={1.5}>
          <Typography variant="h2" component="h1">
            Your Library
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse owned games, search your collection, and update the backend-owned status for any title.
          </Typography>
        </Stack>
      </Box>

      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.08)',
          background:
            'linear-gradient(180deg, rgba(16, 24, 36, 0.98) 0%, rgba(9, 13, 20, 0.98) 100%)',
        }}
      >
        <CardContent>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Search library"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRounded />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">All statuses</MenuItem>
                {gameStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {libraryQuery.isError ? <Alert severity="error">Unable to load the library from the backend.</Alert> : null}

            {libraryQuery.isLoading ? (
              <Stack spacing={2}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" height={140} />
                ))}
              </Stack>
            ) : filteredItems.length ? (
              <Stack spacing={2.5}>
                {filteredItems.map((item) => (
                  <Box key={item.gameId ?? item.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'grid', gap: 2.5, alignItems: 'center', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.8fr) minmax(0, 1.7fr) minmax(280px, 1fr)' } }}>
                          <Box>
                            <Box
                              component="img"
                              src={item.imageUrl}
                              alt={item.title}
                              sx={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 2 }}
                            />
                          </Box>
                          <Box>
                            <Stack spacing={1}>
                              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {item.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.description}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                <Chip label={item.categoryName ?? 'Category'} size="small" />
                                <Chip label={getGameStatusLabel(item.status)} size="small" variant="outlined" />
                                <Chip label={formatRating(item.rating ?? 0)} size="small" variant="outlined" />
                                <Chip label={formatCurrency(item.price ?? 0)} size="small" variant="outlined" />
                              </Stack>
                            </Stack>
                          </Box>
                          <Box>
                            <Stack spacing={1.5}>
                              <TextField
                                select
                                label="Update status"
                                defaultValue={item.status}
                                onChange={async (event) => {
                                  await updateStatusMutation.mutateAsync({
                                    gameId: item.gameId ?? item.id ?? 0,
                                    status: Number(event.target.value) as GameStatus,
                                  })
                                }}
                              >
                                {gameStatusOptions.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <Typography variant="caption" color="text.secondary">
                                Status changes are saved through the backend PATCH endpoint.
                              </Typography>
                            </Stack>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: 'center',
                  border: '1px dashed rgba(255,255,255,0.14)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
              >
                <StorageRounded sx={{ fontSize: 42, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mt: 1.5 }}>
                  No matching library items
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Your library is empty or the current filters removed all results.
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
