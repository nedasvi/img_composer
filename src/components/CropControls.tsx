import type { ComposerImage, CropState } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface CropControlsProps {
  image: ComposerImage;
  disabled?: boolean;
  onChange: (id: string, crop: Partial<CropState>) => void;
  onReset: (id: string) => void;
}

const NUDGE_STEP = 0.18;

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function CropControls({ image, disabled, onChange, onReset }: CropControlsProps) {
  const { t } = useLanguage();

  if (disabled) {
    return (
      <div className="panel-section">
        <h3>{t.cropHeading}</h3>
        <p className="field-hint">{t.cropUnavailable}</p>
      </div>
    );
  }

  const { crop } = image;

  function nudge(dx: number, dy: number) {
    onChange(image.id, {
      offsetX: clamp(crop.offsetX + dx, -1, 1),
      offsetY: clamp(crop.offsetY + dy, -1, 1),
    });
  }

  return (
    <div className="panel-section">
      <h3>{t.cropHeading}</h3>
      <label className="field">
        <span>{t.cropZoomLabel(Math.round(crop.zoom * 100))}</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={crop.zoom}
          onChange={(e) => onChange(image.id, { zoom: Number(e.target.value) })}
        />
      </label>
      <p className="field-hint">{t.cropMoveHint}</p>
      <div className="crop-pad">
        <span />
        <button type="button" className="crop-pad__btn" aria-label={t.cropMoveUp} onClick={() => nudge(0, -NUDGE_STEP)}>
          ↑
        </button>
        <span />
        <button type="button" className="crop-pad__btn" aria-label={t.cropMoveLeft} onClick={() => nudge(-NUDGE_STEP, 0)}>
          ←
        </button>
        <span className="crop-pad__center" aria-hidden="true" />
        <button type="button" className="crop-pad__btn" aria-label={t.cropMoveRight} onClick={() => nudge(NUDGE_STEP, 0)}>
          →
        </button>
        <span />
        <button type="button" className="crop-pad__btn" aria-label={t.cropMoveDown} onClick={() => nudge(0, NUDGE_STEP)}>
          ↓
        </button>
        <span />
      </div>
      <button type="button" className="secondary-button" onClick={() => onReset(image.id)}>
        {t.cropReset}
      </button>
    </div>
  );
}
