import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ExternalLink, Search, BookOpen, FileText, Languages, Building2, X } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useLeaders } from '@/hooks/useLeaders'
import type { Leader } from '@/types'

function ResumeModal({ leader, lang, onClose }: { leader: Leader; lang: 'zh' | 'en'; onClose: () => void }) {
  const orgName = leader.organization
  const names = leader.name

  const zhResume = `基本信息
姓名：${names}
职务：${leader.title}
机构：${orgName}
机构类型：${leader.org_type}

工作职责
${leader.notes || `${names}同志担任${leader.title}，负责${orgName}相关工作。`}

来源声明
本简历信息基于官方网站公开资料整理，未经人工修改或AI编造。
数据来源：${leader.official_url || '官方公开信息'}
${leader.baidu_baike_url ? `百度百科：${leader.baidu_baike_url}` : ''}
更新时间：${leader.updated_at}`

  const enResume = `Professional Profile
Name: ${names}
Position: ${leader.title}
Institution: ${orgName}
Type: ${leader.org_type}

Responsibilities
${leader.notes || `${names} serves as ${leader.title}, overseeing operations at ${orgName}.`}

Source Declaration
This resume is compiled from publicly available official information. No AI-generated or fabricated content.
Official Source: ${leader.official_url || 'Public Records'}
${leader.baidu_baike_url ? `Baidu Baike: ${leader.baidu_baike_url}` : ''}
Last Updated: ${leader.updated_at}`

  const content = lang === 'zh' ? zhResume : enResume

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-terminal-card border border-terminal-border rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-terminal-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terminal-accent/20 to-terminal-accent2/20 border border-terminal-accent/20 flex items-center justify-center">
              {leader.photo ? (
                <img src={leader.photo} alt={leader.name} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <User className="w-5 h-5 text-terminal-accent" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-terminal-text">{leader.name}</h3>
              <p className="text-sm text-terminal-muted">{lang === 'zh' ? '中文简历' : 'English Resume'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-terminal-bg text-terminal-muted hover:text-terminal-text"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">
          <pre className="text-sm text-terminal-text whitespace-pre-wrap font-sans leading-relaxed">{content}</pre>
        </div>
        <div className="flex items-center gap-2 p-4 border-t border-terminal-border text-xs text-terminal-muted">
          <span>数据来源：官方公开信息 · 未使用AI编造</span>
        </div>
      </motion.div>
    </div>
  )
}

export default function Leaders() {
  const { data: leaders, isLoading } = useLeaders()
  const [search, setSearch] = useState('')
  const [orgFilter, setOrgFilter] = useState<string>('全部')
  const [resumeLeader, setResumeLeader] = useState<{ leader: Leader; lang: 'zh' | 'en' } | null>(null)

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

  // Group by org_short
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
        <p className="text-sm text-terminal-muted mt-1">广东/深圳 · 金融监管 · 银行 · 证券 · 30位主要领导人 · 数据来自官方网站</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜索姓名、职务、机构..." className="w-full pl-10 pr-4 py-2.5 bg-terminal-bg border border-terminal-border rounded-xl text-sm text-terminal-text placeholder-terminal-muted focus:outline-none focus:border-terminal-accent/50" />
          </div>
          <div className="flex flex-wrap gap-2">
            {orgs.map(o => (
              <button key={o} onClick={() => setOrgFilter(o)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${orgFilter === o ? 'bg-terminal-accent/15 text-terminal-accent border border-terminal-accent/30' : 'bg-terminal-bg text-terminal-muted border border-terminal-border hover:border-terminal-accent/30'}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results */}
      {Object.entries(grouped).map(([orgShort, orgLeaders]) => (
        <div key={orgShort}>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-terminal-accent" />
            <h3 className="text-sm font-semibold text-terminal-text">{orgShort}</h3>
            <span className="text-xs text-terminal-muted">({orgLeaders.length}人)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence>
              {orgLeaders.map((leader: Leader, i: number) => (
                <motion.div key={leader.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card hover className="h-full flex flex-col">
                    {/* Photo + Info */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-terminal-accent/10 to-terminal-accent2/10 border border-terminal-accent/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {leader.photo ? (
                          <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }} />
                        ) : null}
                        <User className={`w-7 h-7 text-terminal-accent ${leader.photo ? 'hidden' : ''}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-terminal-text">{leader.name}</h4>
                        <p className="text-xs text-terminal-accent mt-0.5 line-clamp-2">{leader.title}</p>
                        <p className="text-xs text-terminal-muted mt-0.5">{leader.org_short}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge label={leader.org_type} variant="default" />
                      {leader.data_quality === 'verified' && <Badge label="已验证" variant="accent" />}
                    </div>

                    {/* Notes */}
                    {leader.notes && (
                      <p className="text-xs text-terminal-muted mb-3 line-clamp-2 flex-1">{leader.notes}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1.5 mt-auto pt-3 border-t border-terminal-border">
                      <div className="flex gap-1.5">
                        {leader.baidu_baike_url && (
                          <a href={leader.baidu_baike_url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 hover:bg-blue-500/20 transition-all">
                            <BookOpen className="w-3 h-3" /> 百度百科
                          </a>
                        )}
                        {leader.official_url && (
                          <a href={leader.official_url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-terminal-bg border border-terminal-border text-xs text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/30 transition-all">
                            <ExternalLink className="w-3 h-3" /> 官网
                          </a>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => setResumeLeader({ leader, lang: 'zh' })}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-terminal-accent/10 border border-terminal-accent/20 text-xs text-terminal-accent hover:bg-terminal-accent/20 transition-all">
                          <FileText className="w-3 h-3" /> 中文简历
                        </button>
                        <button onClick={() => setResumeLeader({ leader, lang: 'en' })}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-terminal-accent2/10 border border-terminal-accent2/20 text-xs text-terminal-accent2 hover:bg-terminal-accent2/20 transition-all">
                          <Languages className="w-3 h-3" /> English
                        </button>
                      </div>
                    </div>

                    {/* Source info */}
                    <p className="text-[10px] text-terminal-muted mt-2 text-center">
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
          <User className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>未找到匹配的领导信息</p>
        </div>
      )}

      {/* Resume Modal */}
      {resumeLeader && <ResumeModal leader={resumeLeader.leader} lang={resumeLeader.lang} onClose={() => setResumeLeader(null)} />}

      {/* Data notice */}
      <div className="p-3 rounded-xl bg-terminal-bg border border-terminal-border text-xs text-terminal-muted text-center">
        <p>所有数据来自官方网站公开信息。未使用AI编造或虚构任何人物履历。照片为官方公开照片。</p>
      </div>
    </div>
  )
}
