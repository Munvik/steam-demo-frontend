import { GameStatus } from '../types/api'

export const gameStatusLabelMap: Record<GameStatus, string> = {
  [GameStatus.Owned]: 'Owned',
  [GameStatus.Installed]: 'Installed',
  [GameStatus.Playing]: 'Playing',
  [GameStatus.Completed]: 'Completed',
}

export const gameStatusOptions = [
  { value: GameStatus.Owned, label: 'Owned' },
  { value: GameStatus.Installed, label: 'Installed' },
  { value: GameStatus.Playing, label: 'Playing' },
  { value: GameStatus.Completed, label: 'Completed' },
]

export const getGameStatusLabel = (status: number) =>
  gameStatusLabelMap[status as GameStatus] ?? `Status ${status}`
