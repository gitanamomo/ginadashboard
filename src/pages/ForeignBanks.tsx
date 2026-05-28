import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Globe, MapPin, ExternalLink, TrendingUp, AlertTriangle, ChevronRight, Search, Zap } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useForeignBanks } from '@/hooks/useForeignBanks'
import type { ForeignBank } from '@/types'

const countryFlags: Record<string, string> = {
  '英国': '🇬🇧', '美国': '🇺🇸', '中国香港': '🇭🇰', '新加坡': '🇸🇬', '德国': '🇩🇪', '法国': '🇫🇷', '日本': '🇯🇵'
}

export default function ForeignBanks() {
  const navigate = useNavigate()
  const { data: banks, isLoading } = useForeignBanks()
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('全部')

  if (isLoading) return <LoadingSpinner />

  const countries = ['全部', ...new Set((banks ?? []).map(b => b.headquarters_country))]

  const filtered = (banks ?? []).filter(b => {
    if (search && !b.bank_name.includes(search) && !b.english_name.toLowerCase().includes(search.toLowerCase()) && !b.tags.some(t => t.includes(search))) return false
    if (country !== '全部' && b.headquarters_country !== country) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">外资银行·广东数据库</h2>
        <p className="text-sm text-terminal-muted mt-1">12家重点外资银行 · 广东分行信息 · 跨境业务分析 · 政策影响评估</p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索银行名称、国家、业务..." className="w-full pl-10 pr-4 py-2.5 bg-terminal-bg border border-terminal-border rounded-xl text-sm text-terminal-text placeholder-terminal-muted focus:outline-none focus:border-terminal-accent/50" />
          </div>
          <div className="flex flex-wrap gap-2">
            {countries.map(c => (
              <button key={c} onClick={() => setCountry(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${country === c ? 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30' : 'bg-terminal-bg text-terminal-muted border border-terminal-border hover:border-terminal-accent/30'}`}>
                {countryFlags[c] || ''} {c}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((bank: ForeignBank, i: number) => (
            <motion.div key={bank.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card hover onClick={() => navigate(`/banks/${bank.id}`)}>
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Bank Identity */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{countryFlags[bank.headquarters_country] || '🏦'}</span>
                      <h3 className="text-base font-bold text-terminal-text">{bank.bank_name}</h3>
                    </div>
                    <p className="text-xs text-terminal-muted">{bank.english_name}</p>
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <Badge label={bank.headquarters_country} variant="info" />
                      <Badge label={bank.china_entity_type} variant="accent" />
                      <Badge label={`深圳${bank.shenzhen_outlets}网点`} variant="default" />
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-terminal-muted">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{bank.shenzhen_branch_address}</span>
                    </div>
                  </div>

                  {/* Core Business + Tags */}
                  <div className="flex-1">
                    <div className="text-xs text-terminal-muted mb-1">核心业务</div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {bank.core_business.map(b => <Badge key={b} label={b} variant="default" />)}
                    </div>
                    <div className="text-xs text-terminal-muted mb-1">跨境特色</div>
                    <div className="flex flex-wrap gap-1">
                      {bank.cross_border_features.slice(0, 4).map(f => <Badge key={f} label={f} variant="accent" />)}
                    </div>
                  </div>

                  {/* Latest Events */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-terminal-muted mb-1">最新动态</div>
                    <div className="space-y-1.5">
                      {bank.major_events.slice(0, 2).map((evt, j) => (
                        <div key={j} className="text-xs">
                          <span className="text-terminal-muted">{evt.date} </span>
                          <span className="text-terminal-text">{evt.event}</span>
                          <Badge label={evt.impact} variant={evt.impact === '利好' ? 'accent' : evt.impact.includes('挑战') ? 'warning' : 'default'} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-terminal-muted flex-shrink-0 self-center" />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
