export interface SearchResult {
  rank: number;
  title: string;
  author: string;
  author_url: string;
  likes: string;
  url: string;
  published_at: string;
}

export interface NoteDetail {
  note_id: string;
  title: string;
  author: string;
  likes: string;
  published_at: string;
  url: string;
  downloaded: boolean;
  image_count: number;
  images: ImageInfo[];
}

export interface ImageInfo {
  filename: string;
  relative_path: string;
  file_size: number;
  media_type: string;
}

export interface DownloadResult {
  note_id: string;
  status: 'completed' | 'failed';
  files: ImageInfo[];
  count: number;
  error?: string;
}

export interface QueueStatus {
  running: { type: string; note_id?: string; query?: string; started_at: string } | null;
  waiting: number;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface StatusResponse {
  daemon: boolean;
  extension: boolean;
  version: string;
  profile: string;
}
