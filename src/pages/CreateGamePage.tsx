import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Stack,
  Typography,
} from '@mui/material'
import { CheckCircleRounded, WarningAmberRounded } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { GameFormFields } from '../components/ui/GameFormFields'
import type { CategoryDto, GameFormValues } from '../types/api'

const gameSchema = z.object({
  title: z.string().min(2, 'Title is required').max(120, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
  rating: z.number().min(0).max(5),
  imageUrl: z.string().url('Enter a valid image URL'),
  categoryId: z.number().int().positive('Choose a category'),
})

const publishingSteps = ['Building...', 'Packaging...', 'Uploading assets...', 'Publishing...', 'Completed']

const mockCategories: CategoryDto[] = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'RPG' },
  { id: 3, name: 'Strategy' },
  { id: 4, name: 'Simulation' },
]

type PublishingPhase = 'verification' | 'wizard' | 'review'

export const CreateGamePage = () => {
  const navigate = useNavigate()
  const [isPublishingDialogOpen, setIsPublishingDialogOpen] = useState(false)
  const [publishingPhase, setPublishingPhase] = useState<PublishingPhase>('verification')
  const [isRollingVerification, setIsRollingVerification] = useState(false)
  const [verificationRollValue, setVerificationRollValue] = useState(1)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [completedWizardStep, setCompletedWizardStep] = useState(-1)

  const rollingIntervalRef = useRef<number | null>(null)
  const flowTimeoutsRef = useRef<number[]>([])

  const defaultValues = useMemo<GameFormValues>(
    () => ({
      title: '',
      description: '',
      price: 0,
      rating: 4.5,
      imageUrl: '',
      categoryId: mockCategories[0].id,
    }),
    [],
  )

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues,
  })

  useEffect(() => {
    reset({
      ...defaultValues,
      categoryId: mockCategories[0].id,
    })
  }, [defaultValues, reset])

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

  const goBackToStore = () => {
    closePublishingDialog()
    navigate('/')
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
      setVerificationRollValue(1 + Math.floor(Math.random() * 20))
    }, 100)

    const rollDuration = 2000 + Math.floor(Math.random() * 1001)

    const stopRollTimeout = window.setTimeout(() => {
      if (rollingIntervalRef.current !== null) {
        window.clearInterval(rollingIntervalRef.current)
        rollingIntervalRef.current = null
      }

      setVerificationRollValue(20)
      setIsRollingVerification(false)
      setVerificationSuccess(true)

      const transitionTimeout = window.setTimeout(() => {
        startPublishingWizard()
      }, 1000)

      flowTimeoutsRef.current.push(transitionTimeout)
    }, rollDuration)

    flowTimeoutsRef.current.push(stopRollTimeout)
  }

  useEffect(() => () => clearFlowTimers(), [])

  const submitGame = async (_values: GameFormValues) => {
    openPublishingDialog()
    reset(defaultValues)
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
          This form is demo-only. Submitting opens a fake Steam publishing experience with no backend calls.
        </Typography>
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
          <Stack component="form" spacing={3} onSubmit={handleSubmit(submitGame)}>
            <GameFormFields
              control={control}
              categories={mockCategories}
              disabled={isSubmitting}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => reset(defaultValues)} disabled={isSubmitting}>
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                Create game
              </Button>
            </Stack>
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
          {publishingPhase === 'review' ? 'Community Feedback' : null}
        </DialogTitle>

        <DialogContent>
          {publishingPhase === 'verification' ? (
            <Stack spacing={2.5} sx={{ py: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Roll for publisher verification to unlock Steam Partner publishing.
              </Typography>

              <Box
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(102, 192, 244, 0.24)',
                  backgroundColor: 'rgba(102, 192, 244, 0.07)',
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    minWidth: 120,
                    textAlign: 'center',
                    color: '#8fd7ff',
                    transform: isRollingVerification ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 120ms ease-out',
                    textShadow: '0 0 18px rgba(102, 192, 244, 0.35)',
                  }}
                >
                  {verificationRollValue}
                </Typography>
                {isRollingVerification ? (
                  <CircularProgress
                    size={28}
                    sx={{ position: 'absolute', top: 14, right: 14, color: '#8fd7ff' }}
                  />
                ) : null}
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
              <Stack direction="row" spacing={1.3} sx={{ alignItems: 'center' }}>
                <CircularProgress size={18} sx={{ color: '#8fd7ff' }} />
                <Typography variant="body1" color="text.secondary">
                  Publishing in progress...
                </Typography>
              </Stack>

              {publishingSteps.map((step, index) => {
                const isVisible = index <= completedWizardStep

                return (
                  <Fade in={isVisible} timeout={360 + index * 80} key={step}>
                    <Box
                      sx={{
                        borderRadius: 2,
                        px: 1.5,
                        py: 1,
                        border: '1px solid rgba(255,255,255,0.10)',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
                        <CheckCircleRounded sx={{ color: '#69d86f' }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {step}
                        </Typography>
                      </Stack>
                    </Box>
                  </Fade>
                )
              })}
            </Stack>
          ) : null}

          {publishingPhase === 'review' ? (
            <Stack spacing={2.4} sx={{ py: 1 }}>
              <Box
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(255, 188, 85, 0.30)',
                  background:
                    'linear-gradient(180deg, rgba(52, 36, 18, 0.45) 0%, rgba(25, 19, 10, 0.42) 100%)',
                  p: 2,
                }}
              >
                <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
                  <WarningAmberRounded sx={{ color: '#ffbc55' }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Community Feedback
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
                  Steam Partner Program review
                </Typography>
              </Box>

              <Stack spacing={0.8}>
                <Typography variant="body1">Potential wishlists: 3</Typography>
                <Typography variant="body1">Potential refunds: 428</Typography>
              </Stack>

              <Box
                sx={{
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  p: 1.8,
                }}
              >
                <Typography variant="overline" color="text.secondary">
                  Recommendation
                </Typography>
                <Typography variant="h6">Maybe cook a little longer.</Typography>
              </Box>
            </Stack>
          ) : null}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.4, pt: 0.4 }}>
          {publishingPhase === 'review' ? (
            <Button variant="contained" onClick={goBackToStore}>
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
