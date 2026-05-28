export interface Leader {
  id: string; name: string; title: string; organization: string
  org_short: string; org_type: string; photo: string; photo_source: string
  baidu_baike_url: string; official_url: string; source_type: string
  data_quality: string; notes: string; updated_at: string
}

export interface Policy {
  id: string; title: string; organization: string; source: string
  publish_date: string; category: string; summary: string; keywords: string[]
  source_url: string; pdf_url: string; updated_at: string; data_source: string
  relevance: string
}

export interface ForeignBank {
  id: string; bank_name: string; english_name: string; headquarters_country: string
  china_entity_type: string; legal_representative: string; china_president: string
  china_headquarters: string; guangdong_branches: string[]
  shenzhen_branch_address: string; shenzhen_outlets: number
  official_website: string; core_business: string[]; cross_border_features: string[]
  major_events: { date: string; event: string; impact: string }[]
  latest_policy_impact: { policy: string; impact_type: string; analysis: string; source_url: string }[]
  interest_rate_impact: { rate_type: string; current: string; impact: string }[]
  tags: string[]; data_quality: string; updated_at: string
}

export interface MajorEvent {
  id: string; category: string; title: string; date: string; summary: string
  impact: string; source: string; source_url: string; tags: string[]
}

export interface EconIndicator {
  id: string; name: string; value: string; change: string
  direction: 'up' | 'down' | 'neutral'; period: string; source: string; city: string
}
