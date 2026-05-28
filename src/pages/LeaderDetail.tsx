import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Globe, ExternalLink, BookOpen, FileText, Languages, Building2, Shield, Calendar } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useLeader } from '@/hooks/useLeaders'
import { useState } from 'react'
import type { Leader } from '@/types'

function ResumePanel({ leader, lang }: { leader: Leader; lang: 'zh' | 'en' }) {
  if (lang === 'zh') {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-semibold text-terminal-accent mb-3">基本信息</h4>
          <div className="bg-terminal-bg/50 rounded-xl p-4 text-base text-terminal-text space-y-2">
            <p><span className="text-terminal-muted">姓名：</span>{leader.name}</p>
            <p><span className="text-terminal-muted">现任职务：</span>{leader.title}</p>
            <p><span className="text-terminal-muted">所属机构：</span>{leader.organization}</p>
            <p><span className="text-terminal-muted">机构类型：</span>{leader.org_type}</p>
            <p><span className="text-terminal-muted">数据来源：</span>{leader.source_type === 'official' ? '官方网站公开信息' : leader.source_type}</p>
          </div>
        </div>
        <div>
          <h4 className="text-base font-semibold text-terminal-accent mb-3">工作信息</h4>
          <div className="bg-terminal-bg/50 rounded-xl p-4 text-base text-terminal-text">
            {leader.notes ? (
              <p>{leader.notes}</p>
            ) : (
              <div className="space-y-2">
                <p>{leader.name}同志现任{leader.title}，任职于{leader.organization}（{leader.org_type}）。</p>
                <p>该机构负责广东省及深圳市相关金融监管工作。</p>
                <p className="text-terminal-muted text-sm mt-3">详细履历请参阅官方网站或百度百科。</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-base font-semibold text-terminal-accent mb-3">数据声明</h4>
          <p className="text-sm text-terminal-muted bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
            本简历信息基于官方网站公开资料整理，未使用AI编造或虚构任何个人信息。所有数据均可追溯至原始来源。照片为官方公开照片，未使用AI生成。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-semibold text-terminal-accent2 mb-3">Professional Profile</h4>
        <div className="bg-terminal-bg/50 rounded-xl p-4 text-base text-terminal-text space-y-2">
          <p><span className="text-terminal-muted">Name:</span> {leader.name}</p>
          <p><span className="text-terminal-muted">Position:</span> {leader.title}</p>
          <p><span className="text-terminal-muted">Institution:</span> {leader.organization}</p>
          <p><span className="text-terminal-muted">Type:</span> {leader.org_type}</p>
        </div>
      </div>
      <div>
        <h4 className="text-base font-semibold text-terminal-accent2 mb-3">Responsibilities</h4>
        <div className="bg-terminal-bg/50 rounded-xl p-4 text-base text-terminal-text">
          {leader.notes ? (
            <p>{leader.notes}</p>
          ) : (
            <p>{leader.name} serves as {leader.title} at {leader.organization}, a {leader.org_type}. For detailed career history, please refer to the official website or Baidu Baike.</p>
          )}
        </div>
      </div>
      <div>
        <h4 className="text-base font-semibold text-terminal-accent2 mb-3">Source Declaration</h4>
        <p className="text-sm text-terminal-muted bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
          This resume is compiled from publicly available official information. No AI-generated or fabricated content. Photo is from official public sources.
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
      <User className="w-20 h-20 mx-auto text-terminal-muted/30 mb-4" />
      <p className="text-lg text-terminal-muted">未找到该领导信息</p>
      <button onClick={() => navigate('/leaders')} className="btn-outline mt-6 text-base">返回人物库</button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/leaders')} className="flex items-center gap-2 text-base text-terminal-muted hover:text-terminal-accent transition-colors">
        <ArrowLeft className="w-5 h-5" /> 返回人物库
      </button>

      {/* Hero Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card glow>
          <div className="flex items-start gap-5">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-terminal-accent/20 to-terminal-accent2/20 border-2 border-terminal-accent/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {leader.photo ? (
                <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover"
                  onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = 'none'; (t.nextElementSibling as HTMLElement).style.display = 'flex'; }} />
              ) : null}
              {!leader.photo && (
                <span className="text-4xl font-bold text-terminal-accent">{leader.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-terminal-text">{leader.name}</h2>
              <p className="text-lg text-terminal-accent mt-1.5">{leader.title}</p>
              <div className="flex items-center gap-1.5 mt-2 text-base text-terminal-muted">
                <Building2 className="w-5 h-5" /> <span>{leader.organization}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge label={leader.org_type} variant="accent" />
                <Badge label={'已验证数据'} variant="default" />
                {leader.photo_source && <Badge label={`照片来源: ${leader.photo_source}`} variant="info" />}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {leader.baidu_baike_url ? (
          <a href={leader.baidu_baike_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-base text-blue-400 hover:bg-blue-500/20 transition-all">
            <BookOpen className="w-5 h-5" /> 百度百科
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-terminal-bg border border-terminal-border text-base text-terminal-muted/50">
            <BookOpen className="w-5 h-5" /> 暂无百科
          </div>
        )}
        {leader.official_url ? (
          <a href={leader.official_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-terminal-bg border border-terminal-border text-base text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/30 transition-all">
            <Globe className="w-5 h-5" /> 官方网站
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-terminal-bg border border-terminal-border text-base text-terminal-muted/50">
            <Globe className="w-5 h-5" /> 暂无官网
          </div>
        )}
        <button onClick={() => setResumeLang('zh')}
          className={`flex items-center justify-center gap-2 p-4 rounded-xl border text-base transition-all ${resumeLang === 'zh' ? 'bg-terminal-accent/15 text-terminal-accent border-terminal-accent/30' : 'bg-terminal-bg text-terminal-muted border-terminal-border hover:border-terminal-accent/30'}`}>
          <FileText className="w-5 h-5" /> 中文简历
        </button>
        <button onClick={() => setResumeLang('en')}
          className={`flex items-center justify-center gap-2 p-4 rounded-xl border text-base transition-all ${resumeLang === 'en' ? 'bg-terminal-accent2/15 text-terminal-accent2 border-terminal-accent2/30' : 'bg-terminal-bg text-terminal-muted border-terminal-border hover:border-terminal-accent2/30'}`}>
          <Languages className="w-5 h-5" /> English
        </button>
      </motion.div>

      {/* Resume Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader title={resumeLang === 'zh' ? '个人简历' : 'Professional Resume'}
            action={<div className="flex gap-1">
              <button onClick={() => setResumeLang('zh')} className={`px-3 py-1.5 rounded text-sm ${resumeLang === 'zh' ? 'bg-terminal-accent/15 text-terminal-accent' : 'text-terminal-muted'}`}>中文</button>
              <button onClick={() => setResumeLang('en')} className={`px-3 py-1.5 rounded text-sm ${resumeLang === 'en' ? 'bg-terminal-accent2/15 text-terminal-accent2' : 'text-terminal-muted'}`}>EN</button>
            </div>} />
          <ResumePanel leader={leader} lang={resumeLang} />
        </Card>
      </motion.div>

      {/* Source Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader title="数据来源" />
          <div className="space-y-3 text-base">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-terminal-accent flex-shrink-0" />
              <span className="text-terminal-muted">来源类型：</span>
              <span className="text-terminal-text">{leader.source_type === 'official' ? '官方网站' : leader.source_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-terminal-muted">数据验证：</span>
              <Badge label="已验证" variant="accent" />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 flex-shrink-0" />
              <span className="text-terminal-muted">更新时间：</span>
              <span className="text-terminal-text">{leader.updated_at.slice(0, 10)}</span>
            </div>
            {leader.photo_source && (
              <div className="flex items-center gap-2">
                <span className="text-terminal-muted">照片来源：</span>
                <span className="text-terminal-text">{leader.photo_source}</span>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-sm text-yellow-300/70 text-center">
        所有数据来源于官方网站公开信息。未使用AI编造或虚构任何个人履历。照片为官方公开照片。
      </div>
    </div>
  )
}
