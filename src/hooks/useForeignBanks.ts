import { useQuery } from '@tanstack/react-query'
import { fetchForeignBanks, fetchForeignBankById } from '@/services/api'
import type { ForeignBank } from '@/types'

export function useForeignBanks() {
  return useQuery<ForeignBank[]>({ queryKey: ['foreignBanks'], queryFn: fetchForeignBanks, staleTime: 30 * 60 * 1000 })
}
export function useForeignBank(id: string) {
  return useQuery<ForeignBank | null>({ queryKey: ['foreignBank', id], queryFn: () => fetchForeignBankById(id), enabled: !!id })
}
