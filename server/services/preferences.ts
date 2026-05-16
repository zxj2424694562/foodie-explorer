interface FoodPreferences {
  foodTypes: string[];
  scene: string;
  budget: string;
  styles: string[];
}

const FOOD_TYPE_KEYWORDS: Record<string, string[]> = {
  '火锅': ['火锅', '涮肉'],
  '川菜': ['川菜', '麻辣', '水煮'],
  '粤菜': ['粤菜', '茶餐厅', '烧腊', '煲汤'],
  '日料': ['日料', '寿司', '拉面', '居酒屋'],
  '韩料': ['韩料', '烤肉', '炸鸡'],
  '西餐': ['西餐', '牛排', '意面', '披萨'],
  '烧烤': ['烧烤', '烤肉', '烤串', 'BBQ'],
  '海鲜': ['海鲜', '刺身', '生蚝', '大闸蟹'],
  '甜品': ['甜品', '蛋糕', '冰淇淋', '糖水'],
  '小吃': ['小吃', '路边摊', '夜市', '苍蝇馆子'],
  '面食': ['面', '粉', '米线', '饺子'],
  '早茶': ['早茶', '点心', '肠粉', '虾饺'],
  '素食': ['素食', '素菜', '斋菜'],
  '东南亚菜': ['泰国菜', '越南菜', '冬阴功', '咖喱'],
};

const SCENE_KEYWORDS: Record<string, string> = {
  '朋友聚餐': '聚餐推荐 人多',
  '约会打卡': '约会 环境好 出片',
  '独自探店': '一人食 独食 必打卡',
  '商务宴请': '商务 包间 高档',
  '深夜食堂': '深夜 宵夜 夜宵 24小时',
  '随便吃吃': '随意 平价 快餐',
};

const BUDGET_KEYWORDS: Record<string, string> = {
  '人均 50 以下': '平价 便宜 实惠',
  '50-100': '性价比',
  '100-200': '精致',
  '200 以上': '高端 奢华 米其林',
  '不计预算': '',
};

const STYLE_KEYWORDS: Record<string, string> = {
  '网红新店': '网红 新店 打卡',
  '老字号': '老字号 老店 十年',
  '隐藏小店': '隐藏 巷子 小众',
  '环境优雅': '环境好 氛围感',
  '烟火气': '烟火气 大排档 接地气',
};

export function buildSearchQueries(city: string, prefs: FoodPreferences): string[] {
  const queries: string[] = [];

  // Primary: food type + city + scene
  const primaryTypes = prefs.foodTypes.slice(0, 2);
  for (const type of primaryTypes) {
    const typeKeywords = FOOD_TYPE_KEYWORDS[type] || [type];
    const sceneKw = SCENE_KEYWORDS[prefs.scene] || '';
    const styleKw = prefs.styles.slice(0, 2).map((s) => STYLE_KEYWORDS[s] || '').join(' ');

    queries.push(`${city}${typeKeywords[0]}${sceneKw}${styleKw}`.trim());
  }

  // Secondary: broader food search
  if (prefs.foodTypes.length > 2) {
    const extraTypes = prefs.foodTypes.slice(2, 4).map((t) => FOOD_TYPE_KEYWORDS[t]?.[0] || t);
    queries.push(`${city}${extraTypes.join(' ')}必吃`.trim());
  }

  // Fallback: generic food + city
  const budgetKw = BUDGET_KEYWORDS[prefs.budget] || '';
  queries.push(`${city}美食推荐${budgetKw}`.trim());

  return [...new Set(queries)].slice(0, 3);
}

export function formatPreferences(prefs: FoodPreferences): string {
  const parts: string[] = [];
  parts.push(`类型：${prefs.foodTypes.join('、')}`);
  parts.push(`场景：${prefs.scene}`);
  parts.push(`预算：${prefs.budget}`);
  if (prefs.styles.length > 0) parts.push(`风格：${prefs.styles.join('、')}`);
  return parts.join(' | ');
}
