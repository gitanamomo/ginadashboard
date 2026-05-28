// Types matching real data from official Chinese government websites.
// All data sourced from: nfra.gov.cn, pbc.gov.cn, jr.sz.gov.cn, csrc.gov.cn, szse.cn

export interface Leader {
  id: string
  name: string
  title: string
  organization: string
  org_short: string
  org_type: string
  photo: string
  photo_source: string
  baidu_baike_url: string
  official_url: string
  source_type: string
  data_quality: string
  notes: string
  updated_at: string
}

export interface Policy {
  id: string
  title: string
  organization: string
  source: string
  publish_date: string
  category: string
  summary: string
  keywords: string[]
  source_url: string
  pdf_url: string
  updated_at: string
  data_source: string
}

export interface Penalty {
  id: string
  institution: string
  institution_type: string
  penalty_type: string
  amount: string
  date: string
  reason: string
  region: string
  source: string
  source_url: string
  risk_level: string
  tags: string[]
  updated_at: string
  data_source: string
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
