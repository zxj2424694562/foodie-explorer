import { Router } from 'express';
import { runOpencli } from '../services/opencli.js';

const router = Router();

let cachedStatus: { daemon: boolean; extension: boolean; version: string; profile: string } | null = null;
let lastCheck = 0;
const CACHE_MS = 15_000;

router.get('/status', async (_req, res) => {
  const now = Date.now();
  if (cachedStatus && now - lastCheck < CACHE_MS) {
    res.json({ ok: true, data: cachedStatus });
    return;
  }

  try {
    const result = await runOpencli(['doctor'], 15_000);
    const output = result.stdout + '\n' + result.stderr;
    console.log('[status] opencli doctor output:', JSON.stringify(output.slice(0, 500)));

    const daemon = output.includes('[OK] Daemon');
    const extension = output.includes('[OK] Extension');
    const versionMatch = output.match(/opencli v([\d.]+)/);
    const profileMatch = output.match(/• (\w+): connected/);

    cachedStatus = {
      daemon,
      extension,
      version: versionMatch?.[1] ?? 'unknown',
      profile: profileMatch?.[1] ?? '',
    };
    lastCheck = now;

    console.log('[status] parsed:', { daemon, extension, version: cachedStatus.version });
    res.json({ ok: true, data: cachedStatus });
  } catch (err) {
    console.error('[status] error:', err);
    cachedStatus = { daemon: false, extension: false, version: 'unknown', profile: '' };
    lastCheck = now;
    res.json({ ok: true, data: cachedStatus });
  }
});

export default router;
