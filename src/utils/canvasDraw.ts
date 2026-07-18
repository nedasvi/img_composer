import type {
  CanvasSettings,
  ComposerImage,
  FitMode,
  GridSettings,
  LayoutMode,
} from "../types";
import { computeGridCells, type GridCell } from "./layout";

export interface DrawOptions {
  images: ComposerImage[];
  settings: CanvasSettings;
  layoutMode: LayoutMode;
  grid: GridSettings;
  selectedId?: string | null;
  showSelectionChrome?: boolean;
}

function drawImageInRect(
  ctx: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  rect: GridCell,
  fitMode: FitMode,
) {
  const { x, y, width: rw, height: rh } = rect;
  const bw = bitmap.width;
  const bh = bitmap.height;
  if (rw <= 0 || rh <= 0 || bw <= 0 || bh <= 0) return;

  if (fitMode === "stretch") {
    ctx.drawImage(bitmap, x, y, rw, rh);
    return;
  }

  const scale =
    fitMode === "cover" ? Math.max(rw / bw, rh / bh) : Math.min(rw / bw, rh / bh);
  const dw = bw * scale;
  const dh = bh * scale;
  const dx = x + (rw - dw) / 2;
  const dy = y + (rh - dh) / 2;

  if (fitMode === "cover") {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, rw, rh);
    ctx.clip();
    ctx.drawImage(bitmap, dx, dy, dw, dh);
    ctx.restore();
  } else {
    ctx.drawImage(bitmap, dx, dy, dw, dh);
  }
}

/** Renders the full composition (background, grid or freeform layout) into the given context. */
export function drawComposition(ctx: CanvasRenderingContext2D, opts: DrawOptions) {
  const { images, settings, layoutMode, grid, selectedId, showSelectionChrome } = opts;
  const { width, height } = settings;

  ctx.clearRect(0, 0, width, height);
  if (!settings.transparentBackground) {
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  if (images.length === 0) return;

  if (layoutMode === "grid") {
    const cells = computeGridCells(images.length, width, height, grid.gap, grid.columns);
    images.forEach((img, i) => {
      const cell = cells[i];
      if (cell) drawImageInRect(ctx, img.bitmap, cell, grid.fitMode);
    });
    return;
  }

  // Freeform: draw in z-index order, each with its own rotation.
  const ordered = [...images].sort((a, b) => a.zIndex - b.zIndex);
  for (const img of ordered) {
    const { x, y, width: w, height: h, rotation } = img.transform;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img.bitmap, -w / 2, -h / 2, w, h);
    ctx.restore();

    if (showSelectionChrome && img.id === selectedId) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = Math.max(2, Math.min(width, height) * 0.004);
      ctx.setLineDash([Math.max(6, w * 0.02), Math.max(4, w * 0.015)]);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.setLineDash([]);

      const handleRadius = Math.max(8, Math.min(width, height) * 0.012);
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, handleRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = Math.max(2, handleRadius * 0.25);
      ctx.strokeStyle = "#6366f1";
      ctx.stroke();
      ctx.restore();
    }
  }
}
