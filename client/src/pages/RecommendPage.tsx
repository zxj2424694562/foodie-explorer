import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import SummaryBlock from '../components/SummaryBlock';
import RecommendCard from '../components/RecommendCard';
import { useDownload } from '../hooks/useDownload';
import type { Preferences } from '../components/PreferencePanel';

interface RecommendData {
  summary: string;
  tips: string;
  recommendations: {
    rank: number;
    title: string;
    reason: string;
    tags: string[];
    match_score: number;
    note: any;
  }[];
  search_results: any[];
  preferences: Preferences;
  search_queries: string[];
}

export default function RecommendPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { downloading, download } = useDownload();
  const [data, setData] = useState<RecommendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const preferences = (location.state as any)?.preferences as Preferences | undefined;

  useEffect(() => {
    if (!preferences) {
      navigate('/');
      return;
    }
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    if (!preferences) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: preferences.city, preferences }),
      });
      const json = await res.json();
      if (json.ok) {
        setData(json.data);
      } else {
        setError(json.error || 'AI 推荐失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误');
    } finally {
      setLoading(false);
    }
  };

  if (!preferences) return null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        重新选择偏好
      </button>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-food-500" />
          <p className="text-sm font-medium text-slate-600">AI 正在分析你的口味偏好…</p>
          <p className="mt-1 text-xs text-slate-400">
            {data?.search_queries && `正在搜索：${data.search_queries.join('、')}`}
          </p>
          <div className="mt-6 flex flex-col gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-food-300 animate-pulse" />
              根据偏好智能搜索小红书笔记
            </span>
            <span className="flex items-center gap-2 opacity-60">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300" />
              AI 分析筛选最匹配的推荐
            </span>
            <span className="flex items-center gap-2 opacity-30">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300" />
              生成个性化推荐报告
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">推荐失败</p>
              <p className="mt-1 text-xs text-red-600">{error}</p>
            </div>
          </div>
          <button onClick={fetchRecommendations} className="btn-primary">
            <RefreshCw className="h-4 w-4" />
            重试
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && data && (
        <>
          <SummaryBlock
            summary={data.summary}
            tips={data.tips}
            city={preferences.city}
            foodTypes={preferences.foodTypes}
            scene={preferences.scene}
          />

          {/* Recommendations */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800">
              为你精选 · {data.recommendations.length} 家推荐
            </h2>
            {data.recommendations.map((rec) => (
              <RecommendCard
                key={rec.rank}
                item={rec}
                onDownload={(url, title, author, likes) =>
                  download(url, title, author, likes)
                }
              />
            ))}
          </div>

          {/* Search queries info */}
          <p className="text-center text-xs text-slate-400">
            搜索策略：{data.search_queries?.join(' · ')}
          </p>
        </>
      )}
    </div>
  );
}
