import { useState } from "react";
import type { ExportFormat } from "../utils/exportCanvas";

interface ExportPanelProps {
  disabled: boolean;
  width: number;
  height: number;
  onExport: (format: ExportFormat, quality: number, scale: number) => Promise<void>;
}

export function ExportPanel({ disabled, width, height, onExport }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(0.92);
  const [scale, setScale] = useState(1);
  const [busy, setBusy] = useState(false);

  const outW = Math.round(width * scale);
  const outH = Math.round(height * scale);

  return (
    <div className="panel-section panel-section--export">
      <h3>Export</h3>
      <label className="field">
        <span>Format</span>
        <select value={format} onChange={(e) => setFormat(e.target.value as ExportFormat)}>
          <option value="png">PNG (lossless, supports transparency)</option>
          <option value="jpeg">JPEG (smaller file size)</option>
          <option value="webp">WebP (smaller, supports transparency)</option>
        </select>
      </label>
      {format !== "png" && (
        <label className="field">
          <span>Quality: {Math.round(quality * 100)}%</span>
          <input
            type="range"
            min={0.4}
            max={1}
            step={0.02}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
          />
        </label>
      )}
      <label className="field">
        <span>Resolution: {outW}×{outH}px</span>
        <select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
          <option value={0.5}>Half (0.5×)</option>
          <option value={1}>Canvas size (1×)</option>
          <option value={2}>High-res (2×)</option>
          <option value={3}>Max (3×)</option>
        </select>
      </label>
      <button
        type="button"
        className="primary-button"
        disabled={disabled || busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onExport(format, quality, scale);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Preparing…" : "Download collage"}
      </button>
      {disabled && <p className="field-hint">Upload at least one image to enable export.</p>}
    </div>
  );
}
