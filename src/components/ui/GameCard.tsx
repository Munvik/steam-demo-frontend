import { Card, CardActions, CardContent, CardMedia, Chip, Stack, Typography, Button, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { GameDto } from '../../types/api'
import { formatCurrency, formatRating } from '../../utils/format'

interface GameCardProps {
  game: GameDto
  actionLabel?: string
  onAction?: () => void
  loading?: boolean
}

export const GameCard = ({ game, actionLabel = 'View details', onAction, loading = false }: GameCardProps) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      background:
        'linear-gradient(180deg, rgba(18, 29, 43, 0.98) 0%, rgba(8, 12, 18, 0.98) 100%)',
    }}
  >
    <Box sx={{ position: 'relative' }}>
      <CardMedia
        component="img"
        height="180"
        image={game.imageUrl}
        alt={game.title}
        sx={{ objectFit: 'cover', backgroundColor: 'rgba(255,255,255,0.04)' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(4,8,12,0.92) 100%)',
        }}
      />
    </Box>
    <CardContent sx={{ flex: 1 }}>
      <Stack spacing={1.2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
            {game.title}
          </Typography>
          <Chip
            size="small"
            label={formatRating(game.rating)}
            sx={{ backgroundColor: 'rgba(45, 212, 191, 0.12)', color: '#7ff3dd' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
          {game.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {formatCurrency(game.price)}
          </Typography>
          <Chip size="small" variant="outlined" label={game.categoryName ?? 'Uncategorized'} />
        </Box>
      </Stack>
    </CardContent>
    <CardActions sx={{ p: 2, pt: 0 }}>
      {onAction ? (
        <Button fullWidth variant="contained" onClick={onAction} disabled={loading}>
          {actionLabel}
        </Button>
      ) : (
        <Button fullWidth component={RouterLink} to={`/games/${game.id}`} variant="contained">
          {actionLabel}
        </Button>
      )}
    </CardActions>
  </Card>
)
