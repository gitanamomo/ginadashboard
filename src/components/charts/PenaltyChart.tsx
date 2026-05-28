import ReactECharts from 'echarts-for-react'
import type { Penalty } from '@/types'

export default function PenaltyChart({ penalties }: { penalties: Penalty[] }) {
  const sorted = [...penalties].sort((a, b) => b.amount - a.amount)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: '#131820',
      borderColor: '#1e2a3a',
      textStyle: { color: '#c8d6e5' },
      formatter: (params: { name: string; value: number }[]) => {
        const p = params[0]
        return `${p.name}<br/>处罚金额: ¥${(p.value / 10000).toFixed(0)}万`
      },
    },
    grid: { left: '3%', right: '10%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: sorted.map(p => p.institution.length > 8 ? p.institution.slice(0, 8) + '...' : p.institution),
      axisLabel: { color: '#5c6e80', fontSize: 10, rotate: 30 },
      axisLine: { lineStyle: { color: '#1e2a3a' } },
    },
    yAxis: {
      type: 'value' as const,
      name: '万元',
      axisLabel: {
        color: '#5c6e80',
        formatter: (v: number) => `${(v / 10000).toFixed(0)}`,
      },
      splitLine: { lineStyle: { color: '#1e2a3a', type: 'dashed' } },
    },
    series: [
      {
        type: 'bar' as const,
        data: sorted.map(p => ({
          value: p.amount,
          itemStyle: {
            color: p.riskLevel === 'critical' ? '#ff4757'
              : p.riskLevel === 'high' ? '#ffa502'
              : '#00aaff',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '60%',
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: '280px' }} opts={{ renderer: 'svg' }} />
}
