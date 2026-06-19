export interface CategoryDto {
  id: number
  name: string
}

export interface GameDto {
  id: number
  title: string
  description: string
  price: number
  rating: number
  imageUrl: string
  categoryId: number
  categoryName?: string
}

export interface CreateGameCommand {
  title: string
  description: string
  price: number
  rating: number
  imageUrl: string
  categoryId: number
}

export interface UpdateGameCommand extends CreateGameCommand {
  id: number
}

export const GameStatus = {
  Owned: 0,
  Installed: 1,
  Playing: 2,
  Completed: 3,
} as const

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus]

export interface UpdateLibraryStatusRequest {
  status: GameStatus
}

export interface LibraryGameDto extends Partial<GameDto> {
  id?: number
  gameId?: number
  status: GameStatus
}

export interface DashboardSummaryDto {
  ownedGames: number
  completedGames: number
  playingGames: number
  totalSpent: number
}

export interface GameFormValues {
  title: string
  description: string
  price: number
  rating: number
  imageUrl: string
  categoryId: number
}
