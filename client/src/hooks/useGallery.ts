import { useState, useEffect, useCallback } from 'react';

export interface GalleryImage {
  filename: string;
  relative_path: string;
  file_size: number;
  media_type: string;
  note_id: string;
  note_title: string;
  note_author: string;
}

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?page=${p}&per_page=24`);
      const json = await res.json();
      if (json.ok) {
        setImages(json.data.images);
        setTotal(json.data.total);
        setTotalPages(json.data.pages);
        setPage(json.data.page);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return { images, loading, page, total, totalPages, fetchPage };
}
