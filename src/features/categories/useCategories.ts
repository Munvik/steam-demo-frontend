import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../api/categoriesApi'
import { queryKeys } from '../../api/queryKeys'

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  })
