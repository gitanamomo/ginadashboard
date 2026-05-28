import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Briefcase, MapPin, ExternalLink, Calendar, Building2 } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useLeader } from '@/hooks/useLeaders'

export default function LeaderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: leader, isLoading } = useLeader(id ?? '')

  if (isLoading) return <LoadingSpinner />
  if (!leader) return (
    <div className="text-center py-20">
      <User className="w-16 h-16 mx-auto text-terminal-muted/30 mb-4" />
      <p className="text-terminal-muted">未找到该领导信息</p>
      <button onClick={() => navigate('/leaders')} className="btn-outline mt-4">返回人物库</button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/leaders')}
        className="flex items-center gap-2 text-sm text-terminal-muted hover:text-terminal-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回人物库
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card glow>
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-terminal-accent/20 to-terminal-accent2/20 border border-terminal-accent/20 flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-terminal-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-terminal-text">{leader.name}</h2>
              <p className="text-base text-terminal-accent mt-1">{leader.title}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-terminal-muted">
                <MapPin className="w-4 h-4" />
                <span>{leader.organization}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {leader.tags.map(tag => (
                  <Badge key={tag} label={tag} variant="accent" />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bio */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader title="人物简介" />
          <p className="text-sm text-terminal-text leading-relaxed">{leader.bio}</p>
        </Card>
      </motion.div>

      {/* Career Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader title="任职经历" subtitle={`共 ${leader.career.length} 项`} />
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-terminal-border" />
            <div className="space-y-4">
              {leader.career.map((event, i) => (
                <div key={i} className="relative flex items-start gap-4 pl-10">
                  <div className={`absolute left-[15px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                    i === 0 ? 'bg-terminal-accent border-terminal-accent' : 'bg-terminal-card border-terminal-border'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Calendar className="w-3.5 h-3.5 text-terminal-accent" />
                      <span className="text-sm font-mono text-terminal-accent">{event.year}</span>
                    </div>
                    <p className="text-sm text-terminal-text">{event.event}</p>
                    {event.organization && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-terminal-muted">
                        <Building2 className="w-3 h-3" />
                        <span>{event.organization}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Source Link */}
      {leader.sourceUrl && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-terminal-muted">
                <ExternalLink className="w-4 h-4" />
                <span>信息来源: 百度百科</span>
              </div>
              <a
                href={leader.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm"
              >
                查看百科原文
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
            <p className="text-xs text-terminal-muted mt-2">数据更新时间: {leader.updatedAt}</p>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
