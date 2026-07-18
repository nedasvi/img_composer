import { useLanguage } from "../i18n/LanguageContext";

interface ZoomControlsProps {
  zoom: number;
  onChange: (zoom: number) => void;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const STEP = 0.25;

export function ZoomControls({ zoom, onChange }: ZoomControlsProps) {
  const { t } = useLanguage();

  function clamp(value: number) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
  }

  return (
    <div className="zoom-controls">
      <button
        type="button"
        className="zoom-controls__btn"
        aria-label={t.zoomOut}
        disabled={zoom <= MIN_ZOOM}
        onClick={() => onChange(clamp(zoom - STEP))}
      >
        −
      </button>
      <button
        type="button"
        className="zoom-controls__level"
        aria-label={t.zoomReset}
        onClick={() => onChange(1)}
      >
        {t.zoomLevel(Math.round(zoom * 100))}
      </button>
      <button
        type="button"
        className="zoom-controls__btn"
        aria-label={t.zoomIn}
        disabled={zoom >= MAX_ZOOM}
        onClick={() => onChange(clamp(zoom + STEP))}
      >
        +
      </button>
    </div>
  );
}
