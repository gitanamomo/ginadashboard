import { create } from 'zustand'
import type { Policy } from '@/types'

interface AppState {
  selectedPolicies: string[]
  policyData: Policy[]
  togglePolicy: (id: string) => void
  setPolicyData: (data: Policy[]) => void
  clearPolicies: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedPolicies: [],
  policyData: [],
  togglePolicy: (id) =>
    set((state) => ({
      selectedPolicies: state.selectedPolicies.includes(id)
        ? state.selectedPolicies.filter((p) => p !== id)
        : [...state.selectedPolicies, id],
    })),
  setPolicyData: (data) => set({ policyData: data }),
  clearPolicies: () => set({ selectedPolicies: [] }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
