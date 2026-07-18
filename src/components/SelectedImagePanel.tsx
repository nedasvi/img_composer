import type { ComposerImage, CropState, LayoutMode, Transform } from "../types";
import { useLanguage } from "../i18n/LanguageContext";
import { CropControls } from "./CropControls";

interface SelectedImagePanelProps {
  image: ComposerImage;
  layoutMode: LayoutMode;
  cropDisabled: boolean;
  onTransformChange: (id: string, patch: Partial<Transform>) => void;
  onCropChange: (id: string, crop: Partial<CropState>) => void;
  onCropReset: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SelectedImagePanel({
  image,
  layoutMode,
  cropDisabled,
  onTransformChange,
  onCropChange,
  onCropReset,
  onBringToFront,
  onSendToBack,
  onRemove,
}: SelectedImagePanelProps) {
  const { t } = useLanguage();
  const aspect = image.naturalWidth / image.naturalHeight;

  return (
    <>
      <div className="panel-section">
        <h3>{t.selectedHeading(image.name)}</h3>
        {layoutMode === "freeform" && (
          <>
            <label className="field">
              <span>{t.sizeLabel(Math.round(image.transform.width))}</span>
              <input
                type="range"
                min={20}
                max={2000}
                value={image.transform.width}
                onChange={(e) => {
                  const width = Number(e.target.value);
                  onTransformChange(image.id, { width, height: width / aspect });
                }}
              />
            </label>
            <label className="field">
              <span>{t.rotationLabel(Math.round(image.transform.rotation))}</span>
              <input
                type="range"
                min={-180}
                max={180}
                value={image.transform.rotation}
                onChange={(e) => onTransformChange(image.id, { rotation: Number(e.target.value) })}
              />
            </label>
            <div className="field-row">
              <button type="button" className="secondary-button" onClick={() => onBringToFront(image.id)}>
                {t.bringToFront}
              </button>
              <button type="button" className="secondary-button" onClick={() => onSendToBack(image.id)}>
                {t.sendToBack}
              </button>
            </div>
          </>
        )}
        <button type="button" className="danger-button" onClick={() => onRemove(image.id)}>
          {t.deleteImage}
        </button>
      </div>
      <CropControls image={image} disabled={cropDisabled} onChange={onCropChange} onReset={onCropReset} />
    </>
  );
}
