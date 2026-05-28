import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Globe, ExternalLink, AlertCircle } from 'lucide-react'
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
      <p className="text-terminal-muted">未找到该信息</p>
      <button onClick={() => navigate('/leaders')} className="btn-outline mt-4">返回</button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/leaders')} className="flex items-center gap-2 text-sm text-terminal-muted hover:text-terminal-accent transition-colors">
        <ArrowLeft className="w-4 h-4" /> 返回
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
                <Globe className="w-4 h-4" /> <span>{leader.organization}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge label={leader.data_source} variant="accent" />
                <Badge label={leader.data_quality === 'official_listing_only' ? '官网公开信息' : '信息'} variant="default" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Data quality notice */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-300 font-medium">数据声明</p>
            <p className="text-xs text-yellow-300/70 mt-1">此信息仅包含从官方网站公开页面提取的内容。未编造或猜测任何个人履历、任职经历等信息。</p>
            {leader.notes && <p className="text-xs text-yellow-300/70 mt-1">{leader.notes}</p>}
          </div>
        </div>
      </motion.div>

      {/* Organization */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card><CardHeader title="所属机构" /><p className="text-sm text-terminal-text">{leader.organization}</p></Card>
      </motion.div>

      {/* Source Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader title="数据来源" />
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-terminal-muted">来源机构：</span>
              <span className="text-terminal-text">{leader.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-terminal-muted">数据渠道：</span>
              <span className="text-terminal-text">{leader.data_source}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-terminal-muted">更新时间：</span>
              <span className="text-terminal-text">{leader.updated_at}</span>
            </div>
            {leader.source_url && (
              <a href={leader.source_url} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex text-xs mt-2">
                查看官网原文 <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
