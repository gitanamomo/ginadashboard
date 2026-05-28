import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, AlertTriangle, Globe, ExternalLink } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import SearchBar from '@/components/ui/SearchBar'
import Badge from '@/components/ui/Badge'
import PenaltyChart from '@/components/charts/PenaltyChart'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { usePenalties } from '@/hooks/usePenalties'
import type { Penalty } from '@/types'

const riskLabels: Record<string, { label: string; variant: 'danger' | 'warning' | 'info' | 'default' }> = {
  critical: { label: '严重', variant: 'danger' },
  high: { label: '较高', variant: 'warning' },
  medium: { label: '一般', variant: 'info' },
  low: { label: '低', variant: 'default' },
}

export default function Penalties() {
  const { data: penalties, isLoading } = usePenalties()
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('全部')

  if (isLoading) return <LoadingSpinner />

  let filtered = (penalties ?? []).filter(p => {
    if (search && !p.reason.includes(search)) return false
    if (riskFilter !== '全部' && p.risk_level !== riskFilter) return false
    return true
  })

  const highCount = filtered.filter(p => p.risk_level === 'critical' || p.risk_level === 'high').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">监管公告</h2>
        <p className="text-sm text-terminal-muted mt-1">数据来源：jr.sz.gov.cn · 所有数据可溯源</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: '公告总数', value: `${filtered.length}`, color: 'text-red-400', icon: AlertTriangle },
          { label: '高风险', value: `${highCount}`, color: 'text-yellow-400', icon: AlertTriangle },
          { label: '数据来源', value: 'jr.sz.gov.cn', color: 'text-terminal-accent', icon: Globe },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card><div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-terminal-bg ${stat.color}`}><stat.icon className="w-4 h-4" /></div>
              <div><div className="text-lg font-bold font-mono text-terminal-text">{stat.value}</div><div className="stat-label">{stat.label}</div></div>
            </div></Card>
          </motion.div>
        ))}
      </div>

      <Card><CardHeader title="风险等级分布" /><PenaltyChart penalties={penalties ?? []} /></Card>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="搜索公告内容..." /></div>
          <div className="flex gap-2">
            {['全部', 'critical', 'high', 'medium', 'low'].map(r => (
              <button key={r} onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${riskFilter === r
                  ? r === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : r === 'high' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30'
                  : 'bg-terminal-bg text-terminal-muted border border-terminal-border'}`}>
                {r === '全部' ? '全部' : riskLabels[r]?.label ?? r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((penalty: Penalty, i: number) => (
            <motion.div key={penalty.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card hover>
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${penalty.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' : penalty.risk_level === 'high' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-terminal-bg text-terminal-muted'}`}>
                    {riskLabels[penalty.risk_level]?.label ?? penalty.risk_level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={penalty.penalty_type} variant={penalty.risk_level === 'critical' ? 'danger' : 'warning'} />
                      <Badge label={penalty.region} variant="default" />
                    </div>
                    <h4 className="text-sm font-semibold text-terminal-text mb-1">{penalty.reason}</h4>
                    <div className="flex items-center flex-wrap gap-3 text-xs text-terminal-muted">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {penalty.date}</span>
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {penalty.data_source}</span>
                      <span>{penalty.source}</span>
                    </div>
                  </div>
                  {penalty.source_url && (
                    <a href={penalty.source_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 btn-outline text-xs">
                      原文 <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
