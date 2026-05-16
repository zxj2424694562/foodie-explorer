import { Heart } from 'lucide-react';
import type { SearchResultItem } from '../hooks/useSearch';

interface Props {
  results: SearchResultItem[];
  onSelect: (item: SearchResultItem) => void;
  selectedUrl?: string;
}

function formatLikes(likes: string): string {
  const n = parseFloat(likes);
  if (isNaN(n)) return likes;
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(Math.round(n));
}

export default function ResultsTable({ results, onSelect, selectedUrl }: Props) {
  if (results.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-medium uppercase text-slate-500">
              <th className="w-12 px-4 py-3">#</th>
              <th className="px-4 py-3">标题</th>
              <th className="hidden w-24 px-4 py-3 sm:table-cell">作者</th>
              <th className="hidden w-20 px-4 py-3 text-right sm:table-cell">点赞</th>
              <th className="hidden w-28 px-4 py-3 lg:table-cell">日期</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {results.map((item) => (
              <tr
                key={item.url}
                onClick={() => onSelect(item)}
                className={`cursor-pointer transition-colors hover:bg-amber-50/50 ${
                  selectedUrl === item.url ? 'bg-amber-50' : ''
                }`}
              >
                <td className="px-4 py-3 text-xs font-medium text-slate-400">{item.rank}</td>
                <td className="max-w-[300px] truncate px-4 py-3 font-medium text-slate-800">
                  {item.title}
                </td>
                <td className="hidden truncate px-4 py-3 text-slate-500 sm:table-cell">
                  {item.author}
                </td>
                <td className="hidden px-4 py-3 text-right sm:table-cell">
                  <span className="inline-flex items-center gap-1 text-xs text-rose-500">
                    <Heart className="h-3 w-3 fill-current" />
                    {formatLikes(item.likes)}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-slate-400 lg:table-cell">
                  {item.published_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
