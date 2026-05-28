import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ExternalLink, Search, BookOpen, FileText, Languages, Building2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useLeaders } from '@/hooks/useLeaders'
import type { Leader } from '@/types'

export default function Leaders() {
  const { data: leaders, isLoading } = useLeaders()
  const [search, setSearch] = useState('')
  const [orgFilter, setOrgFilter] = useState<string>('全部')

  if (isLoading) return <LoadingSpinner />

  const orgs = useMemo(() => {
    const set = new Set<string>()
    leaders?.forEach(l => set.add(l.org_short))
    return ['全部', ...Array.from(set)]
  }, [leaders])

  const filtered = (leaders ?? []).filter(l => {
    if (search && !l.name.includes(search) && !l.title.includes(search) && !l.organization.includes(search) && !l.org_short.includes(search)) return false
    if (orgFilter !== '全部' && l.org_short !== orgFilter) return false
    return true
  })

  const grouped = useMemo(() => {
    const map: Record<string, Leader[]> = {}
    filtered.forEach(l => {
      if (!map[l.org_short]) map[l.org_short] = []
      map[l.org_short].push(l)
    })
    return map
  }, [filtered])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">高级监管人物库</h2>
        <p className="text-base text-terminal-muted mt-1">广东/深圳 · 金融监管 · 银行 · 证券 · {leaders?.length ?? 0}位主要领导人 · 数据来自官方网站</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terminal-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜索姓名、职务、机构..." className="w-full pl-10 pr-4 py-3 bg-terminal-bg border border-terminal-border rounded-xl text-base text-terminal-text placeholder-terminal-muted focus:outline-none focus:border-terminal-accent/50" />
          </div>
          <div className="flex flex-wrap gap-2">
            {orgs.map(o => (
              <button key={o} onClick={() => setOrgFilter(o)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${orgFilter === o ? 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30' : 'bg-terminal-bg text-terminal-muted border border-terminal-border hover:border-terminal-accent/30'}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results by organization */}
      {Object.entries(grouped).map(([orgShort, orgLeaders]) => (
        <div key={orgShort}>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-terminal-accent" />
            <h3 className="text-base font-semibold text-terminal-text">{orgShort}</h3>
            <span className="text-sm text-terminal-muted">({orgLeaders.length}人)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {orgLeaders.map((leader: Leader, i: number) => (
                <motion.div key={leader.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card hover className="h-full flex flex-col p-5">
                    {/* Photo + Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-terminal-accent/10 to-terminal-accent2/10 border-2 border-terminal-accent/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {leader.photo ? (
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover"
                            onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = 'none'; (t.nextElementSibling as HTMLElement).style.display = 'flex'; }} />
                        ) : null}
                        {!leader.photo && (
                          <span className="text-2xl font-bold text-terminal-accent">{leader.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-terminal-text">{leader.name}</h4>
                        <p className="text-sm text-terminal-accent mt-1 line-clamp-2">{leader.title}</p>
                        <p className="text-sm text-terminal-muted mt-1">{leader.org_short}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge label={leader.org_type} variant="default" />
                      {leader.data_quality === 'verified' && <Badge label="已验证" variant="accent" />}
                    </div>

                    {/* Notes */}
                    {leader.notes && (
                      <p className="text-sm text-terminal-muted mb-4 line-clamp-2 flex-1">{leader.notes}</p>
                    )}
                    {!leader.notes && <div className="flex-1" />}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-terminal-border">
                      <div className="flex gap-2">
                        {leader.baidu_baike_url ? (
                          <a href={leader.baidu_baike_url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 hover:bg-blue-500/20 transition-all">
                            <BookOpen className="w-4 h-4" /> 百度百科
                          </a>
                        ) : (
                          <span className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-terminal-bg border border-terminal-border text-sm text-terminal-muted/40">
                            <BookOpen className="w-4 h-4" /> 暂无
                          </span>
                        )}
                        {leader.official_url ? (
                          <a href={leader.official_url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-terminal-bg border border-terminal-border text-sm text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/30 transition-all">
                            <ExternalLink className="w-4 h-4" /> 官网
                          </a>
                        ) : (
                          <span className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-terminal-bg border border-terminal-border text-sm text-terminal-muted/40">
                            <ExternalLink className="w-4 h-4" /> 暂无
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <a href={`/ginadashboard/leaders/${leader.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-terminal-accent/10 border border-terminal-accent/20 text-sm text-terminal-accent hover:bg-terminal-accent/20 transition-all">
                          <FileText className="w-4 h-4" /> 中文简历
                        </a>
                        <a href={`/ginadashboard/leaders/${leader.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-terminal-accent2/10 border border-terminal-accent2/20 text-sm text-terminal-accent2 hover:bg-terminal-accent2/20 transition-all">
                          <Languages className="w-4 h-4" /> English
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-terminal-muted mt-3 text-center">
                      {leader.photo_source || '官方公开信息'} · {leader.updated_at.slice(0, 10)}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-terminal-muted">
          <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">未找到匹配的领导信息</p>
        </div>
      )}

      <div className="p-4 rounded-xl bg-terminal-bg border border-terminal-border text-sm text-terminal-muted text-center">
        所有数据来自官方网站公开信息。未使用AI编造或虚构任何人物履历。照片为官方公开照片（缺失照片将陆续补充）。
      </div>
    </div>
  )
}
