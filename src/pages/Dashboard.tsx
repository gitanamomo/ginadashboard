import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, AlertTriangle, TrendingUp, Users, ExternalLink, Calendar, Globe } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import PolicyChart from '@/components/charts/PolicyChart'
import PenaltyChart from '@/components/charts/PenaltyChart'
import { usePolicies } from '@/hooks/usePolicies'
import { usePenalties } from '@/hooks/usePenalties'
import { useEconData } from '@/hooks/useEconData'
import { useLeaders } from '@/hooks/useLeaders'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { Policy, Penalty } from '@/types'

const quickLinks = [
  { label: '深圳统计局', url: 'https://tjj.sz.gov.cn' },
  { label: '金融监管总局深圳局', url: 'https://www.nfra.gov.cn' },
  { label: '外管局深圳分局', url: 'https://www.safe.gov.cn/shenzhen/' },
  { label: '人行深圳分行', url: 'https://shenzhen.pbc.gov.cn' },
  { label: '深圳市地方金融管理局', url: 'https://jr.sz.gov.cn' },
  { label: '中国政府网', url: 'https://www.gov.cn' },
  { label: '国务院政策', url: 'https://www.gov.cn/zhengce/' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: policies, isLoading: pLoad } = usePolicies()
  const { data: penalties, isLoading: peLoad } = usePenalties()
  const { data: econData } = useEconData()
  const { data: leaders } = useLeaders()

  if (pLoad || peLoad) return <LoadingSpinner />

  const latestPolicies = (policies ?? []).slice(0, 6)
  const latestPenalties = (penalties ?? []).slice(0, 5)
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '真实政策', value: policies?.length ?? 0, icon: FileText, color: 'text-terminal-accent', sub: '来自官网' },
          { label: '处罚/监管', value: penalties?.length ?? 0, icon: AlertTriangle, color: 'text-red-400', sub: '官方公告' },
          { label: '领导信息', value: leaders?.length ?? 0, icon: Users, color: 'text-blue-400', sub: '公开页面' },
          { label: '数据来源', value: '3', icon: Globe, color: 'text-yellow-400', sub: '官方网站' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-terminal-bg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-terminal-text">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="text-[10px] text-terminal-muted">{stat.sub}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-terminal-muted" />
          <span className="text-sm text-terminal-muted">{today} · 数据来自官方政府网站</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map(link => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-terminal-bg border border-terminal-border text-xs text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/30 transition-all">
              {link.label} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader title="政策分类" subtitle="按类别统计" /><PolicyChart policies={policies ?? []} /></Card>
        <Card><CardHeader title="风险等级分布" subtitle="监管措施" /><PenaltyChart penalties={penalties ?? []} /></Card>
      </div>

      {/* Latest Policies + Penalties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="最新官方政策" subtitle="从 jr.sz.gov.cn & gov.cn 抓取"
            action={<button onClick={() => navigate('/policies')} className="text-xs text-terminal-accent hover:underline">查看全部</button>} />
          <div className="space-y-3">
            {latestPolicies.map((policy: Policy) => (
              <div key={policy.id} className="p-3 rounded-xl bg-terminal-bg/50 border border-terminal-border hover:border-terminal-accent/30 transition-all cursor-pointer"
                onClick={() => navigate(`/policies?highlight=${policy.id}`)}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge label={policy.source} variant="info" />
                  <Badge label={policy.category} variant="accent" />
                </div>
                <h4 className="text-sm font-medium text-terminal-text mb-1">{policy.title}</h4>
                <div className="flex items-center gap-3 text-xs text-terminal-muted">
                  <Calendar className="w-3 h-3" /><span>{policy.publish_date}</span>
                  <Globe className="w-3 h-3" /><span className="truncate">{policy.data_source}</span>
                  {policy.source_url && (
                    <a href={policy.source_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      className="text-terminal-accent hover:underline ml-auto"><ExternalLink className="w-3 h-3" /></a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="最新监管公告" subtitle="从 jr.sz.gov.cn 抓取"
            action={<button onClick={() => navigate('/penalties')} className="text-xs text-terminal-accent hover:underline">查看全部</button>} />
          <div className="space-y-3">
            {latestPenalties.map((penalty: Penalty) => (
              <div key={penalty.id} className="p-3 rounded-xl bg-terminal-bg/50 border border-terminal-border hover:border-red-500/20 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge label={penalty.penalty_type} variant={penalty.risk_level === 'critical' || penalty.risk_level === 'high' ? 'danger' : 'warning'} />
                    <span className="text-sm font-medium text-terminal-text line-clamp-1">{penalty.reason}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-terminal-muted">
                  <Calendar className="w-3 h-3" /><span>{penalty.date}</span>
                  <span>{penalty.region}</span>
                  <span>{penalty.data_source}</span>
                  {penalty.source_url && (
                    <a href={penalty.source_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      className="text-terminal-accent hover:underline ml-auto"><ExternalLink className="w-3 h-3" /></a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Econ Data - optional, only if available */}
      {econData && econData.length > 0 && (
        <Card>
          <CardHeader title="深圳经济指标" subtitle="数据来源: 深圳统计局" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {econData.map(indicator => (
              <div key={indicator.id} className="p-3 rounded-xl bg-terminal-bg/50 border border-terminal-border text-center">
                <div className="stat-label mb-1">{indicator.name}</div>
                <div className="text-xl font-bold font-mono text-terminal-text">{indicator.value}</div>
                <div className={`text-xs mt-1 ${indicator.direction === 'up' ? 'text-terminal-accent' : indicator.direction === 'down' ? 'text-red-400' : 'text-terminal-muted'}`}>
                  {indicator.change}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Data Source Note */}
      <div className="text-center text-xs text-terminal-muted py-4 border-t border-terminal-border">
        <p>所有数据来自中国官方政府网站：jr.sz.gov.cn · gov.cn · pbc.gov.cn</p>
        <p>数据每日自动更新 · 每条数据均可溯源至原文链接</p>
      </div>
    </div>
  )
}
