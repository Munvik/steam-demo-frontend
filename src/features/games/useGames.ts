import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  buyGame,
  createGame,
  deleteGame,
  getGameById,
  getGames,
  updateGame,
  updateLibraryStatus,
  type GetGamesParams,
} from '../../api/gamesApi'
import { queryKeys } from '../../api/queryKeys'
import type {
  CreateGameCommand,
  GameDto,
  GameStatus,
  UpdateGameCommand,
  UpdateLibraryStatusRequest,
} from '../../types/api'

export const useGames = (filters: GetGamesParams) =>
  useQuery({
    queryKey: queryKeys.storeGames(filters as Record<string, unknown>),
    queryFn: () => getGames(filters),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  })

export const useGame = (id?: number) =>
  useQuery({
    queryKey: id ? queryKeys.game(id) : queryKeys.game(-1),
    queryFn: () => getGameById(id ?? 0),
    enabled: Number.isFinite(id) && (id ?? 0) > 0,
    staleTime: 60 * 1000,
  })

export const useCreateGameMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateGameCommand) => createGame(payload),
    onSuccess: async (createdGame: GameDto) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.games })
      await queryClient.invalidateQueries({ queryKey: queryKeys.storeGames({}) })
      await queryClient.setQueryData(queryKeys.game(createdGame.id), createdGame)
    },
  })
}

export const useUpdateGameMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateGameCommand) => updateGame(payload),
    onSuccess: async (updatedGame: GameDto) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.games })
      await queryClient.setQueryData(queryKeys.game(updatedGame.id), updatedGame)
    },
  })
}

export const useDeleteGameMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteGame(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.games })
      await queryClient.invalidateQueries({ queryKey: queryKeys.library })
    },
  })
}

export const useBuyGameMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (game: GameDto) => buyGame(game),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.library })
    },
  })
}

export const useUpdateLibraryStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gameId, status }: { gameId: number; status: GameStatus }) =>
      updateLibraryStatus(gameId, { status } satisfies UpdateLibraryStatusRequest),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.library })
    },
  })
}
