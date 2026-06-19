import { Card, CardContent, Stack, Typography } from '@mui/material'

interface StatCardProps {
  label: string
  value: string
  subtitle?: string
}

export const StatCard = ({ label, value, subtitle }: StatCardProps) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: 3,
      background:
        'linear-gradient(180deg, rgba(19, 31, 45, 0.96) 0%, rgba(11, 17, 26, 0.98) 100%)',
      border: '1px solid rgba(120, 187, 255, 0.15)',
    }}
  >
    <CardContent>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -1 }}>
          {value}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
    </CardContent>
  </Card>
)
