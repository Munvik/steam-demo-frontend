import { apiClient } from './client'
import type { CategoryDto } from '../types/api'

type CategoryResponse = {
  id?: number
  name?: string
}

export const getCategories = async (): Promise<CategoryDto[]> => {
  const response = await apiClient.get<CategoryResponse[]>('/api/categories')

  return response.data.map((category) => ({
    id: Number(category.id),
    name: category.name ?? `Category ${category.id}`,
  }))
}
