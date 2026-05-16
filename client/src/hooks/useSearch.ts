import { useState } from 'react';

export interface SearchResultItem {
  rank: number;
  note_id: string;
  title: string;
  author: string;
  likes: string;
  url: string;
  published_at: string;
}

interface SearchResponse {
  query: string;
  results: SearchResultItem[];
  total: number;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  async function search(city: string, keyword: string) {
    setLoading(true);
    setError(null);
    setQuery(`${city}${keyword}`);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, keyword, limit: 15 }),
      });
      const json = await res.json();
      if (json.ok) {
        setResults((json.data as SearchResponse).results);
      } else {
        setError(json.error || '搜索失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误，无法连接后端');
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, query, search, clearResults: () => setResults([]) };
}
