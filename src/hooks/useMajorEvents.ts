import { useQuery } from '@tanstack/react-query'
import { fetchMajorEvents } from '@/services/api'
import type { MajorEvent } from '@/types'

export function useMajorEvents() {
  return useQuery<MajorEvent[]>({ queryKey: ['majorEvents'], queryFn: fetchMajorEvents, staleTime: 60 * 60 * 1000 })
}
