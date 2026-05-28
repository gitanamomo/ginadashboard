import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Briefcase, MapPin, ExternalLink, ChevronRight } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
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

  const filtered = leaders?.filter(l =>
    !search ||
    l.name.includes(search) ||
    l.title.includes(search) ||
    l.organization.includes(search) ||
    l.tags.some(t => t.includes(search))
  ) ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text">领导人物库</h2>
          <p className="text-sm text-terminal-muted mt-1">金融监管领导 · 深圳金融局 · 一行两局 · 银行高管</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="搜索领导姓名、职务、机构..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((leader: Leader, i: number) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover onClick={() => navigate(`/leaders/${leader.id}`)}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terminal-accent/20 to-terminal-accent2/20 border border-terminal-accent/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-terminal-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-terminal-text">{leader.name}</h3>
                    <p className="text-sm text-terminal-muted mt-0.5 line-clamp-1">{leader.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-terminal-muted">
                      <MapPin className="w-3 h-3" />
                      <span>{leader.organization}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-terminal-muted flex-shrink-0" />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {leader.tags.map(tag => (
                    <Badge key={tag} label={tag} variant="default" />
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-terminal-border">
                  <div className="text-xs text-terminal-muted line-clamp-2">{leader.bio}</div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-terminal-muted">
                  <Briefcase className="w-3 h-3" />
                  <span>{leader.career.length} 项任职经历</span>
                  {leader.sourceUrl && (
                    <>
                      <span>·</span>
                      <ExternalLink className="w-3 h-3" />
                      <span>百科</span>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-terminal-muted">
          <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>未找到匹配的领导信息</p>
        </div>
      )}
    </div>
  )
}
