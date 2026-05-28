import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Globe, TrendingUp, FileText, ExternalLink, Calendar, AlertTriangle, Zap } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { usePolicies } from '@/hooks/usePolicies'
import { useForeignBanks } from '@/hooks/useForeignBanks'
import { useMajorEvents } from '@/hooks/useMajorEvents'
import { useEconData } from '@/hooks/useEconData'
import type { Policy, ForeignBank, MajorEvent } from '@/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: policies, isLoading: pLoad } = usePolicies()
  const { data: banks, isLoading: bLoad } = useForeignBanks()
  const { data: events, isLoading: eLoad } = useMajorEvents()
  const { data: econData } = useEconData()

  if (pLoad || bLoad || eLoad) return <LoadingSpinner />

  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  const latestPolicies = (policies ?? []).slice(0, 5)
  const latestEvents = (events ?? []).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Bloomberg-style ticker header */}
      <Card>
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-terminal-accent animate-pulse" />
          <span className="text-sm font-mono text-terminal-accent">华南金融监管情报中心</span>
          <span className="text-xs text-terminal-muted">{today} · 外资银行 · 金融开放 · 大湾区</span>
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: '外资银行', value: banks?.length ?? 0, sub: '广东/深圳', icon: Building2, color: 'text-terminal-accent' },
          { label: '最新政策', value: policies?.length ?? 0, sub: '金融/外资', icon: FileText, color: 'text-blue-400' },
          { label: '重大事件', value: events?.length ?? 0, sub: '实时追踪', icon: AlertTriangle, color: 'text-yellow-400' },
          { label: '经济指标', value: econData?.length ?? 0, sub: '华南城市', icon: TrendingUp, color: 'text-green-400' },
          { label: '数据来源', value: '6+', sub: '官方网站', icon: Globe, color: 'text-purple-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="text-center py-3">
              <div className={`flex justify-center mb-1 ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <div className="text-xl font-bold font-mono text-terminal-text">{s.value}</div>
              <div className="text-xs text-terminal-muted">{s.label}</div>
              <div className="text-[10px] text-terminal-muted/60">{s.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main grid: Policies + Events + Banks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Latest Policies */}
        <Card>
          <CardHeader title="最新金融政策" subtitle="外资/跨境/开放"
            action={<button onClick={() => navigate('/policies')} className="text-xs text-terminal-accent hover:underline">全部</button>} />
          <div className="space-y-2">
            {latestPolicies.map((p: Policy) => (
              <div key={p.id} className="p-2.5 rounded-lg bg-terminal-bg/50 border border-terminal-border hover:border-terminal-accent/30 transition-all cursor-pointer"
                onClick={() => navigate('/policies')}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge label={p.category} variant="accent" />
                  <span className="text-[10px] text-terminal-muted">{p.publish_date}</span>
                </div>
                <p className="text-xs text-terminal-text line-clamp-2">{p.title}</p>
                <p className="text-[10px] text-terminal-muted mt-1">{p.data_source}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Column 2: Major Events */}
        <Card>
          <CardHeader title="重大事件看板" subtitle="利率/汇率/开放/支付" />
          <div className="space-y-2">
            {latestEvents.map((e: MajorEvent) => (
              <div key={e.id} className="p-2.5 rounded-lg bg-terminal-bg/50 border border-terminal-border hover:border-yellow-500/20 transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge label={e.category} variant={e.category === '利率' ? 'warning' : e.category === '金融开放' ? 'accent' : 'info'} />
                  <span className="text-[10px] text-terminal-muted">{e.date}</span>
                </div>
                <p className="text-xs text-terminal-text font-medium line-clamp-1">{e.title}</p>
                <p className="text-[10px] text-terminal-muted mt-0.5 line-clamp-1">{e.impact}</p>
                <div className="flex items-center gap-1 mt-1">
                  {e.tags.slice(0, 2).map(t => <span key={t} className="text-[9px] text-terminal-muted/60">#{t}</span>)}
                  {e.source_url && <a href={e.source_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-[9px] text-terminal-accent"><ExternalLink className="w-2.5 h-2.5" /></a>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Column 3: Foreign Banks */}
        <Card>
          <CardHeader title="外资银行·广东" subtitle={`${banks?.length ?? 0}家重点银行`}
            action={<button onClick={() => navigate('/banks')} className="text-xs text-terminal-accent hover:underline">全部</button>} />
          <div className="space-y-2">
            {(banks ?? []).slice(0, 6).map((b: ForeignBank) => (
              <div key={b.id} className="p-2.5 rounded-lg bg-terminal-bg/50 border border-terminal-border hover:border-blue-500/20 transition-all cursor-pointer"
                onClick={() => navigate(`/banks/${b.id}`)}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-terminal-text">{b.bank_name.replace('（中国）有限公司', '')}</span>
                  <span className="text-[10px] text-terminal-muted">{b.headquarters_country}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-terminal-muted">深圳{b.shenzhen_outlets}网点</span>
                  <span className="text-[10px] text-terminal-muted">·</span>
                  <span className="text-[10px] text-terminal-muted">{b.china_entity_type}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {b.tags.slice(0, 3).map(t => <Badge key={t} label={t} variant="default" />)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Econ Indicators */}
      {econData && econData.length > 0 && (
        <Card>
          <CardHeader title="华南经济数据仪表盘" subtitle="来源: 各市统计局 · 人行 · 海关" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {econData.map(e => (
              <div key={e.id} className="p-2.5 rounded-lg bg-terminal-bg/50 border border-terminal-border text-center">
                <div className="text-[10px] text-terminal-muted/60 mb-0.5">{e.city}</div>
                <div className="text-[10px] text-terminal-muted">{e.name}</div>
                <div className="text-base font-bold font-mono text-terminal-text mt-1">{e.value}</div>
                <div className={`text-xs mt-0.5 ${e.direction === 'up' ? 'text-terminal-accent' : e.direction === 'down' ? 'text-red-400' : 'text-terminal-muted'}`}>
                  {e.change}
                </div>
                <div className="text-[9px] text-terminal-muted/50 mt-0.5">{e.period} · {e.source}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-[10px] text-terminal-muted py-3 border-t border-terminal-border">
        所有数据来自官方政府网站 · 每条数据可溯源 · 禁止AI编造
      </div>
    </div>
  )
}
