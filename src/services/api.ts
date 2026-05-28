import type { Leader, Policy, ForeignBank, MajorEvent, EconIndicator } from '@/types'
import leadersData from '@/data/leaders.json'
import policiesData from '@/data/policies.json'
import banksData from '@/data/foreignBanks.json'
import eventsData from '@/data/majorEvents.json'
import econData from '@/data/econData.json'

export async function fetchLeaders(): Promise<Leader[]> { return leadersData as Leader[] }
export async function fetchLeaderById(id: string): Promise<Leader | null> { return (leadersData as Leader[]).find(l => l.id === id) ?? null }
export async function fetchPolicies(): Promise<Policy[]> { return policiesData as Policy[] }
export async function fetchPolicyById(id: string): Promise<Policy | null> { return (policiesData as Policy[]).find(p => p.id === id) ?? null }
export async function fetchForeignBanks(): Promise<ForeignBank[]> { return banksData as ForeignBank[] }
export async function fetchForeignBankById(id: string): Promise<ForeignBank | null> { return (banksData as ForeignBank[]).find(b => b.id === id) ?? null }
export async function fetchMajorEvents(): Promise<MajorEvent[]> { return eventsData as MajorEvent[] }
export async function fetchEconData(): Promise<EconIndicator[]> { return econData as EconIndicator[] }

export async function searchLeaders(query: string): Promise<Leader[]> {
  const q = query.toLowerCase()
  return (await fetchLeaders()).filter(l => l.name.includes(query) || l.title.includes(query) || l.organization.includes(query) || l.org_short.includes(query))
}

export async function searchPolicies(query: string): Promise<Policy[]> {
  const q = query.toLowerCase()
  return (await fetchPolicies()).filter(p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.keywords.some(k => k.toLowerCase().includes(q)))
}
