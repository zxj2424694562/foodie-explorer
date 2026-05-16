import { Router } from 'express';
import { runOpencli, parseOpencliJson } from '../services/opencli.js';
import { enqueue } from '../services/queue.js';
import { saveDownload, scanDownloadedImages } from '../services/storage.js';
import { DownloadResult } from '../types/index.js';

const router = Router();

router.post('/download', async (req, res) => {
  const { url, title, author, likes } = req.body;

  if (!url) {
    res.status(400).json({ ok: false, error: '请提供笔记 URL', code: 'MISSING_PARAMS' });
    return;
  }

  const noteId = extractNoteId(url);

  try {
    const result = await enqueue('download', noteId, async () => {
      const outputDir = `data/downloads`;
      const args = ['xiaohongshu', 'download', url, '--output', outputDir, '--window', 'background'];
      const cmdResult = await runOpencli(args, 120_000);

      if (cmdResult.exitCode !== 0 && cmdResult.exitCode !== null) {
        throw new Error(cmdResult.stderr || '下载失败');
      }

      return { outputDir, stdout: cmdResult.stdout };
    });

    // Scan downloaded files
    const files = scanDownloadedImages(noteId);
    const success = files.length > 0;

    saveDownload(noteId, title || '', author || '', likes || '', url, success ? 'completed' : 'failed', files.length);

    if (success) {
      res.json({
        ok: true,
        data: { note_id: noteId, status: 'completed', files, count: files.length } as DownloadResult,
      });
    } else {
      res.json({
        ok: true,
        data: { note_id: noteId, status: 'failed', files: [], count: 0, error: '未找到可下载的媒体文件' } as DownloadResult,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : '下载失败';
    saveDownload(noteId, title || '', author || '', likes || '', url, 'failed', 0, message);
    res.status(500).json({ ok: false, error: message, code: 'DOWNLOAD_FAILED' });
  }
});

function extractNoteId(url: string): string {
  const match = url.match(/\/(?:explore|note|search_result)\/([a-f0-9]{24})/i);
  return match?.[1] ?? url.slice(-24);
}

export default router;
