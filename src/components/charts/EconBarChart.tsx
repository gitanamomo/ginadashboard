import ReactECharts from 'echarts-for-react'
import type { EconIndicator } from '@/types'

export default function EconBarChart({ data }: { data: EconIndicator[] }) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: '#131820',
      borderColor: '#1e2a3a',
      textStyle: { color: '#c8d6e5' },
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: data.map(d => d.name),
      axisLabel: { color: '#5c6e80', fontSize: 10 },
      axisLine: { lineStyle: { color: '#1e2a3a' } },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: '#5c6e80' },
      splitLine: { lineStyle: { color: '#1e2a3a', type: 'dashed' } },
    },
    series: [
      {
        type: 'bar' as const,
        data: data.map(d => ({
          value: parseFloat(d.change.replace(/[^0-9.-]/g, '')) || 0,
          itemStyle: {
            color: d.direction === 'up' ? '#00d4aa' : d.direction === 'down' ? '#ff4757' : '#5c6e80',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '50%',
        label: {
          show: true,
          position: 'top' as const,
          color: '#c8d6e5',
          fontSize: 10,
          formatter: (_p: { value: number }) => {
            return data[0]?.change || ''
          },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: '250px' }} opts={{ renderer: 'svg' }} />
}
