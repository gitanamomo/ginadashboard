import type { Leader, Policy, Penalty, EconIndicator } from '@/types'
import leadersData from '@/data/leaders.json'
import policiesData from '@/data/policies.json'
import penaltiesData from '@/data/penalties.json'
import econData from '@/data/econData.json'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchLeaders(): Promise<Leader[]> {
  await delay(300)
  return leadersData as Leader[]
}

export async function fetchLeaderById(id: string): Promise<Leader | null> {
  await delay(200)
  const leaders = leadersData as Leader[]
  return leaders.find(l => l.id === id) ?? null
}

export async function fetchPolicies(): Promise<Policy[]> {
  await delay(300)
  return policiesData as Policy[]
}

export async function fetchPolicyById(id: string): Promise<Policy | null> {
  await delay(200)
  const policies = policiesData as Policy[]
  return policies.find(p => p.id === id) ?? null
}

export async function fetchPenalties(): Promise<Penalty[]> {
  await delay(300)
  return penaltiesData as Penalty[]
}

export async function fetchEconData(): Promise<EconIndicator[]> {
  await delay(200)
  return econData as EconIndicator[]
}

export async function searchLeaders(query: string): Promise<Leader[]> {
  await delay(200)
  const q = query.toLowerCase()
  const leaders = leadersData as Leader[]
  return leaders.filter(
    l =>
      l.name.includes(query) ||
      l.title.toLowerCase().includes(q) ||
      l.organization.toLowerCase().includes(q) ||
      l.tags.some(t => t.toLowerCase().includes(q))
  )
}

export async function searchPolicies(query: string): Promise<Policy[]> {
  await delay(200)
  const q = query.toLowerCase()
  const policies = policiesData as Policy[]
  return policies.filter(
    p =>
      p.title.toLowerCase().includes(q) ||
      p.source.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.summary.toLowerCase().includes(q)
  )
}
