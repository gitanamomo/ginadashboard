import type { Leader, Policy, Penalty, EconIndicator } from '@/types'
import leadersData from '@/data/leaders.json'
import policiesData from '@/data/policies.json'
import penaltiesData from '@/data/penalties.json'
import econData from '@/data/econData.json'

export async function fetchLeaders(): Promise<Leader[]> {
  return leadersData as Leader[]
}

export async function fetchLeaderById(id: string): Promise<Leader | null> {
  return (leadersData as Leader[]).find(l => l.id === id) ?? null
}

export async function fetchPolicies(): Promise<Policy[]> {
  return policiesData as Policy[]
}

export async function fetchPolicyById(id: string): Promise<Policy | null> {
  return (policiesData as Policy[]).find(p => p.id === id) ?? null
}

export async function fetchPenalties(): Promise<Penalty[]> {
  return penaltiesData as Penalty[]
}

export async function fetchEconData(): Promise<EconIndicator[]> {
  return econData as EconIndicator[]
}

export async function searchLeaders(query: string): Promise<Leader[]> {
  const q = query.toLowerCase()
  const leaders = await fetchLeaders()
  return leaders.filter(l =>
    l.name.includes(query) ||
    l.title.includes(query) ||
    l.organization.includes(query) ||
    l.org_short.includes(query) ||
    l.org_type.includes(query)
  )
}

export async function searchPolicies(query: string): Promise<Policy[]> {
  const q = query.toLowerCase()
  const policies = await fetchPolicies()
  return policies.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.source.toLowerCase().includes(q) ||
    p.keywords.some(k => k.toLowerCase().includes(q)) ||
    p.summary.toLowerCase().includes(q)
  )
}
