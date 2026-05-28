import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Globe, TrendingUp, FileText, ExternalLink, Calendar, AlertTriangle, Zap, ShoppingBasket, Download, X } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { usePolicies } from '@/hooks/usePolicies'
import { useForeignBanks } from '@/hooks/useForeignBanks'
import { useMajorEvents } from '@/hooks/useMajorEvents'
import { useEconData } from '@/hooks/useEconData'
import { useAppStore } from '@/store/useStore'
import { downloadPolicyWord } from '@/services/wordDownload'
import type { Policy, ForeignBank, MajorEvent } from '@/types'

const quickLinks = [
  { label: '深圳统计局', url: 'https://tjj.sz.gov.cn', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  { label: '金融监管总局深圳局', url: 'https://www.nfra.gov.cn/branch/shenzhen/', color: 'from-blue-600 to-indigo-700', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  { label: '外管局深圳分局', url: 'https://www.safe.gov.cn/shenzhen/', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { label: '人行深圳分行', url: 'http://shenzhen.pbc.gov.cn', color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  { label: '深圳市金融局', url: 'https://jr.sz.gov.cn', color: 'from-violet-500 to-purple-700', bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  { label: '深圳政府在线', url: 'https://www.sz.gov.cn', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' },
  { label: '中国政府网', url: 'https://www.gov.cn', color: 'from-red-500 to-red-700', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  { label: '国务院政策', url: 'https://www.gov.cn/zhengce/', color: 'from-orange-500 to-red-600', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  { label: '深圳开放数据', url: 'https://opendata.sz.gov.cn/?sign=1', color: 'from-green-500 to-emerald-600', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
]

const econColors = [
  'from-[#00d4aa] to-[#00e0c0]', 'from-[#00aaff] to-[#40c0ff]',
  'from-[#a78bfa] to-[#c4b5fd]', 'from-[#f59e0b] to-[#fbbf24]',
  'from-[#ef4444] to-[#f87171]', 'from-[#06b6d4] to-[#22d3ee]',
  'from-[#8b5cf6] to-[#a78bfa]', 'from-[#ec4899] to-[#f472b6]',
  'from-[#10b981] to-[#34d399]', 'from-[#f97316] to-[#fb923c]',
  'from-[#3b82f6] to-[#60a5fa]', 'from-[#14b8a6] to-[#2dd4bf]',
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: policies, isLoading: pLoad } = usePolicies()
  const { data: banks, isLoading: bLoad } = useForeignBanks()
  const { data: events, isLoading: eLoad } = useMajorEvents()
  const { data: econData } = useEconData()
  const { selectedPolicies, togglePolicy, clearPolicies, setPolicyData, policyData } = useAppStore()

  useEffect(() => {
    if (policies) setPolicyData(policies)
  }, [policies, setPolicyData])

  if (pLoad || bLoad || eLoad) return <LoadingSpinner />

  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  const latestPolicies = (policies ?? []).slice(0, 6)
  const latestEvents = (events ?? []).slice(0, 5)
  const selectedPoliciesData = policyData.filter(p => selectedPolicies.includes(p.id))

  return (
    <div className="space-y-6">
      {/* Policy Basket Bar */}
      {selectedPolicies.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="sticky top-[72px] z-40">
          <Card glow className="!py-3 !px-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5 text-terminal-accent" />
                <span className="text-base font-semibold text-terminal-text">政策篮 · {selectedPolicies.length}条</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => downloadPolicyWord(selectedPoliciesData)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-terminal-accent text-black font-semibold text-sm hover:opacity-90 transition-all">
                  <Download className="w-4 h-4" /> 下载Word报告
                </button>
                <button onClick={clearPolicies}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-terminal-bg border border-terminal-border text-sm text-terminal-muted hover:text-terminal-text">
                  <X className="w-4 h-4" /> 清空
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Colored Quick Links */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-terminal-muted" />
          <span className="text-base text-terminal-muted">{today} · 官方网站直达</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {quickLinks.map(link => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl ${link.bg} border ${link.border} transition-all duration-300 hover:scale-[1.03] hover:shadow-lg`}>
              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${link.color} flex-shrink-0 group-hover:scale-125 transition-transform`} />
              <span className={`text-sm font-medium ${link.text} truncate`}>{link.label}</span>
              <ExternalLink className={`w-3 h-3 ${link.text} opacity-50 ml-auto flex-shrink-0`} />
            </a>
          ))}
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: '外资银行', value: banks?.length ?? 0, sub: '广东/深圳', icon: Building2, color: 'text-terminal-accent' },
          { label: '最新政策', value: policies?.length ?? 0, sub: '可勾选下载', icon: FileText, color: 'text-blue-400' },
          { label: '重大事件', value: events?.length ?? 0, sub: '实时追踪', icon: AlertTriangle, color: 'text-yellow-400' },
          { label: '经济指标', value: econData?.length ?? 0, sub: '华南城市', icon: TrendingUp, color: 'text-green-400' },
          { label: '官方来源', value: '10+', sub: 'gov.cn等', icon: Globe, color: 'text-purple-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="text-center py-4">
              <div className={`flex justify-center mb-2 ${s.color}`}><s.icon className="w-6 h-6" /></div>
              <div className="text-2xl font-bold font-mono text-terminal-text">{s.value}</div>
              <div className="text-sm text-terminal-muted mt-1">{s.label}</div>
              <div className="text-xs text-terminal-muted/60 mt-0.5">{s.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policies with checkboxes */}
        <Card>
          <CardHeader title="最新金融政策" subtitle="☑ 勾选加入政策篮"
            action={<button onClick={() => navigate('/policies')} className="text-sm text-terminal-accent hover:underline">全部</button>} />
          <div className="space-y-2">
            {latestPolicies.map((p: Policy) => (
              <div key={p.id} className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${selectedPolicies.includes(p.id) ? 'bg-terminal-accent/10 border-terminal-accent/40' : 'bg-terminal-bg/50 border-terminal-border hover:border-terminal-accent/30'}`}>
                <input type="checkbox" checked={selectedPolicies.includes(p.id)}
                  onChange={(e) => { e.stopPropagation(); togglePolicy(p.id); }}
                  className="mt-1 w-4 h-4 rounded accent-terminal-accent cursor-pointer flex-shrink-0" />
                <div className="flex-1 min-w-0" onClick={() => navigate('/policies')}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={p.category} variant="accent" />
                    <span className="text-xs text-terminal-muted">{p.publish_date}</span>
                  </div>
                  <p className="text-sm text-terminal-text line-clamp-2 font-medium">{p.title}</p>
                  <p className="text-xs text-terminal-muted mt-1">{p.data_source}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Major Events */}
        <Card>
          <CardHeader title="重大事件看板" subtitle="利率/汇率/开放/支付" />
          <div className="space-y-3">
            {latestEvents.map((e: MajorEvent) => (
              <div key={e.id} className="p-3 rounded-lg bg-terminal-bg/50 border border-terminal-border hover:border-yellow-500/20 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge label={e.category} variant={e.category === '利率' ? 'warning' : e.category === '金融开放' ? 'accent' : 'info'} />
                  <span className="text-sm text-terminal-muted">{e.date}</span>
                </div>
                <p className="text-sm text-terminal-text font-medium line-clamp-1">{e.title}</p>
                <p className="text-xs text-terminal-muted mt-1 line-clamp-1">{e.impact}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {e.tags.slice(0, 2).map(t => <span key={t} className="text-xs text-terminal-muted/60">#{t}</span>)}
                  {e.source_url && <a href={e.source_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-terminal-accent"><ExternalLink className="w-3.5 h-3.5" /></a>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Foreign Banks */}
        <Card>
          <CardHeader title="外资银行·广东" subtitle={`${banks?.length ?? 0}家重点银行`}
            action={<button onClick={() => navigate('/banks')} className="text-sm text-terminal-accent hover:underline">全部</button>} />
          <div className="space-y-3">
            {(banks ?? []).slice(0, 6).map((b: ForeignBank) => (
              <div key={b.id} className="p-3 rounded-lg bg-terminal-bg/50 border border-terminal-border hover:border-blue-500/20 transition-all cursor-pointer"
                onClick={() => navigate(`/banks/${b.id}`)}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-terminal-text">{b.bank_name.replace('（中国）有限公司', '')}</span>
                  <span className="text-sm text-terminal-muted">{b.headquarters_country}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs text-terminal-muted">深圳{b.shenzhen_outlets}网点</span>
                  <span className="text-xs text-terminal-muted">·</span>
                  <span className="text-xs text-terminal-muted">{b.china_entity_type}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {b.tags.slice(0, 3).map(t => <Badge key={t} label={t} variant="default" />)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bright Color Econ Dashboard */}
      {econData && econData.length > 0 && (
        <Card>
          <CardHeader title="华南经济数据看板" subtitle="来源: 各市统计局 · 人行 · 海关" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {econData.map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${econColors[i % econColors.length]} p-[1px]`}>
                <div className="bg-[#0d1117] rounded-xl p-4 h-full">
                  <div className="text-xs text-terminal-muted/60 mb-1">{e.city}</div>
                  <div className="text-sm text-terminal-muted mb-2">{e.name}</div>
                  <div className="text-3xl font-bold font-mono text-white mb-2">{e.value}</div>
                  <div className={`text-base font-semibold ${e.direction === 'up' ? 'text-terminal-accent' : e.direction === 'down' ? 'text-red-400' : 'text-terminal-muted'}`}>
                    {e.change}
                  </div>
                  <div className="text-xs text-terminal-muted/50 mt-2">{e.period} · {e.source}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
