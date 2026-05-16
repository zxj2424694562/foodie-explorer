import { Heart, ExternalLink, Download, Percent } from 'lucide-react';

interface RecommendItem {
  rank: number;
  title: string;
  reason: string;
  tags: string[];
  match_score: number;
  note: {
    title: string;
    author: string;
    likes: string;
    url: string;
    published_at: string;
  } | null;
}

interface Props {
  item: RecommendItem;
  onDownload: (url: string, title: string, author: string, likes: string) => void;
}

function formatLikes(likes: string): string {
  const n = parseFloat(likes);
  if (isNaN(n)) return likes;
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  return likes;
}

export default function RecommendCard({ item, onDownload }: Props) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-food-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Rank badge */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-food-500 to-food-600 text-lg font-bold text-white shadow-sm shadow-food-500/20">
          {item.rank}
        </div>

        <div className="min-w-0 flex-1">
          {/* Title + match */}
          <div className="flex items-center gap-3">
            <h3 className="truncate text-base font-semibold text-slate-800">{item.title}</h3>
            {item.match_score >= 90 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-trek-green/10 px-2 py-0.5 text-[11px] font-semibold text-trek-green">
                <Percent className="h-3 w-3" />
                {item.match_score}% 匹配
              </span>
            )}
          </div>

          {/* AI Reason */}
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.reason}</p>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-food-50 px-2.5 py-0.5 text-[11px] font-medium text-food-600">
                {tag}
              </span>
            ))}
          </div>

          {/* Evidence from original note */}
          {item.note && (
            <div className="mt-3 flex items-center gap-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <span>@{item.note.author}</span>
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3 w-3 text-rose-400" />
                {formatLikes(item.note.likes)}
              </span>
              <span>{item.note.published_at}</span>
            </div>
          )}

          {/* Actions */}
          {item.note && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onDownload(item.note!.url, item.note!.title, item.note!.author, item.note!.likes)}
                className="btn-secondary text-xs py-2"
              >
                <Download className="h-3.5 w-3.5" />
                下载图片
              </button>
              <a
                href={item.note.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 no-underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                查看原文
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
