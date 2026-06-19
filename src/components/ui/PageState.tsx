import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface PageStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

export const PageState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: PageStateProps) => (
  <Paper
    variant="outlined"
    sx={{
      p: 4,
      borderRadius: 3,
      borderColor: 'rgba(255,255,255,0.08)',
      background:
        'linear-gradient(180deg, rgba(15, 26, 39, 0.92) 0%, rgba(10, 15, 24, 0.96) 100%)',
    }}
  >
    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <Box sx={{ color: 'primary.main', fontSize: 36, lineHeight: 1 }}>{icon}</Box>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
        {description}
      </Typography>
      {actionLabel ? (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  </Paper>
)
