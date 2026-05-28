import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ExternalLink, ChevronDown, Globe, FileText, ShoppingBasket, Download, X } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import SearchBar from '@/components/ui/SearchBar'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { usePolicies } from '@/hooks/usePolicies'
import { useAppStore } from '@/store/useStore'
import { downloadPolicyWord } from '@/services/wordDownload'
import type { Policy } from '@/types'

export default function Policies() {
  const { data: policies, isLoading } = usePolicies()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('全部')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { selectedPolicies, togglePolicy, clearPolicies, setPolicyData, policyData } = useAppStore()

  useEffect(() => {
    if (policies) setPolicyData(policies)
  }, [policies, setPolicyData])

  if (isLoading) return <LoadingSpinner />

  const categories = ['全部', ...new Set((policies ?? []).map(p => p.category))]

  let filtered = (policies ?? []).filter(p => {
    if (search && !p.title.includes(search) && !p.summary.includes(search) && !p.keywords.some(k => k.includes(search))) return false
    if (category !== '全部' && p.category !== category) return false
    return true
  })
  filtered.sort((a, b) => b.publish_date.localeCompare(a.publish_date))

  const selectedData = policyData.filter(p => selectedPolicies.includes(p.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold gradient-text">金融政策库</h2>
          <p className="text-base text-terminal-muted mt-1">☑ 勾选政策 → 加入政策篮 → 一键下载Word报告（含来源链接）</p>
        </div>
      </div>

      {/* Policy Basket Bar */}
      {selectedPolicies.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="sticky top-[72px] z-40">
          <Card glow className="!py-3 !px-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5 text-terminal-accent" />
                <span className="text-base font-semibold text-terminal-text">已选 {selectedPolicies.length} 条政策</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => downloadPolicyWord(selectedData)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-terminal-accent text-black font-semibold text-sm hover:opacity-90 transition-all">
                  <Download className="w-4 h-4" /> 下载Word报告
                </button>
                <button onClick={clearPolicies}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-terminal-bg border border-terminal-border text-sm text-terminal-muted hover:text-terminal-text">
                  <X className="w-4 h-4" /> 清空
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <Card>
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="搜索政策标题/关键词..." />
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${category === c ? 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30' : 'bg-terminal-bg text-terminal-muted border border-terminal-border hover:border-terminal-accent/30'}`}>{c}</button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((policy: Policy, i: number) => (
            <motion.div key={policy.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={`cursor-pointer transition-all ${selectedPolicies.includes(policy.id) ? 'border-terminal-accent/40 bg-terminal-accent/5' : ''}`}>
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={selectedPolicies.includes(policy.id)}
                    onChange={(e) => { e.stopPropagation(); togglePolicy(policy.id); }}
                    className="mt-1.5 w-5 h-5 rounded accent-terminal-accent cursor-pointer flex-shrink-0" />
                  <div className="flex-1 min-w-0" onClick={() => setExpandedId(expandedId === policy.id ? null : policy.id)}>
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <Badge label={policy.source} variant="info" />
                      <Badge label={policy.category} variant="accent" />
                      {policy.keywords.slice(0, 3).map(k => <Badge key={k} label={k} variant="default" />)}
                    </div>
                    <h4 className="text-base font-semibold text-terminal-text mb-1">{policy.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-terminal-muted">
                      <Calendar className="w-4 h-4" />{policy.publish_date}
                      <Globe className="w-4 h-4" />{policy.data_source}
                      {policy.relevance && <span className="text-terminal-accent">{policy.relevance}</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    {expandedId === policy.id ? <ChevronDown className="w-5 h-5 text-terminal-accent" /> : <ChevronDown className="w-5 h-5 text-terminal-muted rotate-[-90deg]" />}
                  </div>
                </div>

                {expandedId === policy.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-terminal-border">
                    <p className="text-base text-terminal-text mb-3 leading-relaxed">{policy.summary}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">{policy.keywords.map(k => <Badge key={k} label={k} variant="accent" />)}</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-terminal-muted">{policy.organization} · {policy.publish_date}</span>
                      {policy.source_url && (
                        <a href={policy.source_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm" onClick={e => e.stopPropagation()}>
                          原文 <ExternalLink className="w-4 h-4 ml-1" /></a>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); togglePolicy(policy.id); }}
                        className={`btn-outline text-sm ${selectedPolicies.includes(policy.id) ? '!border-terminal-accent !text-terminal-accent' : ''}`}>
                        {selectedPolicies.includes(policy.id) ? '✓ 已选' : '+ 加入政策篮'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && <div className="text-center py-20 text-terminal-muted"><FileText className="w-14 h-14 mx-auto mb-4 opacity-30" /><p className="text-lg">未找到匹配的政策</p></div>}

      <div className="text-center text-sm text-terminal-muted py-3 border-t border-terminal-border">所有政策来自官方网站 · 每条均可溯源 · 勾选即可下载Word报告</div>
    </div>
  )
}
