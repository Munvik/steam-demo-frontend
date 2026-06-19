import { apiClient } from './client'
import type { GameStatus, LibraryGameDto } from '../types/api'

type LibraryResponse = Partial<LibraryGameDto> & {
  game?: Partial<LibraryGameDto>
}

const normalizeLibraryItem = (item: LibraryResponse): LibraryGameDto => {
  const source = item.game ?? item

  return {
    id: Number(source.id ?? item.id ?? item.gameId ?? 0),
    gameId: Number(item.gameId ?? source.id ?? item.id ?? 0),
    title: source.title ?? 'Unknown game',
    description: source.description ?? '',
    price: Number(source.price ?? 0),
    rating: Number(source.rating ?? 0),
    imageUrl: source.imageUrl ?? '',
    categoryId: Number(source.categoryId ?? 0),
    categoryName: source.categoryName,
    status: Number(item.status ?? 0) as GameStatus,
  }
}

export const getLibrary = async (): Promise<LibraryGameDto[]> => {
  const response = await apiClient.get<LibraryResponse[]>('/api/library')

  return response.data.map(normalizeLibraryItem)
}
