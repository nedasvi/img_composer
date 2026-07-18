import { useRef, useState, type DragEvent } from "react";

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  compact?: boolean;
}

export function UploadZone({ onFiles, compact }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }

  return (
    <div
      className={`upload-zone ${dragging ? "upload-zone--dragging" : ""} ${
        compact ? "upload-zone--compact" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
      {compact ? (
        <span>+ Add more images</span>
      ) : (
        <>
          <div className="upload-zone__icon">🖼️</div>
          <p className="upload-zone__title">Drop images here</p>
          <p className="upload-zone__hint">
            or click to browse — JPG, PNG, WebP, GIF, BMP, AVIF, SVG. Upload as many as you like.
          </p>
        </>
      )}
    </div>
  );
}
