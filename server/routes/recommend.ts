import { Router } from 'express';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { runOpencli, parseOpencliYaml } from '../services/opencli.js';
import { enqueue } from '../services/queue.js';
import { buildSearchQueries, formatPreferences } from '../services/preferences.js';
import { getRecommendations } from '../services/claude.js';
import { saveSearch } from '../services/storage.js';
import { SearchResult } from '../types/index.js';

const CACHE_FILE = join(process.cwd(), 'data', 'search_cache.json');

function loadCache(): Record<string, SearchResult[]> {
  if (!existsSync(CACHE_FILE)) return {};
  try { return JSON.parse(readFileSync(CACHE_FILE, 'utf-8')); } catch { return {}; }
}

function findBestCachedResults(city: string, prefs: { foodTypes: string[] }): SearchResult[] {
  const cache = loadCache();
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  // Try to match cached queries by city + food type
  for (const [query, items] of Object.entries(cache)) {
    if (query.includes(city) && prefs.foodTypes.some(ft => query.includes(ft))) {
      for (const item of items) {
        const key = (item as any).url || (item as any).note_id;
        if (key && !seen.has(key)) {
          seen.add(key);
          results.push(item);
        }
      }
    }
  }
  // Fallback: any results for this city
  if (results.length === 0) {
    for (const [query, items] of Object.entries(cache)) {
      if (query.includes(city)) {
        for (const item of items) {
          const key = (item as any).url || (item as any).note_id;
          if (key && !seen.has(key)) {
            seen.add(key);
            results.push(item);
          }
        }
      }
    }
  }
  return results;
}

const router = Router();

router.post('/recommend', async (req, res) => {
  const { city, preferences } = req.body;

  if (!city) {
    res.status(400).json({ ok: false, error: '请提供城市', code: 'MISSING_PARAMS' });
    return;
  }
  if (!preferences?.foodTypes?.length) {
    res.status(400).json({ ok: false, error: '请至少选择一种美食类型', code: 'MISSING_PARAMS' });
    return;
  }

  const prefs = {
    foodTypes: preferences.foodTypes || ['粤菜'],
    scene: preferences.scene || '朋友聚餐',
    budget: preferences.budget || '100-200',
    styles: preferences.styles || [],
  };

  try {
    // Step 1: Build search queries from preferences
    const queries = buildSearchQueries(city, prefs);
    console.log('[recommend] queries:', queries);

    // Step 2: Execute searches (serial to avoid browser conflict)
    let allResults: SearchResult[] = [];
    const seen = new Set<string>();
    let usedCache = false;

    for (const query of queries) {
      try {
        const data = await enqueue('search', query, async () => {
          const result = await runOpencli([
            'xiaohongshu', 'search', query,
            '--limit', '10',
            '--window', 'background',
          ], 90_000);
          return parseOpencliYaml<SearchResult[]>(result);
        });

        for (const item of data) {
          const key = extractNoteId(item.url);
          if (key && !seen.has(key)) {
            seen.add(key);
            allResults.push({ ...item, note_id: key });
          }
          if (allResults.length >= 20) break;
        }
        if (allResults.length >= 20) break;
      } catch (err) {
        console.log('[recommend] OpenCLI search failed, trying cache...', (err as Error).message?.slice(0, 80));
        break; // stop trying more queries, fall back to cache
      }
    }

    // Fallback to cached data if live search returned nothing
    if (allResults.length === 0) {
      allResults = findBestCachedResults(city, prefs);
      usedCache = true;
      console.log('[recommend] using cached data:', allResults.length, 'results');
    }

    console.log('[recommend] total results:', allResults.length, usedCache ? '(cached)' : '(live)');

    // Step 3: Call Claude for AI recommendations
    let aiResult;
    try {
      aiResult = await getRecommendations({
        city,
        preferences: prefs,
        searchResults: allResults.slice(0, 15),
      });
    } catch (err) {
      console.error('[recommend] Claude API error:', err);
      aiResult = {
        summary: `在${city}为你找到了${allResults.length}家值得探索的美食，结合你的偏好精心挑选。`,
        recommendations: allResults.slice(0, 5).map((r, i) => ({
          title: r.title,
          reason: `真实食客@${r.author}推荐，获${r.likes}赞`,
          tags: prefs.foodTypes.slice(0, 2),
          match_score: 90 - i * 5,
        })),
        tips: '',
      };
    }

    // Save search cache
    saveSearch(formatPreferences(prefs), city, '', allResults);

    // Map AI recommendations to actual results
    const enriched = aiResult.recommendations.map((rec: any, i: number) => {
      const match = allResults.find((r) => r.title.includes(rec.title) || rec.title.includes(r.title));
      return {
        rank: i + 1,
        title: rec.title,
        reason: rec.reason,
        tags: rec.tags || [],
        match_score: rec.match_score || 90 - i * 5,
        note: match || null,
      };
    });

    res.json({
      ok: true,
      data: {
        summary: aiResult.summary,
        tips: aiResult.tips || '',
        recommendations: enriched,
        search_results: allResults,
        preferences: prefs,
        search_queries: queries,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '推荐失败';
    res.status(500).json({ ok: false, error: message, code: 'RECOMMEND_FAILED' });
  }
});

function extractNoteId(url: string): string {
  const match = url.match(/\/(?:explore|note|search_result)\/([a-f0-9]{24})/i);
  return match?.[1] ?? '';
}

export default router;
