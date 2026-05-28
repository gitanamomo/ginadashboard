import { useQuery } from '@tanstack/react-query'
import { fetchEconData } from '@/services/api'
import type { EconIndicator } from '@/types'

export function useEconData() {
  return useQuery<EconIndicator[]>({
    queryKey: ['econData'],
    queryFn: fetchEconData,
  })
}
