import { useQuery } from '@tanstack/react-query'
import { fetchPolicies, fetchPolicyById, searchPolicies } from '@/services/api'
import type { Policy } from '@/types'

export function usePolicies() {
  return useQuery<Policy[]>({
    queryKey: ['policies'],
    queryFn: fetchPolicies,
  })
}

export function usePolicy(id: string) {
  return useQuery<Policy | null>({
    queryKey: ['policy', id],
    queryFn: () => fetchPolicyById(id),
    enabled: !!id,
  })
}

export function usePolicySearch(query: string) {
  return useQuery<Policy[]>({
    queryKey: ['policySearch', query],
    queryFn: () => searchPolicies(query),
    enabled: query.length > 0,
  })
}
