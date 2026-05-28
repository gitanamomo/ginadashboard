import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Globe, MapPin, ExternalLink, TrendingUp, AlertTriangle, Zap, DollarSign, Shield } from 'lucide-react'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useForeignBank } from '@/hooks/useForeignBanks'

const flags: Record<string, string> = { '英国': '🇬🇧', '美国': '🇺🇸', '中国香港': '🇭🇰', '新加坡': '🇸🇬', '德国': '🇩🇪', '法国': '🇫🇷', '日本': '🇯🇵' }

export default function ForeignBankDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: bank, isLoading } = useForeignBank(id ?? '')

  if (isLoading) return <LoadingSpinner />
  if (!bank) return (
    <div className="text-center py-20"><Building2 className="w-16 h-16 mx-auto text-terminal-muted/30 mb-4" />
      <p className="text-terminal-muted">未找到该银行信息</p>
      <button onClick={() => navigate('/banks')} className="btn-outline mt-4">返回</button></div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate('/banks')} className="flex items-center gap-2 text-sm text-terminal-muted hover:text-terminal-accent"><ArrowLeft className="w-4 h-4" /> 返回银行数据库</button>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card glow>
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="text-4xl">{flags[bank.headquarters_country] || '🏦'}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-terminal-text">{bank.bank_name}</h2>
              <p className="text-sm text-terminal-muted">{bank.english_name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge label={`总部: ${bank.headquarters_country}`} variant="info" />
                <Badge label={bank.china_entity_type} variant="accent" />
                <Badge label={`中国总部: ${bank.china_headquarters}`} variant="default" />
              </div>
            </div>
            {bank.official_website && (
              <a href={bank.official_website} target="_blank" rel="noopener noreferrer" className="btn-outline flex-shrink-0"><Globe className="w-4 h-4 mr-1" /> 官网</a>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Key People + Branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card><CardHeader title="关键人员" />
            <div className="space-y-2 text-sm">
              <div><span className="text-terminal-muted">法定代表人：</span><span className="text-terminal-text">{bank.legal_representative}</span></div>
              <div><span className="text-terminal-muted">中国区总裁：</span><span className="text-terminal-text">{bank.china_president}</span></div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card><CardHeader title="广东分支机构" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-terminal-accent" /><span className="text-terminal-text">深圳分行：{bank.shenzhen_branch_address}</span></div>
              <div className="flex items-center gap-2"><span className="text-terminal-muted">深圳网点数：</span><span className="text-terminal-text font-bold">{bank.shenzhen_outlets}</span></div>
              <div className="flex flex-wrap gap-1">{(bank.guangdong_branches ?? []).map(b => <Badge key={b} label={b} variant="accent" />)}</div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Business + Cross-border */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card><CardHeader title="核心业务" /><div className="flex flex-wrap gap-2">{bank.core_business.map(cb => <Badge key={cb} label={cb} variant="default" />)}</div></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card><CardHeader title="跨境特色" /><div className="flex flex-wrap gap-2">{bank.cross_border_features.map(cf => <Badge key={cf} label={cf} variant="accent" />)}</div></Card>
        </motion.div>
      </div>

      {/* Major Events */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card><CardHeader title="重大事件" subtitle="最近动态" />
          <div className="space-y-3">
            {bank.major_events.map((evt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-terminal-bg/50 border border-terminal-border">
                <Zap className={`w-4 h-4 mt-0.5 flex-shrink-0 ${evt.impact === '利好' ? 'text-terminal-accent' : evt.impact.includes('挑战') ? 'text-yellow-400' : 'text-terminal-muted'}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1"><span className="text-xs text-terminal-muted">{evt.date}</span><Badge label={evt.impact} variant={evt.impact === '利好' ? 'accent' : evt.impact.includes('挑战') ? 'warning' : 'default'} /></div>
                  <p className="text-sm text-terminal-text">{evt.event}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Policy Impact Analysis */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card><CardHeader title="政策影响分析" subtitle="基于真实政策的利好/利差分析" />
          <div className="space-y-4">
            {bank.latest_policy_impact.map((pi, i) => (
              <div key={i} className="p-4 rounded-xl bg-terminal-bg/50 border border-terminal-border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-4 h-4 ${pi.impact_type === '利好' ? 'text-terminal-accent' : pi.impact_type.includes('挑战') ? 'text-yellow-400' : 'text-terminal-muted'}`} />
                  <span className="text-sm font-semibold text-terminal-text">{pi.policy}</span>
                  <Badge label={pi.impact_type} variant={pi.impact_type === '利好' ? 'accent' : pi.impact_type.includes('挑战') ? 'warning' : 'default'} />
                </div>
                <p className="text-sm text-terminal-muted mb-2">{pi.analysis}</p>
                {pi.source_url && <a href={pi.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-terminal-accent hover:underline inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" /> 原始来源</a>}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Interest Rate Impact */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card><CardHeader title="利率影响分析" subtitle="当前利率环境对银行业务的影响" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {bank.interest_rate_impact.map((ir, i) => (
              <div key={i} className="p-3 rounded-xl bg-terminal-bg/50 border border-terminal-border">
                <div className="flex items-center gap-1 mb-1"><DollarSign className="w-4 h-4 text-yellow-400" /><span className="text-sm font-semibold text-terminal-text">{ir.rate_type}</span></div>
                <div className="text-lg font-bold font-mono text-terminal-text mt-1">{ir.current}</div>
                <p className="text-xs text-terminal-muted mt-1">{ir.impact}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Tags + Source */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-terminal-accent" />
              <span className="text-sm text-terminal-muted">数据质量：</span>
              <Badge label={bank.data_quality === 'verified' ? '已验证' : bank.data_quality} variant="accent" />
              <span className="text-xs text-terminal-muted">更新：{bank.updated_at.slice(0, 10)}</span>
            </div>
            <div className="flex flex-wrap gap-2">{bank.tags.map(t => <Badge key={t} label={t} variant="info" />)}</div>
          </div>
        </Card>
      </motion.div>

      <div className="text-center text-[10px] text-terminal-muted py-3 border-t border-terminal-border">所有数据来自官方网站公开信息。未使用AI编造或虚构银行数据。分析基于真实政策原文。</div>
    </div>
  )
}
