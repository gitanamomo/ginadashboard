// AI summary service - ready for OpenAI / DeepSeek API integration
// Currently generates local summaries based on policy data

interface AISummaryRequest {
  text: string
  type: 'policy' | 'penalty' | 'leader'
}

export async function generateAISummary(_req: AISummaryRequest): Promise<string> {
  // TODO: Replace with OpenAI / DeepSeek API call
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4',
  //     messages: [{ role: 'user', content: req.text }],
  //   }),
  // })
  // return response.json()

  // For now, return a placeholder summary
  const summaries: Record<string, string> = {
    policy: '本政策反映了监管机构在金融改革方面的最新方向，建议关注相关合规要求和实施时间节点。',
    penalty: '该处罚案例提示相关机构应加强内控合规管理，重点关注监管红线领域。',
    leader: '该领导在金融监管领域具有丰富经验，其人事变动值得关注。',
  }

  return new Promise(resolve => {
    setTimeout(() => resolve(summaries[_req.type] || ''), 500)
  })
}

// Keyword extraction - ready for AI API integration
export async function extractKeywords(text: string): Promise<string[]> {
  // TODO: Integrate with AI API for real keyword extraction
  const commonKeywords = [
    '金融监管', '银行', '合规', '风险', '跨境',
    '科技金融', '绿色金融', '反洗钱', '外汇', '大湾区'
  ]
  return commonKeywords.filter(k => text.includes(k)).slice(0, 5)
}
