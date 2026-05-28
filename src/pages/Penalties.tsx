import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, AlertTriangle, DollarSign, TrendingUp, MapPin } from 'lucide-react'
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

const regions = ['全部', '深圳', '全国']

export default function Penalties() {
  const { data: penalties, isLoading } = usePenalties()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('全部')
  const [riskFilter, setRiskFilter] = useState<string>('全部')

  if (isLoading) return <LoadingSpinner />

  let filtered = penalties?.filter(p => {
    if (search && !p.institution.includes(search) && !p.reason.includes(search) && !p.tags.some(t => t.includes(search))) return false
    if (region !== '全部' && p.region !== region) return false
    if (riskFilter !== '全部' && p.riskLevel !== riskFilter) return false
    return true
  }) ?? []

  const totalAmount = filtered.reduce((sum, p) => sum + p.amount, 0)
  const avgAmount = filtered.length > 0 ? totalAmount / filtered.length : 0

  const statsCards = [
    { label: '处罚总数', value: `${filtered.length}`, icon: AlertTriangle, color: 'text-red-400' },
    { label: '处罚总额', value: `¥${(totalAmount / 10000).toFixed(0)}万`, icon: DollarSign, color: 'text-yellow-400' },
    { label: '平均处罚', value: `¥${(avgAmount / 10000).toFixed(0)}万`, icon: TrendingUp, color: 'text-terminal-accent' },
    { label: '高危案例', value: `${filtered.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length}`, icon: AlertTriangle, color: 'text-red-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">监管处罚监控</h2>
        <p className="text-sm text-terminal-muted mt-1">处罚公告 · 金额统计 · 风险分级</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-terminal-bg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-terminal-text">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader title="处罚金额对比" subtitle="按风险等级着色" />
        <PenaltyChart penalties={penalties ?? []} />
      </Card>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="搜索机构名称、处罚原因..." />
          </div>
          <div className="flex gap-2">
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  region === r
                    ? 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30'
                    : 'bg-terminal-bg text-terminal-muted border border-terminal-border'
                }`}
              >
                <MapPin className="w-3 h-3 inline mr-1" />
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['全部', 'critical', 'high', 'medium', 'low'].map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  riskFilter === r
                    ? r === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : r === 'high' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30'
                    : 'bg-terminal-bg text-terminal-muted border border-terminal-border'
                }`}
              >
                {r === '全部' ? '全部风险' : riskLabels[r]?.label ?? r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Penalty List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((penalty: Penalty, i: number) => (
            <motion.div
              key={penalty.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card hover>
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    penalty.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400'
                    : penalty.riskLevel === 'high' ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-terminal-bg text-terminal-muted'
                  }`}>
                    ¥{(penalty.amount / 10000).toFixed(0)}万
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-terminal-text">{penalty.institution}</h4>
                      <Badge label={penalty.institutionType} variant="default" />
                      <Badge label={riskLabels[penalty.riskLevel]?.label ?? penalty.riskLevel}
                        variant={riskLabels[penalty.riskLevel]?.variant ?? 'default'} />
                    </div>
                    <p className="text-sm text-terminal-muted mb-1.5">{penalty.reason}</p>
                    <div className="flex items-center flex-wrap gap-3 text-xs text-terminal-muted">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {penalty.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {penalty.region}</span>
                      <span>{penalty.source}</span>
                      {penalty.tags.map(t => (
                        <span key={t} className="text-terminal-muted">#{t}</span>
                      ))}
                    </div>
                  </div>
                  {penalty.sourceUrl && (
                    <a
                      href={penalty.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 btn-outline text-xs"
                    >
                      原文
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-terminal-muted">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>未找到匹配的处罚记录</p>
        </div>
      )}
    </div>
  )
}
