export default function DownloadProgress({ progress }: { progress: string }) {
  return (
    <div className="rounded-lg bg-amber-50 px-4 py-3">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-amber-700">下载中</span>
        <span className="text-amber-600">{progress}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-amber-100">
        <div className="h-full animate-pulse rounded-full bg-amber-500" style={{ width: '60%' }} />
      </div>
    </div>
  );
}
