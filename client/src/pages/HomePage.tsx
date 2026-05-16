import { useNavigate } from 'react-router-dom';
import { Sparkles, Search } from 'lucide-react';
import PreferencePanel, { Preferences } from '../components/PreferencePanel';
import { useState } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (prefs: Preferences) => {
    setLoading(true);
    // Navigate to recommend page with prefs in state
    navigate('/recommend', { state: { preferences: prefs } });
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          <span className="bg-gradient-to-r from-food-500 to-food-600 bg-clip-text text-transparent">
            寻味之旅
          </span>
        </h1>
        <p className="mt-3 text-lg font-light text-slate-500 tracking-wide">
          懂你的胃，更懂你的世界
        </p>
        <p className="mt-2 text-sm text-slate-400">
          AI 读懂你的口味偏好，从小红书真实笔记中为你精选美食
        </p>
      </div>

      {/* Preference Panel */}
      <PreferencePanel onSubmit={handleSubmit} loading={loading} />

      {/* Quick search link */}
      <div className="text-center">
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Search className="h-4 w-4" />
          或者直接搜索美食笔记
        </button>
      </div>
    </div>
  );
}
