import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, AlertTriangle, TrendingUp, Users, ExternalLink, Calendar } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import PolicyChart from '@/components/charts/PolicyChart'
import PenaltyChart from '@/components/charts/PenaltyChart'
import { usePolicies } from '@/hooks/usePolicies'
import { usePenalties } from '@/hooks/usePenalties'
import { useEconData } from '@/hooks/useEconData'
import { useLeaders } from '@/hooks/useLeaders'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const quickLinks = [
  { label: '深圳统计局', url: 'https://tjj.sz.gov.cn' },
  { label: '金融监管总局深圳局', url: 'https://www.nfra.gov.cn' },
  { label: '外管局深圳分局', url: 'https://www.safe.gov.cn/shenzhen/' },
  { label: '人行深圳分行', url: 'https://shenzhen.pbc.gov.cn' },
  { label: '深圳市监局', url: 'https://amr.sz.gov.cn' },
  { label: '深圳开放数据', url: 'https://opendata.sz.gov.cn' },
  { label: '人社局', url: 'https://hrss.sz.gov.cn' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: policies, isLoading: policiesLoading } = usePolicies()
  const { data: penalties, isLoading: penaltiesLoading } = usePenalties()
  const { data: econData } = useEconData()
  const { data: leaders } = useLeaders()

  if (policiesLoading || penaltiesLoading) return <LoadingSpinner />

  const latestPolicies = policies?.slice(0, 5) ?? []
  const latestPenalties = penalties?.slice(0, 5) ?? []
  const totalPenalty = penalties?.reduce((sum, p) => sum + p.amount, 0) ?? 0
  const criticalCount = penalties?.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length ?? 0

  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '政策总数', value: policies?.length ?? 0, icon: FileText, color: 'text-terminal-accent' },
          { label: '处罚案例', value: penalties?.length ?? 0, icon: AlertTriangle, color: 'text-red-400' },
          { label: '领导人物', value: leaders?.length ?? 0, icon: Users, color: 'text-blue-400' },
          { label: '处罚总金额', value: `¥${(totalPenalty / 100000000).toFixed(1)}亿`, icon: TrendingUp, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-terminal-bg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-terminal-text">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
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
          <span className="text-sm text-terminal-muted">{today} · AI金融监管情报更新</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-terminal-bg border border-terminal-border
                         text-xs text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/30 transition-all"
            >
              {link.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="政策分类分布" subtitle="按监管领域分类统计" />
          <PolicyChart policies={policies ?? []} />
        </Card>
        <Card>
          <CardHeader title="处罚金额排行" subtitle={`高危/严重: ${criticalCount} 条`} />
          <PenaltyChart penalties={penalties ?? []} />
        </Card>
      </div>

      {/* Latest Policies + Latest Penalties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="最新监管政策"
            subtitle="最新5条"
            action={
              <button onClick={() => navigate('/policies')} className="text-xs text-terminal-accent hover:underline">
                查看全部
              </button>
            }
          />
          <div className="space-y-3">
            {latestPolicies.map(policy => (
              <div
                key={policy.id}
                className="p-3 rounded-xl bg-terminal-bg/50 border border-terminal-border hover:border-terminal-accent/30 transition-all cursor-pointer"
                onClick={() => navigate(`/policies?highlight=${policy.id}`)}
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <Badge label={policy.source} variant="info" />
                  <Badge label={policy.category} variant="accent" />
                </div>
                <h4 className="text-sm font-medium text-terminal-text mb-1">{policy.title}</h4>
                <p className="text-xs text-terminal-muted line-clamp-2">{policy.summary}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-terminal-muted">
                  <Calendar className="w-3 h-3" />
                  <span>{policy.date}</span>
                  {policy.riskLevel && (
                    <Badge label={policy.riskLevel === 'high' ? '高风险' : '一般'} variant={policy.riskLevel === 'high' ? 'danger' : 'default'} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="最新监管处罚"
            subtitle="最新5条"
            action={
              <button onClick={() => navigate('/penalties')} className="text-xs text-terminal-accent hover:underline">
                查看全部
              </button>
            }
          />
          <div className="space-y-3">
            {latestPenalties.map(penalty => (
              <div
                key={penalty.id}
                className="p-3 rounded-xl bg-terminal-bg/50 border border-terminal-border hover:border-red-500/20 transition-all cursor-pointer"
                onClick={() => navigate('/penalties')}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-terminal-text">{penalty.institution}</span>
                    <Badge label={penalty.institutionType} variant="default" />
                  </div>
                  <span className={`text-sm font-mono font-bold ${
                    penalty.riskLevel === 'critical' ? 'text-red-400' :
                    penalty.riskLevel === 'high' ? 'text-yellow-400' : 'text-terminal-muted'
                  }`}>
                    ¥{(penalty.amount / 10000).toFixed(0)}万
                  </span>
                </div>
                <p className="text-xs text-terminal-muted mb-1">{penalty.reason}</p>
                <div className="flex items-center gap-3 text-xs text-terminal-muted">
                  <Calendar className="w-3 h-3" />
                  <span>{penalty.date}</span>
                  <span>{penalty.region}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Econ Data */}
      {econData && (
        <Card>
          <CardHeader title="深圳经济指标速览" subtitle="2026年1-2月 · 来源: 深圳统计局" />
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
    </div>
  )
}
