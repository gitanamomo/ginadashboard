import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Tag, ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import SearchBar from '@/components/ui/SearchBar'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { usePolicies } from '@/hooks/usePolicies'
import type { Policy, PolicyCategory, PolicySource } from '@/types'

const categories: { label: string; value: PolicyCategory | '全部' }[] = [
  { label: '全部', value: '全部' },
  { label: '银行监管', value: '银行监管' },
  { label: '证券监管', value: '证券监管' },
  { label: '跨境金融', value: '跨境金融' },
  { label: '金融科技', value: '金融科技' },
  { label: '绿色金融', value: '绿色金融' },
  { label: '货币政策', value: '货币政策' },
]

const sources: { label: string; value: PolicySource | '全部' }[] = [
  { label: '全部来源', value: '全部' },
  { label: '国家金融监督管理总局', value: '国家金融监督管理总局' },
  { label: '中国人民银行', value: '中国人民银行' },
  { label: '证监会', value: '证监会' },
  { label: '深圳金融局', value: '深圳金融局' },
  { label: '国务院', value: '国务院' },
  { label: '十五五规划', value: '十五五规划' },
]

export default function Policies() {
  const { data: policies, isLoading } = usePolicies()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('全部')
  const [source, setSource] = useState<string>('全部')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  if (isLoading) return <LoadingSpinner />

  let filtered = policies?.filter(p => {
    if (search && !p.title.includes(search) && !p.summary.includes(search) && !p.tags.some(t => t.includes(search))) return false
    if (category !== '全部' && p.category !== category) return false
    if (source !== '全部' && p.source !== source) return false
    return true
  }) ?? []

  filtered = [...filtered].sort((a, b) =>
    sortOrder === 'newest'
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">监管政策库</h2>
        <p className="text-sm text-terminal-muted mt-1">AI摘要 · 分类筛选 · 时间排序</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="搜索政策标题、关键词、摘要..." />
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === c.value
                    ? 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30'
                    : 'bg-terminal-bg text-terminal-muted border border-terminal-border hover:border-terminal-accent/30'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sources.map(s => (
              <button
                key={s.value}
                onClick={() => setSource(s.value)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  source === s.value
                    ? 'bg-terminal-accent2/15 text-terminal-accent2 border border-terminal-accent2/30'
                    : 'bg-terminal-bg text-terminal-muted border border-terminal-border'
                }`}
              >
                {s.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-terminal-bg border border-terminal-border text-xs text-terminal-muted hover:text-terminal-accent"
            >
              <Calendar className="w-3 h-3" />
              {sortOrder === 'newest' ? '最新优先' : '最早优先'}
            </button>
          </div>
        </div>
      </Card>

      {/* Policy List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((policy: Policy, i: number) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="cursor-pointer" onClick={() => setExpandedId(expandedId === policy.id ? null : policy.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <Badge label={policy.source} variant="info" />
                      <Badge label={policy.category} variant="accent" />
                      {policy.riskLevel === 'high' && <Badge label="重点关注" variant="danger" />}
                      {policy.riskLevel === 'medium' && <Badge label="关注" variant="warning" />}
                    </div>
                    <h4 className="text-base font-semibold text-terminal-text mb-1">{policy.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-terminal-muted">
                      <Calendar className="w-3 h-3" />
                      <span>{policy.date}</span>
                      <Tag className="w-3 h-3" />
                      <div className="flex gap-1">
                        {policy.tags.map(t => (
                          <span key={t} className="text-terminal-muted">#{t}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-terminal-muted mt-2 line-clamp-2">{policy.summary}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {expandedId === policy.id ? <ChevronUp className="w-5 h-5 text-terminal-accent" /> : <ChevronDown className="w-5 h-5 text-terminal-muted" />}
                  </div>
                </div>

                {/* Expanded AI Summary */}
                {expandedId === policy.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-terminal-border"
                  >
                    {policy.aiSummary && (
                      <div className="p-3 rounded-xl bg-terminal-accent/5 border border-terminal-accent/20 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-terminal-accent">AI 摘要分析</span>
                        </div>
                        <p className="text-sm text-terminal-text">{policy.aiSummary}</p>
                      </div>
                    )}
                    {policy.keywords && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {policy.keywords.map(k => (
                          <Badge key={k} label={k} variant="accent" />
                        ))}
                      </div>
                    )}
                    {policy.applicableInstitutions && (
                      <div className="mb-3">
                        <span className="text-xs text-terminal-muted">适用机构: </span>
                        {policy.applicableInstitutions.map(inst => (
                          <Badge key={inst} label={inst} variant="default" />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {policy.sourceUrl && (
                        <a
                          href={policy.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline text-xs"
                          onClick={e => e.stopPropagation()}
                        >
                          查看原文 <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                      {policy.pdfUrl && (
                        <a
                          href={policy.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline text-xs"
                          onClick={e => e.stopPropagation()}
                        >
                          PDF原文件 <FileText className="w-3 h-3 ml-1" />
                        </a>
                      )}
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
