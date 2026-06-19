import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Snackbar, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCategories } from '../features/categories/useCategories'
import { useCreateGameMutation } from '../features/games/useGames'
import { GameFormFields } from '../components/ui/GameFormFields'
import type { GameFormValues } from '../types/api'

const gameSchema = z.object({
  title: z.string().min(2, 'Title is required').max(120, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
  rating: z.number().min(0).max(5),
  imageUrl: z.string().url('Enter a valid image URL'),
  categoryId: z.number().int().positive('Choose a category'),
})

export const CreateGamePage = () => {
  const navigate = useNavigate()
  const categoriesQuery = useCategories()
  const createGameMutation = useCreateGameMutation()
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const defaultValues = useMemo<GameFormValues>(
    () => ({
      title: '',
      description: '',
      price: 0,
      rating: 4.5,
      imageUrl: '',
      categoryId: categoriesQuery.data?.[0]?.id ?? 0,
    }),
    [categoriesQuery.data],
  )

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues,
  })

  useEffect(() => {
    if (categoriesQuery.data?.length) {
      reset({
        ...defaultValues,
        categoryId: categoriesQuery.data[0].id,
      })
    }
  }, [categoriesQuery.data, defaultValues, reset])

  const submitGame = async (values: GameFormValues) => {
    try {
      const createdGame = await createGameMutation.mutateAsync(values)
      setSnackbar({ open: true, message: 'Game created successfully.' })
      reset(defaultValues)
      if (createdGame.id) {
        navigate(`/games/${createdGame.id}`)
      }
    } catch {
      setSnackbar({ open: true, message: 'Failed to create the game.' })
    }
  }

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
        <Typography variant="h2" component="h1">
          Add Game
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Create a new game record through the backend API using a validated form.
        </Typography>
      </Box>

      {categoriesQuery.isError ? (
        <Alert severity="error">Unable to load categories. The form needs the backend category list.</Alert>
      ) : null}

      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.08)',
          background:
            'linear-gradient(180deg, rgba(16, 24, 36, 0.98) 0%, rgba(9, 13, 20, 0.98) 100%)',
        }}
      >
        <CardContent>
          <Stack component="form" spacing={3} onSubmit={handleSubmit(submitGame)}>
            <GameFormFields
              control={control}
              categories={categoriesQuery.data ?? []}
              disabled={categoriesQuery.isLoading || createGameMutation.isPending || isSubmitting}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => reset(defaultValues)} disabled={isSubmitting}>
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={categoriesQuery.isLoading || createGameMutation.isPending || isSubmitting}
              >
                Create game
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        message={snackbar.message}
      />
    </Stack>
  )
}
