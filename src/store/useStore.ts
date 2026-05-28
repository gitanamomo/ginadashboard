import { create } from 'zustand'

interface AppState {
  selectedLeaders: string[]
  selectedPolicies: string[]
  toggleLeader: (id: string) => void
  togglePolicy: (id: string) => void
  clearLeaders: () => void
  clearPolicies: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedLeaders: [],
  selectedPolicies: [],
  toggleLeader: (id) =>
    set((state) => ({
      selectedLeaders: state.selectedLeaders.includes(id)
        ? state.selectedLeaders.filter((l) => l !== id)
        : [...state.selectedLeaders, id],
    })),
  togglePolicy: (id) =>
    set((state) => ({
      selectedPolicies: state.selectedPolicies.includes(id)
        ? state.selectedPolicies.filter((p) => p !== id)
        : [...state.selectedPolicies, id],
    })),
  clearLeaders: () => set({ selectedLeaders: [] }),
  clearPolicies: () => set({ selectedPolicies: [] }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
