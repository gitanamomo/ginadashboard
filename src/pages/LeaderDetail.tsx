import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Globe, ExternalLink, BookOpen, FileText, Languages, Building2, Shield, Calendar } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useLeader } from '@/hooks/useLeaders'
import { useState } from 'react'

function ResumePanel({ leader, lang }: { leader: NonNullable<ReturnType<typeof useLeader>['data']>; lang: 'zh' | 'en' }) {
  if (lang === 'zh') {
    return (
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-terminal-accent mb-2">基本信息</h4>
          <div className="bg-terminal-bg/50 rounded-xl p-3 text-sm text-terminal-text space-y-1">
            <p>姓名：{leader.name}</p>
            <p>职务：{leader.title}</p>
            <p>机构：{leader.organization}</p>
            <p>机构类型：{leader.org_type}</p>
          </div>
        </div>
        {leader.notes && (
          <div>
            <h4 className="text-sm font-semibold text-terminal-accent mb-2">工作职责</h4>
            <p className="text-sm text-terminal-text bg-terminal-bg/50 rounded-xl p-3">{leader.notes}</p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-terminal-accent mb-2">来源声明</h4>
          <p className="text-xs text-terminal-muted bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
            本简历基于官方网站公开资料整理。未使用AI编造或虚构任何个人信息。所有数据均可追溯至原始来源。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-terminal-accent2 mb-2">Professional Profile</h4>
        <div className="bg-terminal-bg/50 rounded-xl p-3 text-sm text-terminal-text space-y-1">
          <p><span className="text-terminal-muted">Name:</span> {leader.name}</p>
          <p><span className="text-terminal-muted">Position:</span> {leader.title}</p>
          <p><span className="text-terminal-muted">Institution:</span> {leader.organization}</p>
          <p><span className="text-terminal-muted">Type:</span> {leader.org_type}</p>
        </div>
      </div>
      {leader.notes && (
        <div>
          <h4 className="text-sm font-semibold text-terminal-accent2 mb-2">Responsibilities</h4>
          <p className="text-sm text-terminal-text bg-terminal-bg/50 rounded-xl p-3">{leader.notes}</p>
        </div>
      )}
      <div>
        <h4 className="text-sm font-semibold text-terminal-accent2 mb-2">Source Declaration</h4>
        <p className="text-xs text-terminal-muted bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
          This resume is compiled from publicly available official information only. No AI-generated or fabricated content. All data is traceable to original sources.
        </p>
      </div>
    </div>
  )
}

export default function LeaderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: leader, isLoading } = useLeader(id ?? '')
  const [resumeLang, setResumeLang] = useState<'zh' | 'en'>('zh')

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
      <button onClick={() => navigate('/leaders')} className="flex items-center gap-2 text-sm text-terminal-muted hover:text-terminal-accent">
        <ArrowLeft className="w-4 h-4" /> 返回人物库
      </button>

      {/* Hero Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card glow>
          <div className="flex items-start gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-terminal-accent/20 to-terminal-accent2/20 border border-terminal-accent/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {leader.photo ? (
                <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-terminal-accent" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-terminal-text">{leader.name}</h2>
              <p className="text-base text-terminal-accent mt-1">{leader.title}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-terminal-muted">
                <Building2 className="w-4 h-4" /> <span>{leader.organization}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge label={leader.org_type} variant="accent" />
                <Badge label={leader.data_quality === 'verified' ? '已验证数据' : leader.data_quality} variant="default" />
                {leader.photo_source && <Badge label={`照片: ${leader.photo_source}`} variant="info" />}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {leader.baidu_baike_url && (
          <a href={leader.baidu_baike_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 hover:bg-blue-500/20 transition-all">
            <BookOpen className="w-4 h-4" /> 百度百科
          </a>
        )}
        {leader.official_url && (
          <a href={leader.official_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-terminal-bg border border-terminal-border text-sm text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/30 transition-all">
            <Globe className="w-4 h-4" /> 官方网站
          </a>
        )}
        <button onClick={() => setResumeLang('zh')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm transition-all ${resumeLang === 'zh' ? 'bg-terminal-accent/15 text-terminal-accent border-terminal-accent/30' : 'bg-terminal-bg text-terminal-muted border-terminal-border hover:border-terminal-accent/30'}`}>
          <FileText className="w-4 h-4" /> 中文简历
        </button>
        <button onClick={() => setResumeLang('en')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm transition-all ${resumeLang === 'en' ? 'bg-terminal-accent2/15 text-terminal-accent2 border-terminal-accent2/30' : 'bg-terminal-bg text-terminal-muted border-terminal-border hover:border-terminal-accent2/30'}`}>
          <Languages className="w-4 h-4" /> English
        </button>
      </motion.div>

      {/* Resume */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader title={resumeLang === 'zh' ? '中文简历' : 'English Resume'}
            action={<div className="flex gap-1">
              <button onClick={() => setResumeLang('zh')} className={`px-2 py-1 rounded text-xs ${resumeLang === 'zh' ? 'bg-terminal-accent/15 text-terminal-accent' : 'text-terminal-muted'}`}>中文</button>
              <button onClick={() => setResumeLang('en')} className={`px-2 py-1 rounded text-xs ${resumeLang === 'en' ? 'bg-terminal-accent2/15 text-terminal-accent2' : 'text-terminal-muted'}`}>EN</button>
            </div>} />
          <ResumePanel leader={leader} lang={resumeLang} />
        </Card>
      </motion.div>

      {/* Source Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader title="数据来源" />
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-terminal-accent" />
              <span className="text-terminal-muted">来源类型：</span>
              <span className="text-terminal-text">{leader.source_type === 'official' ? '官方网站' : leader.source_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-terminal-muted">数据质量：</span>
              <Badge label={leader.data_quality === 'verified' ? '已验证' : leader.data_quality} variant="accent" />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-terminal-muted">更新时间：</span>
              <span className="text-terminal-text">{leader.updated_at}</span>
            </div>
            {leader.photo_source && (
              <div className="flex items-center gap-2">
                <span className="text-terminal-muted">照片来源：</span>
                <span className="text-terminal-text">{leader.photo_source}</span>
              </div>
            )}
            {leader.baidu_baike_url && (
              <a href={leader.baidu_baike_url} target="_blank" rel="noopener noreferrer"
                className="btn-outline inline-flex text-xs mt-2">
                <BookOpen className="w-3 h-3 mr-1" /> 百度百科
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
            {leader.official_url && (
              <a href={leader.official_url} target="_blank" rel="noopener noreferrer"
                className="btn-outline inline-flex text-xs mt-2 ml-2">
                <Globe className="w-3 h-3 mr-1" /> 官方网站
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Ethical notice */}
      <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-300/70 text-center">
        所有数据来源于官方网站公开信息。未使用AI编造、虚构或猜测任何个人履历。照片为官方公开照片，未使用AI生成。
      </div>
    </div>
  )
}
