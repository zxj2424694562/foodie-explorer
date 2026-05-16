import { Router } from 'express';
import { getQueueStatus } from '../services/queue.js';

const router = Router();

router.get('/queue/status', (_req, res) => {
  const status = getQueueStatus();
  res.json({ ok: true, data: status });
});

export default router;
