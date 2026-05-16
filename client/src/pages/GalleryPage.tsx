import { useState } from 'react';
import { Image, ChevronLeft, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import { useGallery, GalleryImage } from '../hooks/useGallery';
import ImageCard from '../components/ImageCard';
import ImageLightbox from '../components/ImageLightbox';

export default function GalleryPage() {
  const { images, loading, page, total, totalPages, fetchPage } = useGallery();
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const lightboxIndex = lightboxImage
    ? images.findIndex((i) => i.filename === lightboxImage.filename && i.note_id === lightboxImage.note_id)
    : -1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">美食画廊</h1>
        <p className="mt-1 text-sm text-slate-500">
          {total > 0 ? `已收藏 ${total} 张美食图片` : '下载图片后将在这里展示'}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        </div>
      ) : images.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img) => (
              <ImageCard
                key={`${img.note_id}/${img.filename}`}
                imageUrl={`/api/images/${img.note_id}/${img.filename}`}
                filename={img.filename}
                noteTitle={img.note_title}
                noteAuthor={img.note_author}
                onClick={() => setLightboxImage(img)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => fetchPage(page - 1)}
                disabled={page <= 1}
                className="btn-secondary text-xs"
              >
                <ChevronLeft className="h-3 w-3" />
                上一页
              </button>
              <span className="text-xs text-slate-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => fetchPage(page + 1)}
                disabled={page >= totalPages}
                className="btn-secondary text-xs"
              >
                下一页
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
            <Image className="h-8 w-8 text-amber-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">还没有图片</p>
          <p className="mt-1 text-xs text-slate-400">先去搜索美食，下载笔记中的图片吧</p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          image={lightboxImage}
          images={images}
          onClose={() => setLightboxImage(null)}
          onPrev={() => {
            if (lightboxIndex > 0) setLightboxImage(images[lightboxIndex - 1]);
          }}
          onNext={() => {
            if (lightboxIndex < images.length - 1) setLightboxImage(images[lightboxIndex + 1]);
          }}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < images.length - 1}
        />
      )}
    </div>
  );
}
