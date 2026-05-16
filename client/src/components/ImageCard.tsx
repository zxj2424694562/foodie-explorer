import { Heart } from 'lucide-react';

interface Props {
  imageUrl: string;
  filename: string;
  noteTitle: string;
  noteAuthor: string;
  onClick: () => void;
}

export default function ImageCard({ imageUrl, filename, noteTitle, noteAuthor, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={noteTitle}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-xs font-medium text-slate-700">{noteTitle}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
          <Heart className="h-2.5 w-2.5" />
          {noteAuthor}
        </p>
      </div>
    </div>
  );
}
