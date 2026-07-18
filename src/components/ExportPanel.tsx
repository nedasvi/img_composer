import { useState } from "react";
import type { ExportFormat } from "../utils/exportCanvas";
import { useLanguage } from "../i18n/LanguageContext";

interface ExportPanelProps {
  disabled: boolean;
  width: number;
  height: number;
  onExport: (format: ExportFormat, quality: number, scale: number) => Promise<void>;
}

export function ExportPanel({ disabled, width, height, onExport }: ExportPanelProps) {
  const { t } = useLanguage();
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(0.92);
  const [scale, setScale] = useState(1);
  const [busy, setBusy] = useState(false);

  const outW = Math.round(width * scale);
  const outH = Math.round(height * scale);

  return (
    <div className="panel-section panel-section--export">
      <h3>{t.exportHeading}</h3>
      <label className="field">
        <span>{t.exportFormatLabel}</span>
        <select value={format} onChange={(e) => setFormat(e.target.value as ExportFormat)}>
          <option value="png">{t.exportFormatPng}</option>
          <option value="jpeg">{t.exportFormatJpeg}</option>
          <option value="webp">{t.exportFormatWebp}</option>
        </select>
      </label>
      {format !== "png" && (
        <label className="field">
          <span>{t.exportQualityLabel(Math.round(quality * 100))}</span>
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
        <span>{t.exportResolutionLabel(outW, outH)}</span>
        <select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
          <option value={0.5}>{t.exportResHalf}</option>
          <option value={1}>{t.exportResCanvas}</option>
          <option value={2}>{t.exportResHigh}</option>
          <option value={3}>{t.exportResMax}</option>
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
        {busy ? t.exportButtonBusy : t.exportButton}
      </button>
      {disabled && <p className="field-hint">{t.exportDisabledHint}</p>}
    </div>
  );
}
