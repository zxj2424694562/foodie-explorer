import { useState } from 'react';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ResultsTable from '../components/ResultsTable';
import NoteDetailPanel from '../components/NoteDetailPanel';
import { useSearch, SearchResultItem } from '../hooks/useSearch';
import { useDownload } from '../hooks/useDownload';

export default function SearchPage() {
  const { results, loading, error, query, search, clearResults } = useSearch();
  const { downloading, progress, files, error: downloadError, download } = useDownload();
  const [selected, setSelected] = useState<SearchResultItem | null>(null);

  const handleSearch = (city: string, keyword: string) => {
    setSelected(null);
    search(city, keyword);
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          探索美食，从搜索开始
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          通过小红书真实探店笔记，发现每个城市的必吃美食
        </p>
      </div>

      {/* Search Bar */}
      <div className="card p-4">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="mt-3 text-sm">正在搜索 <span className="font-medium text-slate-600">「{query}」</span> ...</p>
          <p className="mt-1 text-xs">预计需要 10-60 秒，请耐心等待</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-700">搜索失败</p>
            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-slate-500">
              搜索 <span className="font-medium text-slate-700">「{query}」</span> 共找到 {results.length} 条结果
            </span>
          </div>
          <ResultsTable
            results={results}
            onSelect={setSelected}
            selectedUrl={selected?.url}
          />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && results.length === 0 && query && (
        <div className="py-16 text-center text-slate-400">
          <p className="text-sm">未找到相关结果</p>
          <p className="mt-1 text-xs">请尝试不同的关键词或城市</p>
        </div>
      )}

      {/* Initial empty */}
      {!loading && !error && !query && (
        <div className="py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
            <Sparkles className="h-8 w-8 text-amber-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">输入城市和美食关键词开始探索</p>
          <p className="mt-1 text-xs text-slate-400">比如 "深圳 必吃火锅" 或 "广州 早茶推荐"</p>
        </div>
      )}

      {/* Note Detail Panel */}
      <NoteDetailPanel
        item={selected}
        onClose={() => setSelected(null)}
        onDownload={download}
        downloading={downloading}
        progress={progress}
        files={files}
        downloadError={downloadError}
      />
    </div>
  );
}
