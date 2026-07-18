import type { FitMode, GridSettings, LayoutMode } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface LayoutPanelProps {
  layoutMode: LayoutMode;
  grid: GridSettings;
  tiltEnabled: boolean;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onGridChange: (grid: GridSettings) => void;
  onTiltChange: (enabled: boolean) => void;
  onRescatter: () => void;
}

export function LayoutPanel({
  layoutMode,
  grid,
  tiltEnabled,
  onLayoutModeChange,
  onGridChange,
  onTiltChange,
  onRescatter,
}: LayoutPanelProps) {
  const { t } = useLanguage();

  return (
    <div className="panel-section">
      <h3>{t.layoutHeading}</h3>
      <div className="segmented">
        <button
          type="button"
          className={layoutMode === "grid" ? "segmented__active" : ""}
          onClick={() => onLayoutModeChange("grid")}
        >
          {t.layoutGridButton}
        </button>
        <button
          type="button"
          className={layoutMode === "freeform" ? "segmented__active" : ""}
          onClick={() => onLayoutModeChange("freeform")}
        >
          {t.layoutFreeformButton}
        </button>
      </div>

      {layoutMode === "grid" ? (
        <>
          <label className="field">
            <span>{t.fitModeLabel}</span>
            <select
              value={grid.fitMode}
              onChange={(e) => onGridChange({ ...grid, fitMode: e.target.value as FitMode })}
            >
              <option value="cover">{t.fitModeCover}</option>
              <option value="contain">{t.fitModeContain}</option>
              <option value="stretch">{t.fitModeStretch}</option>
            </select>
          </label>
          <label className="field">
            <span>{t.columnsLabel}</span>
            <select
              value={grid.columns}
              onChange={(e) =>
                onGridChange({
                  ...grid,
                  columns: e.target.value === "auto" ? "auto" : Number(e.target.value),
                })
              }
            >
              <option value="auto">{t.columnsAuto}</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{t.gapLabel(grid.gap)}</span>
            <input
              type="range"
              min={0}
              max={80}
              value={grid.gap}
              onChange={(e) => onGridChange({ ...grid, gap: Number(e.target.value) })}
            />
          </label>
        </>
      ) : (
        <>
          <p className="field-hint">{t.freeformHint}</p>
          <label className="field field--inline">
            <span>{t.tiltLabel}</span>
            <input
              type="checkbox"
              checked={tiltEnabled}
              onChange={(e) => onTiltChange(e.target.checked)}
            />
          </label>
          <p className="field-hint">{t.tiltHint}</p>
          <button type="button" className="secondary-button" onClick={onRescatter}>
            {t.shuffleButton}
          </button>
        </>
      )}
    </div>
  );
}
