import { apiClient } from './client'
import { addGameToLocalLibrary, updateLocalLibraryStatus } from './libraryStorage'
import type {
  CreateGameCommand,
  GameDto,
  UpdateGameCommand,
  UpdateLibraryStatusRequest,
} from '../types/api'

type GameResponse = Partial<GameDto> & {
  categoryName?: string
}

const normalizeGame = (game: GameResponse): GameDto => ({
  id: Number(game.id),
  title: game.title ?? 'Untitled game',
  description: game.description ?? '',
  price: Number(game.price ?? 0),
  rating: Number(game.rating ?? 0),
  imageUrl: game.imageUrl ?? '',
  categoryId: Number(game.categoryId ?? 0),
  categoryName: game.categoryName,
})

export interface GetGamesParams {
  search?: string
  categoryId?: number | null
  sortBy?: string
}

export const getGames = async (params: GetGamesParams = {}): Promise<GameDto[]> => {
  const response = await apiClient.get<GameResponse[]>('/api/Games', {
    params: {
      search: params.search || undefined,
      categoryId: params.categoryId ?? undefined,
      sortBy: params.sortBy || undefined,
    },
  })

  return response.data.map(normalizeGame)
}

export const getGameById = async (id: number): Promise<GameDto> => {
  const response = await apiClient.get<GameResponse>(`/api/Games/${id}`)
  return normalizeGame(response.data)
}

export const createGame = async (payload: CreateGameCommand): Promise<GameDto> => {
  const response = await apiClient.post<GameResponse>('/api/Games', payload)
  return normalizeGame(response.data)
}

export const updateGame = async (payload: UpdateGameCommand): Promise<GameDto> => {
  const response = await apiClient.put<GameResponse>(`/api/Games/${payload.id}`, payload)
  return normalizeGame(response.data)
}

export const deleteGame = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/Games/${id}`)
}

export const buyGame = async (game: GameDto): Promise<void> => {
  addGameToLocalLibrary(game)
}

export const updateLibraryStatus = async (
  gameId: number,
  payload: UpdateLibraryStatusRequest,
): Promise<void> => {
  updateLocalLibraryStatus(gameId, payload.status)
}
