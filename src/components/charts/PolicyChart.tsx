import ReactECharts from 'echarts-for-react'
import type { Policy } from '@/types'

export default function PolicyChart({ policies }: { policies: Policy[] }) {
  const categoryCounts: Record<string, number> = {}
  policies.forEach(p => {
    const cat = p.category || '未分类'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' as const, backgroundColor: '#131820', borderColor: '#1e2a3a', textStyle: { color: '#c8d6e5' } },
    legend: { bottom: 0, textStyle: { color: '#5c6e80', fontSize: 11 } },
    series: [{
      type: 'pie' as const, radius: ['55%', '80%'], center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: '#0a0e14', borderWidth: 3 },
      label: { show: false },
      emphasis: { label: { show: true, color: '#c8d6e5' }, scaleSize: 8 },
      data: Object.entries(categoryCounts).map(([name, value]) => ({ name, value })),
      color: ['#00d4aa', '#00aaff', '#a78bfa', '#ffa502', '#ff4757', '#2ed573', '#1e90ff', '#ff6b81'],
    }],
  }

  return <ReactECharts option={option} style={{ height: '280px' }} opts={{ renderer: 'svg' }} />
}
