import { useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Chip, InputAdornment, MenuItem, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { SearchRounded, LocalFireDepartmentRounded, SportsEsportsRounded } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { GameCard } from '../components/ui/GameCard'
import { PageState } from '../components/ui/PageState'
import { StatCard } from '../components/ui/StatCard'
import { useCategories } from '../features/categories/useCategories'
import { useDashboardSummary } from '../features/store/useStore'
import { useGames } from '../features/games/useGames'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { formatCurrency, formatNumber } from '../utils/format'

const sortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
]

export const StorePage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [sortBy, setSortBy] = useState('title')
  const debouncedSearch = useDebouncedValue(search, 350)

  const categoriesQuery = useCategories()
  const dashboardQuery = useDashboardSummary()
  const gamesQuery = useGames({
    search: debouncedSearch,
    categoryId: categoryId === '' ? null : categoryId,
    sortBy,
  })

  const categoryOptions = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data])

  return (
    <Stack spacing={3.5}>
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, rgba(19, 35, 52, 0.98) 0%, rgba(10, 16, 25, 0.98) 55%, rgba(8, 12, 18, 0.98) 100%)',
          border: '1px solid rgba(102, 192, 244, 0.12)',
        }}
      >
        <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1, maxWidth: 840 }}>
          <Typography variant="h2" component="h1">
            Discover, buy, and manage games from your Steam-style catalog.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
            Search the store, filter by category, sort the catalog, and jump into the game details page.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<SportsEsportsRounded />} onClick={() => navigate('/games/create')}>
              Add game
            </Button>
            <Button variant="outlined" startIcon={<LocalFireDepartmentRounded />} onClick={() => navigate('/library')}>
              Open library
            </Button>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
        <Box>
          <StatCard
            label="Owned games"
            value={dashboardQuery.data ? formatNumber(dashboardQuery.data.ownedGames) : '0'}
          />
        </Box>
        <Box>
          <StatCard
            label="Completed"
            value={dashboardQuery.data ? formatNumber(dashboardQuery.data.completedGames) : '0'}
            subtitle="Progress tracked by the library"
          />
        </Box>
        <Box>
          <StatCard
            label="Total spent"
            value={dashboardQuery.data ? formatCurrency(dashboardQuery.data.totalSpent) : '$0'}
            subtitle="Live totals calculated by store"
          />
        </Box>
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
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' } }}>
              <TextField
                fullWidth
                label="Search games"
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
                label="Category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value === '' ? '' : Number(event.target.value))}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">All categories</MenuItem>
                {categoryOptions.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Sort by"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                sx={{ minWidth: 180 }}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }} gutterBottom>
                Featured catalog
              </Typography>
            </Box>

            {gamesQuery.isError ? (
              <Alert severity="error">Unable to load games. Check the ASP.NET Core API connection and try again.</Alert>
            ) : null}

            {gamesQuery.isLoading ? (
              <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' } }}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Box key={index}>
                    <Skeleton variant="rounded" height={360} />
                  </Box>
                ))}
              </Box>
            ) : gamesQuery.data?.length ? (
              <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' } }}>
                {gamesQuery.data.map((game) => (
                  <Box key={game.id}>
                    <GameCard game={game} />
                  </Box>
                ))}
              </Box>
            ) : (
              <PageState
                title="No games found"
                description="Try another search term, clear the category filter, or create a new game in the backend-backed form."
                actionLabel="Add a game"
                onAction={() => navigate('/games/create')}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
