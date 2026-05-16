import { useState, useCallback } from 'react';

export interface DownloadedFile {
  filename: string;
  relative_path: string;
  file_size: number;
  media_type: string;
}

export function useDownload() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [files, setFiles] = useState<DownloadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (url: string, title: string, author: string, likes: string) => {
    setDownloading(true);
    setError(null);
    setFiles([]);
    setProgress('排队中...');

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title, author, likes }),
      });
      const json = await res.json();
      if (json.ok && json.data.status === 'completed') {
        setFiles(json.data.files);
        setProgress('下载完成');
      } else if (json.ok && json.data.status === 'failed') {
        setError(json.data.error || '未找到可下载的媒体');
      } else {
        setError(json.error || '下载失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '下载失败');
    } finally {
      setDownloading(false);
    }
  }, []);

  return { downloading, progress, files, error, download };
}
