import type { Policy } from '@/types'

export function downloadPolicyWord(policies: Policy[]) {
  if (policies.length === 0) return

  const rows = policies.map((p, i) => `
    <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #ddd">
      <h3 style="color:#1a3a5c;margin:0 0 8px">${i + 1}. ${p.title}</h3>
      <p style="margin:4px 0;color:#555"><strong>发布机构：</strong>${p.organization}</p>
      <p style="margin:4px 0;color:#555"><strong>发布日期：</strong>${p.publish_date}</p>
      <p style="margin:4px 0;color:#555"><strong>分类：</strong>${p.category}</p>
      <p style="margin:4px 0;color:#555"><strong>关键词：</strong>${p.keywords.join('、')}</p>
      <p style="margin:8px 0;color:#333;line-height:1.8">${p.summary}</p>
      <p style="margin:4px 0;color:#1a73e8"><strong>原文链接：</strong><a href="${p.source_url}" style="color:#1a73e8">${p.source_url}</a></p>
      <p style="margin:4px 0;color:#888;font-size:12px">数据来源：${p.data_source} | 更新时间：${p.updated_at?.slice(0, 10)}</p>
    </div>
  `).join('\n')

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>政策报告</title>
      <style>
        body { font-family: 'SimSun', '宋体', serif; font-size: 14px; line-height: 1.8; padding: 40px; color: #333; }
        h2 { font-family: 'SimHei', '黑体', sans-serif; font-size: 20px; text-align: center; color: #1a3a5c; margin-bottom: 24px; }
        h3 { font-family: 'SimHei', '黑体', sans-serif; font-size: 15px; color: #1a3a5c; }
        a { color: #1a73e8; }
      </style>
    </head>
    <body>
      <h2>华南外资银行金融监管政策报告</h2>
      <p style="text-align:center;color:#888;margin-bottom:32px">生成时间：${new Date().toLocaleString('zh-CN')} | 共 ${policies.length} 条政策</p>
      ${rows}
      <hr style="margin-top:32px">
      <p style="text-align:center;color:#aaa;font-size:11px">
        Ginadashboard · 华南外资银行监管情报平台 · 所有数据来自官方网站 · 可溯源
      </p>
    </body>
    </html>
  `

  const blob = new Blob(['﻿' + html], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `政策报告_${new Date().toISOString().slice(0, 10)}.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
