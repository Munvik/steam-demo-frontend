import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fade, InputAdornment, MenuItem, Skeleton, Stack, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import { AutorenewRounded, CheckCircleRounded, HourglassBottomRounded, LocalFireDepartmentRounded, SearchRounded, SportsEsportsRounded } from '@mui/icons-material'
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

const publishingSteps = [
  'Building...',
  'Packaging...',
  'Uploading assets...',
  'Publishing...',
  'Completed',
]

type PublishingPhase = 'verification' | 'wizard' | 'review'

export const StorePage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [sortBy, setSortBy] = useState('title')
  const [isPublishingDialogOpen, setIsPublishingDialogOpen] = useState(false)
  const [publishingPhase, setPublishingPhase] = useState<PublishingPhase>('verification')
  const [isRollingVerification, setIsRollingVerification] = useState(false)
  const [verificationRollValue, setVerificationRollValue] = useState(1)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [completedWizardStep, setCompletedWizardStep] = useState(-1)

  const rollingIntervalRef = useRef<number | null>(null)
  const flowTimeoutsRef = useRef<number[]>([])

  const debouncedSearch = useDebouncedValue(search, 350)

  const categoriesQuery = useCategories()
  const dashboardQuery = useDashboardSummary()
  const gamesQuery = useGames({
    search: debouncedSearch,
    categoryId: categoryId === '' ? null : categoryId,
    sortBy,
  })

  const categoryOptions = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data])

  const clearFlowTimers = () => {
    if (rollingIntervalRef.current !== null) {
      window.clearInterval(rollingIntervalRef.current)
      rollingIntervalRef.current = null
    }

    flowTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    flowTimeoutsRef.current = []
  }

  const resetPublishingFlow = () => {
    clearFlowTimers()
    setPublishingPhase('verification')
    setIsRollingVerification(false)
    setVerificationRollValue(1)
    setVerificationSuccess(false)
    setCompletedWizardStep(-1)
  }

  const openPublishingDialog = () => {
    resetPublishingFlow()
    setIsPublishingDialogOpen(true)
  }

  const closePublishingDialog = () => {
    setIsPublishingDialogOpen(false)
    resetPublishingFlow()
  }

  const startPublishingWizard = () => {
    setPublishingPhase('wizard')
    setCompletedWizardStep(-1)

    const runStep = (stepIndex: number) => {
      if (stepIndex >= publishingSteps.length) {
        const reviewTimeout = window.setTimeout(() => {
          setPublishingPhase('review')
        }, 1000)

        flowTimeoutsRef.current.push(reviewTimeout)
        return
      }

      const stepDelay = 700 + Math.floor(Math.random() * 301)

      const stepTimeout = window.setTimeout(() => {
        setCompletedWizardStep(stepIndex)
        runStep(stepIndex + 1)
      }, stepDelay)

      flowTimeoutsRef.current.push(stepTimeout)
    }

    runStep(0)
  }

  const handleRollVerification = () => {
    if (isRollingVerification) {
      return
    }

    clearFlowTimers()
    setVerificationSuccess(false)
    setIsRollingVerification(true)

    rollingIntervalRef.current = window.setInterval(() => {
      setVerificationRollValue(1 + Math.floor(Math.random() * 6))
    }, 90)

    const rollDuration = 2200 + Math.floor(Math.random() * 801)

    const stopRollTimeout = window.setTimeout(() => {
      if (rollingIntervalRef.current !== null) {
        window.clearInterval(rollingIntervalRef.current)
        rollingIntervalRef.current = null
      }

      setVerificationRollValue(6)
      setIsRollingVerification(false)
      setVerificationSuccess(true)

      const transitionTimeout = window.setTimeout(() => {
        startPublishingWizard()
      }, 900)

      flowTimeoutsRef.current.push(transitionTimeout)
    }, rollDuration)

    flowTimeoutsRef.current.push(stopRollTimeout)
  }

  useEffect(() => () => clearFlowTimers(), [])

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
            <Button variant="contained" startIcon={<SportsEsportsRounded />} onClick={openPublishingDialog}>
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
                onAction={openPublishingDialog}
              />
            )}
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={isPublishingDialogOpen}
        onClose={closePublishingDialog}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              border: '1px solid rgba(102, 192, 244, 0.24)',
              background:
                'linear-gradient(160deg, rgba(21, 32, 47, 0.98) 0%, rgba(12, 18, 28, 0.98) 55%, rgba(8, 12, 19, 0.98) 100%)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {publishingPhase === 'verification' ? 'Steam Publisher Verification' : null}
          {publishingPhase === 'wizard' ? 'Steam Publishing Wizard' : null}
          {publishingPhase === 'review' ? '⚠ Community Feedback' : null}
        </DialogTitle>

        <DialogContent>
          {publishingPhase === 'verification' ? (
            <Stack spacing={2.25} sx={{ py: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Press the roll button to request Steam Publisher verification.
              </Typography>

              <Box
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(102, 192, 244, 0.24)',
                  backgroundColor: 'rgba(102, 192, 244, 0.07)',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    minWidth: 80,
                    textAlign: 'center',
                    color: '#8fd7ff',
                    transform: isRollingVerification ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 120ms ease-out',
                  }}
                >
                  {verificationRollValue}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleRollVerification}
                disabled={isRollingVerification || verificationSuccess}
              >
                Roll Steam Publisher Verification
              </Button>

              {verificationSuccess ? (
                <Fade in timeout={380}>
                  <Alert severity="success" icon={<CheckCircleRounded />}>
                    Steam Publisher Verification Successful
                  </Alert>
                </Fade>
              ) : null}
            </Stack>
          ) : null}

          {publishingPhase === 'wizard' ? (
            <Stack spacing={2.2} sx={{ py: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Initializing Steam-style partner pipeline...
              </Typography>

              <Stepper orientation="vertical" activeStep={Math.max(completedWizardStep + 1, 0)}>
                {publishingSteps.map((step, index) => (
                  <Step key={step} completed={index <= completedWizardStep}>
                    <StepLabel
                      icon={
                        index <= completedWizardStep ? (
                          <CheckCircleRounded sx={{ color: '#4caf50' }} />
                        ) : index === completedWizardStep + 1 ? (
                          <AutorenewRounded sx={{ color: '#8fd7ff' }} />
                        ) : (
                          <HourglassBottomRounded sx={{ color: 'rgba(255,255,255,0.45)' }} />
                        )
                      }
                    >
                      <Fade in={index <= completedWizardStep + 1} timeout={420 + index * 70}>
                        <Typography variant="body1">{step}</Typography>
                      </Fade>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Stack>
          ) : null}

          {publishingPhase === 'review' ? (
            <Stack spacing={2.2} sx={{ py: 1 }}>
              <Box
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.10)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  p: 2.2,
                }}
              >
                <Stack spacing={1.4}>
                  <Typography variant="overline" color="text.secondary">
                    Steam Partner Program simulation
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Potential wishlists:
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#8fd7ff' }}>
                    3
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Potential refunds:
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#ff8e72' }}>
                    428
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Recommendation:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Maybe cook a little longer.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    [Back to Store]
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          ) : null}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.4, pt: 0.2 }}>
          {publishingPhase === 'review' ? (
            <Button variant="contained" onClick={closePublishingDialog}>
              Return to Store
            </Button>
          ) : (
            <Button variant="text" onClick={closePublishingDialog}>
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
