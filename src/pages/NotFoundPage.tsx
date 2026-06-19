import { Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export const NotFoundPage = () => (
  <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', py: 10 }}>
    <Typography variant="h2">404</Typography>
    <Typography variant="h5">Page not found</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
      The route you opened does not exist in this frontend shell.
    </Typography>
    <Button component={RouterLink} to="/" variant="contained">
      Return to store
    </Button>
  </Stack>
)
