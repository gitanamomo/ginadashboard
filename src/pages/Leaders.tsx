import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Globe, ExternalLink, ChevronRight, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import SearchBar from '@/components/ui/SearchBar'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useLeaders } from '@/hooks/useLeaders'
import type { Leader } from '@/types'

export default function Leaders() {
  const navigate = useNavigate()
  const { data: leaders, isLoading } = useLeaders()
  const [search, setSearch] = useState('')

  if (isLoading) return <LoadingSpinner />

  const filtered = (leaders ?? []).filter(l =>
    !search || l.name.includes(search) || l.title.includes(search) || l.organization.includes(search)
  )

  const pbocLeaders = filtered.filter(l => l.data_source === 'pbc.gov.cn')
  const szLeaders = filtered.filter(l => l.data_source === 'jr.sz.gov.cn')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">领导信息</h2>
        <p className="text-sm text-terminal-muted mt-1">数据来源：pbc.gov.cn · jr.sz.gov.cn · 仅包含官网公开信息</p>
      </div>

      <div className="w-full sm:w-72">
        <SearchBar value={search} onChange={setSearch} placeholder="搜索..." />
      </div>

      {/* Data quality notice */}
      <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-300/80">
          <p className="font-medium">数据声明</p>
          <p>本页面仅展示从官网公开页面提取的领导职务信息。未包含个人简历、履历等详情。所有数据均可溯源至原网站。</p>
        </div>
      </div>

      {/* PBoC Section */}
      {pbocLeaders.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-terminal-muted mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" /> 中国人民银行 · pbc.gov.cn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {pbocLeaders.map((leader: Leader, i: number) => (
                <motion.div key={leader.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card hover>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terminal-accent/20 to-terminal-accent2/20 border border-terminal-accent/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-terminal-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-terminal-text line-clamp-1">{leader.name}</h4>
                        <p className="text-xs text-terminal-muted mt-0.5 line-clamp-2">{leader.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-terminal-muted">
                          <span>{leader.organization}</span>
                        </div>
                      </div>
                      {leader.source_url && (
                        <a href={leader.source_url} target="_blank" rel="noopener noreferrer"
                          className="flex-shrink-0 text-terminal-muted hover:text-terminal-accent">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <Badge label={leader.data_source} variant="default" />
                      <Badge label={leader.data_quality === 'official_listing_only' ? '官网公开' : '引用'} variant="info" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* SZ Finance Section */}
      {szLeaders.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-terminal-muted mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" /> 深圳市地方金融监督管理局 · jr.sz.gov.cn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {szLeaders.map((leader: Leader, i: number) => (
              <motion.div key={leader.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card hover onClick={() => leader.source_url ? window.open(leader.source_url, '_blank') : undefined}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-terminal-bg border border-terminal-border flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-terminal-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-terminal-text line-clamp-1">{leader.name}</h4>
                      <p className="text-xs text-terminal-muted mt-0.5">{leader.organization}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-terminal-muted flex-shrink-0" />
                  </div>
                  <div className="mt-2">
                    <Badge label={leader.data_source} variant="default" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-terminal-muted">
          <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>未找到匹配的领导信息</p>
        </div>
      )}
    </div>
  )
}
