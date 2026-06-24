import type { LibraryGameDto } from '../types/api'
import { getLocalLibrary } from './libraryStorage'

export const getLibrary = async (): Promise<LibraryGameDto[]> => {
  return getLocalLibrary()
}
