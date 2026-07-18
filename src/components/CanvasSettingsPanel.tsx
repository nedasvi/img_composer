import type { CanvasAspect, CanvasSettings } from "../types";
import { ASPECT_LABELS } from "../utils/aspect";

interface CanvasSettingsPanelProps {
  settings: CanvasSettings;
  hasImages: boolean;
  onChange: (settings: CanvasSettings) => void;
  onAspectChange: (aspect: CanvasAspect) => void;
}

const ASPECT_OPTIONS: CanvasAspect[] = [
  "match-first",
  "square",
  "4:3",
  "3:2",
  "16:9",
  "9:16",
  "custom",
];

export function CanvasSettingsPanel({
  settings,
  hasImages,
  onChange,
  onAspectChange,
}: CanvasSettingsPanelProps) {
  return (
    <div className="panel-section">
      <h3>Canvas</h3>
      <label className="field">
        <span>Aspect ratio</span>
        <select
          value={settings.aspect}
          onChange={(e) => onAspectChange(e.target.value as CanvasAspect)}
        >
          {ASPECT_OPTIONS.map((a) => (
            <option key={a} value={a} disabled={a === "match-first" && !hasImages}>
              {ASPECT_LABELS[a]}
            </option>
          ))}
        </select>
      </label>
      <p className="field-hint">
        “Match first image” sizes the canvas to the aspect ratio &amp; resolution of the first
        image you uploaded, so everything else lines up against it.
      </p>
      <div className="field-row">
        <label className="field">
          <span>Width (px)</span>
          <input
            type="number"
            min={64}
            max={8000}
            value={Math.round(settings.width)}
            disabled={settings.aspect !== "custom"}
            onChange={(e) =>
              onChange({ ...settings, width: Number(e.target.value) || settings.width })
            }
          />
        </label>
        <label className="field">
          <span>Height (px)</span>
          <input
            type="number"
            min={64}
            max={8000}
            value={Math.round(settings.height)}
            disabled={settings.aspect !== "custom"}
            onChange={(e) =>
              onChange({ ...settings, height: Number(e.target.value) || settings.height })
            }
          />
        </label>
      </div>
      <label className="field field--inline">
        <span>Transparent background</span>
        <input
          type="checkbox"
          checked={settings.transparentBackground}
          onChange={(e) => onChange({ ...settings, transparentBackground: e.target.checked })}
        />
      </label>
      {!settings.transparentBackground && (
        <label className="field field--inline">
          <span>Background color</span>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => onChange({ ...settings, backgroundColor: e.target.value })}
          />
        </label>
      )}
    </div>
  );
}
