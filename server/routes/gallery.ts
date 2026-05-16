import { Router } from 'express';
import { getAllDownloadedImages } from '../services/storage.js';

const router = Router();

router.get('/gallery', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const perPage = Math.min(48, Math.max(1, parseInt(req.query.per_page as string) || 24));

  const data = getAllDownloadedImages(page, perPage);

  res.json({
    ok: true,
    data: {
      images: data.images,
      total: data.total,
      page,
      pages: Math.ceil(data.total / perPage),
    },
  });
});

export default router;
