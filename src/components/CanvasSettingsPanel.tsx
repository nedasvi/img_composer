import type { CanvasAspect, CanvasSettings } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

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
  const { t } = useLanguage();

  const aspectLabels: Record<CanvasAspect, string> = {
    square: t.aspectSquare,
    "4:3": t.aspect4_3,
    "3:2": t.aspect3_2,
    "16:9": t.aspect16_9,
    "9:16": t.aspect9_16,
    "match-first": t.aspectMatchFirst,
    custom: t.aspectCustom,
  };

  return (
    <div className="panel-section">
      <h3>{t.canvasHeading}</h3>
      <label className="field">
        <span>{t.canvasAspectLabel}</span>
        <select
          value={settings.aspect}
          onChange={(e) => onAspectChange(e.target.value as CanvasAspect)}
        >
          {ASPECT_OPTIONS.map((a) => (
            <option key={a} value={a} disabled={a === "match-first" && !hasImages}>
              {aspectLabels[a]}
            </option>
          ))}
        </select>
      </label>
      <p className="field-hint">{t.canvasAspectHint}</p>
      <div className="field-row">
        <label className="field">
          <span>{t.canvasWidthLabel}</span>
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
          <span>{t.canvasHeightLabel}</span>
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
        <span>{t.canvasTransparentLabel}</span>
        <input
          type="checkbox"
          checked={settings.transparentBackground}
          onChange={(e) => onChange({ ...settings, transparentBackground: e.target.checked })}
        />
      </label>
      {!settings.transparentBackground && (
        <label className="field field--inline">
          <span>{t.canvasBackgroundColorLabel}</span>
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
