import https from 'https';

const API_KEY = process.env.DEEPSEEK_API_KEY || '';
const API_BASE = 'https://api.deepseek.com/v1';
const MODEL = 'deepseek-v4-pro';

// Custom fetch that bypasses undici connection issues
function apiFetch(url: string, options: { body: string; headers: Record<string, string> }): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = options.body;
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        ...options.headers,
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 60000,
    }, (res) => {
      let body = '';
      res.on('data', (chunk: Buffer) => { body += chunk.toString(); });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error(`Invalid JSON: ${body.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
    req.write(data);
    req.end();
  });
}

interface FoodPreferences {
  foodTypes: string[];
  scene: string;
  budget: string;
  styles: string[];
}

interface RecommendInput {
  city: string;
  preferences: FoodPreferences;
  searchResults: { title: string; author: string; likes: string; url: string }[];
}

const SYSTEM_PROMPT = `你是一位资深美食推荐专家，深耕中国餐饮行业多年。你的推荐风格温暖、专业、有洞察力。

用户会告诉你他的城市、美食偏好，以及从真实食客笔记中收集的信息。你需要：

1. 从这些笔记中筛选出最匹配用户偏好的 3-5 家餐厅/美食
2. 结合用户偏好维度（类型/场景/预算/风格），给出合理的推荐理由
3. 如果某些笔记明显是广告或有刷好评嫌疑，作为避坑提示

回复格式要求用JSON：
{
  "summary": "100字以内的推荐总结，有温度，体现对用户偏好的理解",
  "recommendations": [
    {"title": "店名或笔记标题", "reason": "30字推荐理由，关联偏好维度", "tags": ["标签1", "标签2"], "match_score": 95}
  ],
  "tips": "一条避坑提示，如果没有可疑内容则留空"
}

关键原则：
- 每个推荐必须来自提供的真实笔记数据，不能凭空编造
- match_score 表示与用户偏好匹配度，1-100
- summary 要体现对用户偏好的理解`;

export async function getRecommendations(input: RecommendInput) {
  const { city, preferences, searchResults } = input;

  if (searchResults.length === 0) {
    return {
      summary: `很遗憾，在${city}暂时没有找到完全匹配「${preferences.foodTypes.join('、')}」偏好的推荐。试试调整口味或换个城市？`,
      recommendations: [],
      tips: '',
    };
  }

  const resultsText = searchResults
    .map((r, i) => `${i + 1}. 「${r.title}」— @${r.author} (${r.likes}赞)`)
    .join('\n');

  const userMessage = `城市：${city}
美食偏好：${preferences.foodTypes.join('、')} | ${preferences.scene} | ${preferences.budget} | ${preferences.styles.join('、')}

来自真实食客的笔记：
${resultsText}

请分析并推荐。`;

  try {
    const data = await apiFetch(`${API_BASE}/chat/completions`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    const text = data.choices?.[0]?.message?.content || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || '',
        recommendations: parsed.recommendations || [],
        tips: parsed.tips || '',
      };
    }
    throw new Error('No JSON found in AI response');
  } catch (err) {
    console.error('[ai] DeepSeek API error:', err);
    // Fallback: smart template-based recommendation
    return buildFallbackRecommendation(city, preferences, searchResults);
  }
}

function buildFallbackRecommendation(
  city: string,
  prefs: FoodPreferences,
  results: { title: string; author: string; likes: string; url: string }[]
) {
  const sorted = [...results].sort((a, b) => {
    const la = parseFloat(a.likes.replace('万', '0000').replace('k', '000')) || 0;
    const lb = parseFloat(b.likes.replace('万', '0000').replace('k', '000')) || 0;
    return lb - la;
  });

  const top5 = sorted.slice(0, 5);
  const topTitles = top5.map((r) => `「${r.title}」`).join('、');

  return {
    summary: `根据你在${city}对${prefs.foodTypes.join('、')}的偏好（${prefs.scene}·${prefs.budget}），从${results.length}篇真实食客笔记中为你精选了${top5.length}个推荐：${topTitles}。这些推荐综合了笔记热度与你的口味偏好，建议优先尝试。`,
    recommendations: top5.map((r, i) => ({
      title: r.title,
      reason: `${r.likes}位食客点赞推荐，适合${prefs.scene}场景`,
      tags: prefs.foodTypes.slice(0, 3),
      match_score: 90 - i * 5,
    })),
    tips: results.length < 5 ? '搜索结果较少，建议扩大搜索范围或调整关键词' : '',
  };
}
