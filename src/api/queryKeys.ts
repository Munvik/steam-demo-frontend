export const queryKeys = {
  dashboard: ['dashboard'] as const,
  categories: ['categories'] as const,
  games: ['games'] as const,
  game: (id: number) => ['games', id] as const,
  storeGames: (filters: Record<string, unknown>) => ['storeGames', filters] as const,
  library: ['library'] as const,
}
