import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryImage } from '../hooks/useGallery';

interface Props {
  image: GalleryImage;
  images: GalleryImage[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function ImageLightbox({ image, images, onClose, onPrev, onNext, hasPrev, hasNext }: Props) {
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    if (e.key === 'ArrowRight' && hasNext) onNext();
  };

  const currentIndex = images.findIndex((i) => i.filename === image.filename && i.note_id === image.note_id);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/80 backdrop-blur transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/80 backdrop-blur transition hover:bg-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div className="flex max-h-[85vh] max-w-[85vw] flex-col items-center">
        <img
          src={`/api/images/${image.note_id}/${image.filename}`}
          alt={image.note_title}
          className="max-h-[80vh] max-w-[85vw] rounded-lg object-contain"
        />
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-white/90">{image.note_title}</p>
          <p className="mt-0.5 text-xs text-white/50">@{image.note_author}</p>
        </div>
      </div>

      {/* Next */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/80 backdrop-blur transition hover:bg-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
