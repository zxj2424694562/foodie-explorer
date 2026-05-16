import { Router } from 'express';
import { getNoteByUrl, getDownloadByNoteId, scanDownloadedImages } from '../services/storage.js';

const router = Router();

router.get('/notes', (req, res) => {
  const url = req.query.url as string;
  if (!url) {
    res.status(400).json({ ok: false, error: '请提供笔记 URL', code: 'MISSING_PARAMS' });
    return;
  }

  const note = getNoteByUrl(url);
  if (!note) {
    res.status(404).json({ ok: false, error: '笔记未找到，请先搜索', code: 'NOT_FOUND' });
    return;
  }

  const noteId = extractNoteId(url);
  const download = getDownloadByNoteId(noteId);
  const images = scanDownloadedImages(noteId);

  res.json({
    ok: true,
    data: {
      note_id: noteId,
      title: note.title,
      author: note.author,
      likes: note.likes,
      published_at: note.published_at,
      url: note.url,
      downloaded: download?.status === 'completed',
      image_count: download?.file_count ?? images.length,
      images,
    },
  });
});

function extractNoteId(url: string): string {
  const match = url.match(/\/(?:explore|note|search_result)\/([a-f0-9]{24})/i);
  return match?.[1] ?? '';
}

export default router;
