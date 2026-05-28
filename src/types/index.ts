export interface Leader {
  id: string
  name: string
  title: string
  organization: string
  avatar?: string
  bio: string
  career: CareerEvent[]
  tags: string[]
  sourceUrl?: string
  updatedAt: string
}

export interface CareerEvent {
  year: string
  event: string
  organization?: string
}

export interface Policy {
  id: string
  title: string
  source: PolicySource
  date: string
  category: PolicyCategory
  tags: string[]
  summary: string
  aiSummary?: string
  keywords?: string[]
  applicableInstitutions?: string[]
  riskLevel?: 'low' | 'medium' | 'high'
  sourceUrl: string
  pdfUrl?: string
}

export type PolicySource =
  | '国家金融监督管理总局'
  | '中国人民银行'
  | '证监会'
  | '深圳金融局'
  | '深圳政府'
  | '国务院'
  | '十五五规划'
  | '其他'

export type PolicyCategory =
  | '银行监管'
  | '证券监管'
  | '保险监管'
  | '跨境金融'
  | '金融科技'
  | '普惠金融'
  | '绿色金融'
  | '货币政策'
  | '人事任免'
  | '其他'

export interface Penalty {
  id: string
  institution: string
  institutionType: string
  penaltyType: string
  amount: number
  date: string
  reason: string
  region: string
  source: string
  sourceUrl: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
}

export interface EconIndicator {
  id: string
  name: string
  value: string
  change: string
  direction: 'up' | 'down' | 'neutral'
  period: string
  source: string
}

export interface RegNews {
  id: string
  title: string
  date: string
  source: string
  summary: string
  tags: string[]
  url: string
}
