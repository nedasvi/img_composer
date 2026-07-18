import type { ComposerImage } from "../types";

interface SelectedImagePanelProps {
  image: ComposerImage;
  onChange: (id: string, patch: Partial<ComposerImage["transform"]>) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SelectedImagePanel({
  image,
  onChange,
  onBringToFront,
  onSendToBack,
  onRemove,
}: SelectedImagePanelProps) {
  const aspect = image.naturalWidth / image.naturalHeight;

  return (
    <div className="panel-section">
      <h3>Selected: {image.name}</h3>
      <label className="field">
        <span>Size: {Math.round(image.transform.width)}px</span>
        <input
          type="range"
          min={20}
          max={2000}
          value={image.transform.width}
          onChange={(e) => {
            const width = Number(e.target.value);
            onChange(image.id, { width, height: width / aspect });
          }}
        />
      </label>
      <label className="field">
        <span>Rotation: {Math.round(image.transform.rotation)}°</span>
        <input
          type="range"
          min={-180}
          max={180}
          value={image.transform.rotation}
          onChange={(e) => onChange(image.id, { rotation: Number(e.target.value) })}
        />
      </label>
      <div className="field-row">
        <button type="button" className="secondary-button" onClick={() => onBringToFront(image.id)}>
          Bring to front
        </button>
        <button type="button" className="secondary-button" onClick={() => onSendToBack(image.id)}>
          Send to back
        </button>
      </div>
      <button type="button" className="danger-button" onClick={() => onRemove(image.id)}>
        Delete image
      </button>
    </div>
  );
}
