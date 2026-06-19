export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)

export const formatRating = (value: number) => `${value.toFixed(1)}/5`

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)
