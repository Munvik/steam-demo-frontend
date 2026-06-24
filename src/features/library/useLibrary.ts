import { useQuery } from '@tanstack/react-query'
import { getLibrary } from '../../api/libraryApi'
import { queryKeys } from '../../api/queryKeys'

export const useLibrary = () =>
  useQuery({
    queryKey: queryKeys.library,
    queryFn: getLibrary
  })
