import { useStatus } from '../hooks/useStatus';

export default function StatusBadge() {
  const { status, loading } = useStatus();

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
        检测中...
      </div>
    );
  }

  const connected = status?.extension;

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        connected ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
      {connected ? '已连接' : '未连接'}
    </div>
  );
}
