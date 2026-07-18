import type { FitMode, GridSettings, LayoutMode } from "../types";

interface LayoutPanelProps {
  layoutMode: LayoutMode;
  grid: GridSettings;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onGridChange: (grid: GridSettings) => void;
  onRescatter: () => void;
}

export function LayoutPanel({
  layoutMode,
  grid,
  onLayoutModeChange,
  onGridChange,
  onRescatter,
}: LayoutPanelProps) {
  return (
    <div className="panel-section">
      <h3>Layout</h3>
      <div className="segmented">
        <button
          type="button"
          className={layoutMode === "grid" ? "segmented__active" : ""}
          onClick={() => onLayoutModeChange("grid")}
        >
          Evenly aligned grid
        </button>
        <button
          type="button"
          className={layoutMode === "freeform" ? "segmented__active" : ""}
          onClick={() => onLayoutModeChange("freeform")}
        >
          Free-form scatter
        </button>
      </div>

      {layoutMode === "grid" ? (
        <>
          <label className="field">
            <span>Fit mode</span>
            <select
              value={grid.fitMode}
              onChange={(e) => onGridChange({ ...grid, fitMode: e.target.value as FitMode })}
            >
              <option value="cover">Cover (crop to fill cell)</option>
              <option value="contain">Contain (fit whole image)</option>
              <option value="stretch">Stretch (ignore aspect ratio)</option>
            </select>
          </label>
          <label className="field">
            <span>Columns</span>
            <select
              value={grid.columns}
              onChange={(e) =>
                onGridChange({
                  ...grid,
                  columns: e.target.value === "auto" ? "auto" : Number(e.target.value),
                })
              }
            >
              <option value="auto">Auto</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Gap: {grid.gap}px</span>
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
          <p className="field-hint">
            Drag images to move them, drag the corner handle to resize, click to select. Selected
            image can be nudged, rotated, or deleted below.
          </p>
          <button type="button" className="secondary-button" onClick={onRescatter}>
            Shuffle arrangement
          </button>
        </>
      )}
    </div>
  );
}
