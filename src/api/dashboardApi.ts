import { apiClient } from './client'
import type { DashboardSummaryDto } from '../types/api'

type DashboardResponse = Partial<DashboardSummaryDto>

export const getDashboardSummary = async (): Promise<DashboardSummaryDto> => {
  const response = await apiClient.get<DashboardResponse>('/api/dashboard')

  return {
    ownedGames: Number(response.data.ownedGames ?? 0),
    completedGames: Number(response.data.completedGames ?? 0),
    playingGames: Number(response.data.playingGames ?? 0),
    totalSpent: Number(response.data.totalSpent ?? 0),
  }
}
