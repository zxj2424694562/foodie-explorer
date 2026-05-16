import { Link, useLocation } from 'react-router-dom';
import { Compass, Search, Image } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-trek-cream">
      <header className="sticky top-0 z-50 border-b border-[#e8e0d5] bg-white/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-slate-800 no-underline">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-food-500 text-white">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <span className="tracking-tight">寻味之旅</span>
                <span className="ml-2 text-[10px] font-normal text-slate-400 uppercase tracking-wider">TasteTrek</span>
              </div>
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors no-underline ${
                  location.pathname === '/'
                    ? 'bg-food-50 text-food-600'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                首页
              </Link>
              <Link
                to="/search"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors no-underline ${
                  location.pathname === '/search'
                    ? 'bg-food-50 text-food-600'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Search className="h-4 w-4" />
                搜索
              </Link>
              <Link
                to="/gallery"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors no-underline ${
                  location.pathname === '/gallery'
                    ? 'bg-food-50 text-food-600'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Image className="h-4 w-4" />
                画廊
              </Link>
            </nav>
          </div>
          <StatusBadge />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <footer className="border-t border-[#e8e0d5] py-5 text-center text-xs text-slate-400">
        寻味之旅 TasteTrek · 懂你的胃，更懂你的世界
      </footer>
    </div>
  );
}
