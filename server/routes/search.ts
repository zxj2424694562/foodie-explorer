import { Router } from 'express';
import { runOpencli, parseOpencliJson } from '../services/opencli.js';
import { enqueue } from '../services/queue.js';
import { saveSearch } from '../services/storage.js';
import { SearchResult } from '../types/index.js';

const router = Router();

router.post('/search', async (req, res) => {
  const { city, keyword, limit = 15 } = req.body;

  if (!city || !keyword) {
    res.status(400).json({ ok: false, error: '请提供城市和关键词', code: 'MISSING_PARAMS' });
    return;
  }

  const query = `${city}${keyword}`;
  console.log('[search] city:', JSON.stringify(city), 'keyword:', JSON.stringify(keyword), 'query:', JSON.stringify(query));

  try {
    const data = await enqueue('search', query, async () => {
      const result = await runOpencli([
        'xiaohongshu', 'search', query,
        '--limit', String(limit),
        '--window', 'background',
      ], 90_000);
      return parseOpencliJson<SearchResult[]>(result);
    });

    // Save to storage
    saveSearch(query, city, keyword, data);

    // Add note_id extracted from url
    const enriched = data.map((item) => ({
      ...item,
      note_id: extractNoteId(item.url),
    }));

    res.json({ ok: true, data: { query, results: enriched, total: enriched.length } });
  } catch (err) {
    const message = err instanceof Error ? err.message : '搜索失败';
    res.status(500).json({ ok: false, error: message, code: 'SEARCH_FAILED' });
  }
});

function extractNoteId(url: string): string {
  const match = url.match(/\/(?:explore|note|search_result)\/([a-f0-9]{24})/i);
  return match?.[1] ?? '';
}

export default router;
