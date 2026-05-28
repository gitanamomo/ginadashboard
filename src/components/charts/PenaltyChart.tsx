import ReactECharts from 'echarts-for-react'
import type { Penalty } from '@/types'

export default function PenaltyChart({ penalties }: { penalties: Penalty[] }) {
  // Count by risk level
  const counts: Record<string, number> = {}
  penalties.forEach(p => {
    const level = p.risk_level || 'unknown'
    counts[level] = (counts[level] || 0) + 1
  })

  const levelLabels: Record<string, string> = {
    critical: '严重', high: '较高', medium: '一般', low: '低', unknown: '未知',
  }
  const levelColors: Record<string, string> = {
    critical: '#ff4757', high: '#ffa502', medium: '#00aaff', low: '#5c6e80', unknown: '#1e2a3a',
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' as const, backgroundColor: '#131820', borderColor: '#1e2a3a', textStyle: { color: '#c8d6e5' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: Object.keys(counts).map(k => levelLabels[k] || k),
      axisLabel: { color: '#5c6e80', fontSize: 11 },
      axisLine: { lineStyle: { color: '#1e2a3a' } },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: '#5c6e80' },
      splitLine: { lineStyle: { color: '#1e2a3a', type: 'dashed' } },
    },
    series: [{
      type: 'bar' as const,
      data: Object.entries(counts).map(([k, v]) => ({
        value: v,
        itemStyle: { color: levelColors[k] || '#5c6e80', borderRadius: [4, 4, 0, 0] },
      })),
      barWidth: '50%',
    }],
  }

  return <ReactECharts option={option} style={{ height: '280px' }} opts={{ renderer: 'svg' }} />
}
