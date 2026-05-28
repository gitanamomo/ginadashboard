import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ExternalLink, ChevronDown, ChevronUp, Globe, FileText } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import SearchBar from '@/components/ui/SearchBar'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { usePolicies } from '@/hooks/usePolicies'
import type { Policy } from '@/types'

export default function Policies() {
  const { data: policies, isLoading } = usePolicies()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('全部')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (isLoading) return <LoadingSpinner />

  const categories = ['全部', ...new Set((policies ?? []).map(p => p.category))]

  let filtered = (policies ?? []).filter(p => {
    if (search && !p.title.includes(search) && !p.summary.includes(search) && !p.keywords.some(k => k.includes(search))) return false
    if (category !== '全部' && p.category !== category) return false
    return true
  })
  filtered.sort((a, b) => b.publish_date.localeCompare(a.publish_date))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">金融政策库</h2>
        <p className="text-sm text-terminal-muted mt-1">聚焦外资银行 · 跨境金融 · 金融开放 · 大湾区</p>
      </div>

      <Card>
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="搜索政策标题/关键词..." />
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === c ? 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30' : 'bg-terminal-bg text-terminal-muted border border-terminal-border hover:border-terminal-accent/30'}`}>{c}</button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((policy: Policy, i: number) => (
            <motion.div key={policy.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="cursor-pointer" onClick={() => setExpandedId(expandedId === policy.id ? null : policy.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <Badge label={policy.source} variant="info" />
                      <Badge label={policy.category} variant="accent" />
                      {policy.keywords.slice(0, 3).map(k => <Badge key={k} label={k} variant="default" />)}
                    </div>
                    <h4 className="text-base font-semibold text-terminal-text mb-1">{policy.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-terminal-muted">
                      <Calendar className="w-3 h-3" />{policy.publish_date}
                      <Globe className="w-3 h-3" />{policy.data_source}
                      {policy.relevance && <span className="text-terminal-accent">{policy.relevance}</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    {expandedId === policy.id ? <ChevronDown className="w-5 h-5 text-terminal-accent" /> : <ChevronDown className="w-5 h-5 text-terminal-muted rotate-[-90deg]" />}
                  </div>
                </div>

                {expandedId === policy.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-terminal-border">
                    <p className="text-sm text-terminal-text mb-3">{policy.summary}</p>
                    <div className="flex flex-wrap gap-1 mb-3">{policy.keywords.map(k => <Badge key={k} label={k} variant="accent" />)}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-terminal-muted">{policy.organization} · {policy.publish_date} · {policy.relevance}</span>
                      {policy.source_url && (
                        <a href={policy.source_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs" onClick={e => e.stopPropagation()}>
                          原文 <ExternalLink className="w-3 h-3 ml-1" /></a>
                      )}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && <div className="text-center py-20 text-terminal-muted"><FileText className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>未找到匹配的政策</p></div>}

      <div className="text-center text-xs text-terminal-muted py-3 border-t border-terminal-border">所有政策来自官方网站 · 每条均可溯源 · 未使用AI编造</div>
    </div>
  )
}
