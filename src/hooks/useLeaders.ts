import { useQuery } from '@tanstack/react-query'
import { fetchLeaders, fetchLeaderById, searchLeaders } from '@/services/api'
import type { Leader } from '@/types'

export function useLeaders() {
  return useQuery<Leader[]>({
    queryKey: ['leaders'],
    queryFn: fetchLeaders,
    staleTime: 30 * 60 * 1000,
  })
}

export function useLeader(id: string) {
  return useQuery<Leader | null>({
    queryKey: ['leader', id],
    queryFn: () => fetchLeaderById(id),
    enabled: !!id,
  })
}

export function useLeaderSearch(query: string) {
  return useQuery<Leader[]>({
    queryKey: ['leaderSearch', query],
    queryFn: () => searchLeaders(query),
    enabled: query.length > 0,
  })
}
