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
  const [source, setSource] = useState('全部')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  if (isLoading) return <LoadingSpinner />

  // Get unique categories and sources
  const categories = ['全部', ...new Set((policies ?? []).map(p => p.category))]
  const sources = ['全部', ...new Set((policies ?? []).map(p => p.source))]

  let filtered = (policies ?? []).filter(p => {
    if (search && !p.title.includes(search) && !p.summary.includes(search)) return false
    if (category !== '全部' && p.category !== category) return false
    if (source !== '全部' && p.source !== source) return false
    return true
  })

  filtered = [...filtered].sort((a, b) =>
    sortOrder === 'newest'
      ? b.publish_date.localeCompare(a.publish_date)
      : a.publish_date.localeCompare(b.publish_date)
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">监管政策库</h2>
        <p className="text-sm text-terminal-muted mt-1">数据来源：jr.sz.gov.cn · gov.cn · 所有数据可溯源</p>
      </div>

      <Card>
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="搜索政策标题..." />
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === c ? 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30' : 'bg-terminal-bg text-terminal-muted border border-terminal-border hover:border-terminal-accent/30'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sources.map(s => (
              <button key={s} onClick={() => setSource(s)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${source === s ? 'bg-terminal-accent2/15 text-terminal-accent2 border border-terminal-accent2/30' : 'bg-terminal-bg text-terminal-muted border border-terminal-border'}`}>
                {s}
              </button>
            ))}
            <div className="flex-1" />
            <button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-terminal-bg border border-terminal-border text-xs text-terminal-muted hover:text-terminal-accent">
              <Calendar className="w-3 h-3" />{sortOrder === 'newest' ? '最新优先' : '最早优先'}
            </button>
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
                      <Calendar className="w-3 h-3" /><span>{policy.publish_date}</span>
                      <Globe className="w-3 h-3" /><span>{policy.data_source}</span>
                      <span>{policy.organization}</span>
                    </div>
                    <p className="text-sm text-terminal-muted mt-2 line-clamp-2">{policy.summary}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {expandedId === policy.id ? <ChevronUp className="w-5 h-5 text-terminal-accent" /> : <ChevronDown className="w-5 h-5 text-terminal-muted" />}
                  </div>
                </div>

                {expandedId === policy.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-terminal-border">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-terminal-muted">发布机构：</span>
                        <span className="text-sm text-terminal-text">{policy.organization}</span>
                      </div>
                      <div>
                        <span className="text-xs text-terminal-muted">发文日期：</span>
                        <span className="text-sm text-terminal-text">{policy.publish_date}</span>
                      </div>
                      <div>
                        <span className="text-xs text-terminal-muted">关键词：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {policy.keywords.map(k => <Badge key={k} label={k} variant="accent" />)}
                        </div>
                      </div>
                      {policy.summary && (
                        <div>
                          <span className="text-xs text-terminal-muted">摘要：</span>
                          <p className="text-sm text-terminal-text mt-1">{policy.summary}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-3 pt-2">
                        {policy.source_url && (
                          <a href={policy.source_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs" onClick={e => e.stopPropagation()}>
                            查看原文 <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                        {policy.pdf_url && (
                          <a href={policy.pdf_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs" onClick={e => e.stopPropagation()}>
                            PDF <FileText className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-terminal-muted">数据更新: {policy.updated_at} · 来源: {policy.data_source}</p>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-terminal-muted">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>未找到匹配的政策</p>
        </div>
      )}
    </div>
  )
}
