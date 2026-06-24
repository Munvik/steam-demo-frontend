import type { GameDto, GameStatus, LibraryGameDto } from '../types/api'
import { GameStatus as GameStatusValues } from '../types/api'

const LIBRARY_STORAGE_KEY = 'steam-demo-library'

const canUseLocalStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const toLibraryItem = (item: Partial<LibraryGameDto>): LibraryGameDto => {
  const id = Number(item.gameId ?? item.id ?? 0)

  return {
    id,
    gameId: id,
    title: item.title ?? 'Unknown game',
    description: item.description ?? '',
    price: Number(item.price ?? 0),
    rating: Number(item.rating ?? 0),
    imageUrl: item.imageUrl ?? '',
    categoryId: Number(item.categoryId ?? 0),
    categoryName: item.categoryName,
    status: Number(item.status ?? GameStatusValues.Owned) as GameStatus,
  }
}

export const getLocalLibrary = (): LibraryGameDto[] => {
  if (!canUseLocalStorage()) {
    return []
  }

  const raw = window.localStorage.getItem(LIBRARY_STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.map((item) => toLibraryItem(item as Partial<LibraryGameDto>))
  } catch {
    return []
  }
}

const setLocalLibrary = (items: LibraryGameDto[]) => {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items))
}

export const addGameToLocalLibrary = (game: GameDto) => {
  const gameId = Number(game.id)
  const library = getLocalLibrary()

  if (library.some((item) => Number(item.gameId ?? item.id) === gameId)) {
    return
  }

  setLocalLibrary([
    {
      ...game,
      id: gameId,
      gameId,
      status: GameStatusValues.Owned,
    },
    ...library,
  ])
}

export const updateLocalLibraryStatus = (gameId: number, status: GameStatus) => {
  const library = getLocalLibrary()
  const nextLibrary = library.map((item) =>
    Number(item.gameId ?? item.id) === gameId
      ? {
          ...item,
          status,
        }
      : item,
  )

  setLocalLibrary(nextLibrary)
}
