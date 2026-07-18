import { useRef, useState } from "react";
import type { ComposerImage } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

const THUMB_SIZE = 64;

interface ImageListProps {
  images: ComposerImage[];
  selectedId: string | null;
  reorderable: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (fromId: string, toId: string) => void;
  onClearAll: () => void;
}

export function ImageList({
  images,
  selectedId,
  reorderable,
  onSelect,
  onRemove,
  onReorder,
  onClearAll,
}: ImageListProps) {
  const { t } = useLanguage();
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggingId = useRef<string | null>(null);

  if (images.length === 0) return null;

  return (
    <div className="panel-section">
      <div className="panel-section__header">
        <h3>{t.imagesHeading(images.length)}</h3>
        <button type="button" className="link-button" onClick={onClearAll}>
          {t.imagesClearAll}
        </button>
      </div>
      {reorderable && <p className="field-hint">{t.imagesReorderHint}</p>}
      <ul className="image-list">
        {images.map((img) => (
          <li
            key={img.id}
            className={`image-list__item ${img.id === selectedId ? "image-list__item--selected" : ""} ${
              dragOverId === img.id ? "image-list__item--drag-over" : ""
            }`}
            draggable={reorderable}
            onClick={() => onSelect(img.id)}
            onDragStart={() => {
              draggingId.current = img.id;
            }}
            onDragOver={(e) => {
              if (!reorderable) return;
              e.preventDefault();
              setDragOverId(img.id);
            }}
            onDragLeave={() => setDragOverId((cur) => (cur === img.id ? null : cur))}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverId(null);
              const fromId = draggingId.current;
              if (fromId && fromId !== img.id) onReorder(fromId, img.id);
              draggingId.current = null;
            }}
          >
            <ImageThumb image={img} />
            <span className="image-list__name" title={img.name}>
              {img.name}
            </span>
            <button
              type="button"
              className="image-list__remove"
              aria-label={t.imagesRemove(img.name)}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(img.id);
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImageThumb({ image }: { image: ComposerImage }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawn = useRef(false);
  if (!drawn.current) {
    // Draw lazily once the ref is attached via a callback ref below.
  }
  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (el && !drawn.current) {
          const ctx = el.getContext("2d");
          if (ctx) {
            const size = THUMB_SIZE;
            el.width = size;
            el.height = size;
            const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
            const dw = image.naturalWidth * scale;
            const dh = image.naturalHeight * scale;
            ctx.drawImage(image.bitmap, (size - dw) / 2, (size - dh) / 2, dw, dh);
            drawn.current = true;
          }
        }
      }}
      className="image-list__thumb"
      width={THUMB_SIZE}
      height={THUMB_SIZE}
    />
  );
}
