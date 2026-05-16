import { Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  summary: string;
  tips?: string;
  city: string;
  foodTypes: string[];
  scene: string;
}

export default function SummaryBlock({ summary, tips, city, foodTypes, scene }: Props) {
  return (
    <div className="space-y-4">
      {/* Context tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-food-500 px-3 py-1 text-xs font-medium text-white">{city}</span>
        {foodTypes.map((t) => (
          <span key={t} className="rounded-full bg-food-50 px-3 py-1 text-xs font-medium text-food-600">{t}</span>
        ))}
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">{scene}</span>
      </div>

      {/* AI Summary */}
      <div className="rounded-2xl border border-food-200 bg-gradient-to-br from-food-50 to-trek-ivory p-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-food-500" />
          <span className="text-sm font-semibold text-food-600">AI 美食推荐</span>
        </div>
        <p className="text-base leading-relaxed text-slate-700">{summary}</p>
      </div>

      {/* Tips */}
      {tips && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-700">{tips}</p>
        </div>
      )}
    </div>
  );
}
