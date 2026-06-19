import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '../../api/dashboardApi'
import { queryKeys } from '../../api/queryKeys'

export const useDashboardSummary = () =>
  useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboardSummary,
    staleTime: 60 * 1000,
  })
