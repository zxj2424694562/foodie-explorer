import { X, Download, ExternalLink, Image, Heart } from 'lucide-react';
import type { SearchResultItem } from '../hooks/useSearch';
import type { DownloadedFile } from '../hooks/useDownload';
import DownloadProgress from './DownloadProgress';

interface Props {
  item: SearchResultItem | null;
  onClose: () => void;
  onDownload: (url: string, title: string, author: string, likes: string) => void;
  downloading: boolean;
  progress: string;
  files: DownloadedFile[];
  downloadError: string | null;
}

export default function NoteDetailPanel({
  item,
  onClose,
  onDownload,
  downloading,
  progress,
  files,
  downloadError,
}: Props) {
  if (!item) return null;

  const hasFiles = files.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-xl animate-[slideIn_0.2s_ease-out]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-5 py-4 backdrop-blur">
          <h3 className="text-sm font-semibold text-slate-800">笔记详情</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Title */}
          <h2 className="text-base font-semibold leading-snug text-slate-800">{item.title}</h2>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>{item.author}</span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3 w-3 text-rose-400" />
              {item.likes}
            </span>
            <span>{item.published_at}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!hasFiles && (
              <button
                onClick={() => onDownload(item.url, item.title, item.author, item.likes)}
                disabled={downloading}
                className="btn-primary flex-1 text-xs"
              >
                <Download className="h-4 w-4" />
                {downloading ? '下载中...' : '下载图片'}
              </button>
            )}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex-1 text-xs no-underline"
            >
              <ExternalLink className="h-4 w-4" />
              查看原文
            </a>
          </div>

          {/* Download Progress */}
          {downloading && <DownloadProgress progress={progress} />}

          {/* Error */}
          {downloadError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-600">{downloadError}</div>
          )}

          {/* Image Gallery */}
          {hasFiles && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                <Image className="h-4 w-4" />
                {files.length} 张图片
              </div>
              <div className="grid grid-cols-2 gap-2">
                {files.map((file, i) => (
                  <a
                    key={i}
                    href={`/api/images/${item.note_id}/${file.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100"
                  >
                    <img
                      src={`/api/images/${item.note_id}/${file.filename}`}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                      <span className="text-[10px] text-white/90">
                        {formatSize(file.file_size)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
