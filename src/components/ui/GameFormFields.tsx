import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { Controller, type Control } from 'react-hook-form'
import type { CategoryDto, GameFormValues } from '../../types/api'

interface GameFormFieldsProps {
  control: Control<GameFormValues>
  categories: CategoryDto[]
  disabled?: boolean
}

export const GameFormFields = ({ control, categories, disabled = false }: GameFormFieldsProps) => (
  <Box
    sx={{
      display: 'grid',
      gap: 2.5,
      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
    }}
  >
    <Box>
      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            label="Title"
            disabled={disabled}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Box>
    <Box>
      <Controller
        control={control}
        name="categoryId"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            fullWidth
            label="Category"
            disabled={disabled}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Box>
    <Box sx={{ gridColumn: '1 / -1' }}>
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            multiline
            minRows={4}
            label="Description"
            disabled={disabled}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Box>
    <Box>
      <Controller
        control={control}
        name="price"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            type="number"
            label="Price"
            disabled={disabled}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
            onChange={(event) => field.onChange(Number(event.target.value))}
          />
        )}
      />
    </Box>
    <Box>
      <Controller
        control={control}
        name="rating"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            type="number"
            label="Rating"
            disabled={disabled}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            slotProps={{ htmlInput: { min: 0, max: 5, step: '0.1' } }}
            onChange={(event) => field.onChange(Number(event.target.value))}
          />
        )}
      />
    </Box>
    <Box>
      <Controller
        control={control}
        name="imageUrl"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            label="Image URL"
            disabled={disabled}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Box>
    <Box sx={{ gridColumn: '1 / -1' }}>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Use a reachable image URL to preview the game artwork.
        </Typography>
      </Stack>
    </Box>
  </Box>
)
