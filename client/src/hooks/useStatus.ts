import { useState, useEffect } from 'react';

interface StatusData {
  daemon: boolean;
  extension: boolean;
  version: string;
  profile: string;
}

export function useStatus() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const res = await fetch('/api/status');
        const json = await res.json();
        if (mounted && json.ok) setStatus(json.data);
      } catch { /* ignore */ }
      if (mounted) setLoading(false);
    }

    check();
    const interval = setInterval(check, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { status, loading };
}
