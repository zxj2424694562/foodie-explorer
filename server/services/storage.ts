import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { SearchResult, NoteDetail, ImageInfo } from '../types/index.js';

const DATA_DIR = join(process.cwd(), 'data');
const STORE_FILE = join(DATA_DIR, 'store.json');
const DOWNLOADS_DIR = join(DATA_DIR, 'downloads');

interface Store {
  searches: { query: string; city: string; keyword: string; results: SearchResult[]; created_at: string }[];
  downloads: { note_id: string; title: string; author: string; likes: string; url: string; status: 'completed' | 'failed'; file_count: number; completed_at?: string; error?: string }[];
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function loadStore(): Store {
  ensureDir(DATA_DIR);
  if (!existsSync(STORE_FILE)) {
    return { searches: [], downloads: [] };
  }
  try {
    return JSON.parse(readFileSync(STORE_FILE, 'utf-8'));
  } catch {
    return { searches: [], downloads: [] };
  }
}

function saveStore(store: Store) {
  ensureDir(DATA_DIR);
  writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export function saveSearch(query: string, city: string, keyword: string, results: SearchResult[]) {
  const store = loadStore();
  store.searches.unshift({
    query,
    city,
    keyword,
    results,
    created_at: new Date().toISOString(),
  });
  // Keep only the latest 50 searches
  if (store.searches.length > 50) store.searches = store.searches.slice(0, 50);
  saveStore(store);
}

export function getLatestSearch(): SearchResult[] {
  const store = loadStore();
  return store.searches[0]?.results ?? [];
}

export function getNoteByUrl(url: string): SearchResult | null {
  const store = loadStore();
  for (const s of store.searches) {
    const found = s.results.find((r) => r.url === url);
    if (found) return found;
  }
  return null;
}

export function saveDownload(note_id: string, title: string, author: string, likes: string, url: string, status: 'completed' | 'failed', fileCount: number, error?: string) {
  const store = loadStore();
  const existing = store.downloads.findIndex((d) => d.note_id === note_id);
  const entry = {
    note_id,
    title,
    author,
    likes,
    url,
    status,
    file_count: fileCount,
    completed_at: status === 'completed' ? new Date().toISOString() : undefined,
    error,
  };
  if (existing >= 0) {
    store.downloads[existing] = entry;
  } else {
    store.downloads.unshift(entry);
  }
  saveStore(store);
}

export function getDownloadByNoteId(note_id: string) {
  const store = loadStore();
  return store.downloads.find((d) => d.note_id === note_id) ?? null;
}

export function getAllDownloads() {
  const store = loadStore();
  return store.downloads.filter((d) => d.status === 'completed');
}

export function scanDownloadedImages(note_id: string): ImageInfo[] {
  const dir = join(DOWNLOADS_DIR, note_id);
  if (!existsSync(dir)) return [];
  const files: ImageInfo[] = [];
  try {
    const entries = readdirSync(dir);
    for (const filename of entries) {
      const filepath = join(dir, filename);
      if (filename.startsWith('.')) continue;
      try {
        const stat = statSync(filepath);
        if (stat.isFile()) {
          const ext = filename.split('.').pop()?.toLowerCase() ?? '';
          files.push({
            filename,
            relative_path: `data/downloads/${note_id}/${filename}`,
            file_size: stat.size,
            media_type: ['mp4', 'webm'].includes(ext) ? 'video' : 'image',
          });
        }
      } catch { /* skip inaccessible files */ }
    }
  } catch { /* skip inaccessible dirs */ }
  return files.sort((a, b) => a.filename.localeCompare(b.filename));
}

export function getAllDownloadedImages(page = 1, perPage = 24): { images: (ImageInfo & { note_id: string; note_title: string; note_author: string })[]; total: number } {
  const store = loadStore();
  const completed = store.downloads.filter((d) => d.status === 'completed');
  const allImages: (ImageInfo & { note_id: string; note_title: string; note_author: string })[] = [];
  for (const dl of completed) {
    const images = scanDownloadedImages(dl.note_id);
    for (const img of images) {
      allImages.push({
        ...img,
        note_id: dl.note_id,
        note_title: dl.title,
        note_author: dl.author,
      });
    }
  }
  const total = allImages.length;
  const start = (page - 1) * perPage;
  return { images: allImages.slice(start, start + perPage), total };
}
