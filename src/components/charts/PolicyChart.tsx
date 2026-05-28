import ReactECharts from 'echarts-for-react'
import type { Policy } from '@/types'

export default function PolicyChart({ policies }: { policies: Policy[] }) {
  const catCounts: Record<string, number> = {}
  policies.forEach(p => {
    const cat = p.category || '未分类'
    catCounts[cat] = (catCounts[cat] || 0) + 1
  })

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' as const, backgroundColor: '#131820', borderColor: '#1e2a3a', textStyle: { color: '#c8d6e5' } },
    legend: { bottom: 0, textStyle: { color: '#5c6e80', fontSize: 10 } },
    series: [{
      type: 'pie' as const, radius: ['50%', '75%'], center: ['50%', '45%'],
      itemStyle: { borderRadius: 4, borderColor: '#0a0e14', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, color: '#c8d6e5', fontSize: 12 }, scaleSize: 6 },
      data: Object.entries(catCounts).map(([name, value]) => ({ name, value })),
      color: ['#00d4aa', '#00aaff', '#a78bfa', '#ffa502', '#ff4757', '#2ed573'],
    }],
  }

  return <ReactECharts option={option} style={{ height: '240px' }} opts={{ renderer: 'svg' }} />
}
