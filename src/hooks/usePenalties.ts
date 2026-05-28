import { useQuery } from '@tanstack/react-query'
import { fetchPenalties } from '@/services/api'
import type { Penalty } from '@/types'

export function usePenalties() {
  return useQuery<Penalty[]>({
    queryKey: ['penalties'],
    queryFn: fetchPenalties,
  })
}
