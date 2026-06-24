import { useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Chip, Skeleton, Snackbar, Stack, Typography } from '@mui/material'
import { CheckCircleRounded, ShoppingCartRounded, StarRounded } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useBuyGameMutation, useGame } from '../features/games/useGames'
import { formatCurrency, formatRating } from '../utils/format'

export const GameDetailsPage = () => {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()
  const gameId = Number(params.id)
  const gameQuery = useGame(gameId)
  const buyMutation = useBuyGameMutation()
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const game = gameQuery.data
  const purchaseSuccess = useMemo(() => buyMutation.isSuccess, [buyMutation.isSuccess])

  return (
    <Stack spacing={3.5}>
      {gameQuery.isError ? (
        <Alert severity="error">Unable to load the game details. The server may be unavailable.</Alert>
      ) : null}

      {gameQuery.isLoading || !game ? (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(320px, 0.8fr)' } }}>
          <Box>
            <Skeleton variant="rounded" height={520} />
          </Box>
          <Box>
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={72} />
              <Skeleton variant="rounded" height={220} />
            </Stack>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(320px, 0.8fr)' } }}>
          <Box>
            <Card
              sx={{
                overflow: 'hidden',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.08)',
                background:
                  'linear-gradient(180deg, rgba(15, 24, 36, 0.98) 0%, rgba(9, 13, 20, 0.98) 100%)',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={game.imageUrl}
                  alt={game.title}
                  sx={{ width: '100%', height: { xs: 280, md: 500 }, objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.00) 40%, rgba(6,10,15,0.94) 100%)',
                  }}
                />
              </Box>
            </Card>
          </Box>

          <Box>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.08)',
                background:
                  'linear-gradient(180deg, rgba(15, 24, 36, 0.98) 0%, rgba(9, 13, 20, 0.98) 100%)',
              }}
            >
              <CardContent>
                <Stack spacing={2.5}>
                  <Stack spacing={1}>
                    <Typography variant="h3" component="h1">
                      {game.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {game.description}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                    <Chip icon={<StarRounded />} label={formatRating(game.rating)} />
                    <Chip label={`${game.categoryName}`} variant="outlined" />
                  </Stack>

                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      border: '1px solid rgba(102, 192, 244, 0.18)',
                      backgroundColor: 'rgba(102, 192, 244, 0.06)',
                    }}
                  >
                    <Typography variant="overline" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {formatCurrency(game.price)}
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCartRounded />}
                      onClick={async () => {
                        await buyMutation.mutateAsync(game.id)
                        setSnackbarOpen(true)
                      }}
                      disabled={buyMutation.isPending}
                      fullWidth
                    >
                      Buy game
                    </Button>
                    <Button variant="outlined" size="large" onClick={() => navigate('/')} fullWidth>
                      Back to store
                    </Button>
                  </Stack>

                  {purchaseSuccess ? (
                    <Alert severity="success" icon={<CheckCircleRounded />}>
                      Purchase completed. The library will refresh automatically.
                    </Alert>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Purchase request submitted"
      />
    </Stack>
  )
}
