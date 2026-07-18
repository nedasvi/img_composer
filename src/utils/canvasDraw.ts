import type {
  CanvasSettings,
  ComposerImage,
  CropState,
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

export interface Placement {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/** Computes where to draw a bitmap so it fills (and can be cropped/panned within) a rect. */
export function computeCoverPlacement(
  rectWidth: number,
  rectHeight: number,
  bitmapWidth: number,
  bitmapHeight: number,
  crop: CropState,
): Placement {
  const baseScale = Math.max(rectWidth / bitmapWidth, rectHeight / bitmapHeight);
  const scale = baseScale * Math.max(1, crop.zoom);
  const dw = bitmapWidth * scale;
  const dh = bitmapHeight * scale;
  const maxPanX = Math.max(0, (dw - rectWidth) / 2);
  const maxPanY = Math.max(0, (dh - rectHeight) / 2);
  const dx = (rectWidth - dw) / 2 + crop.offsetX * maxPanX;
  const dy = (rectHeight - dh) / 2 + crop.offsetY * maxPanY;
  return { dx, dy, dw, dh };
}

function drawImageInRect(
  ctx: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  rect: GridCell,
  fitMode: FitMode,
  crop: CropState,
) {
  const { x, y, width: rw, height: rh } = rect;
  const bw = bitmap.width;
  const bh = bitmap.height;
  if (rw <= 0 || rh <= 0 || bw <= 0 || bh <= 0) return;

  if (fitMode === "stretch") {
    ctx.drawImage(bitmap, x, y, rw, rh);
    return;
  }

  if (fitMode === "cover") {
    const { dx, dy, dw, dh } = computeCoverPlacement(rw, rh, bw, bh, crop);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, rw, rh);
    ctx.clip();
    ctx.drawImage(bitmap, x + dx, y + dy, dw, dh);
    ctx.restore();
    return;
  }

  // contain: whole image visible, no cropping possible.
  const scale = Math.min(rw / bw, rh / bh);
  const dw = bw * scale;
  const dh = bh * scale;
  ctx.drawImage(bitmap, x + (rw - dw) / 2, y + (rh - dh) / 2, dw, dh);
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
      if (cell) drawImageInRect(ctx, img.bitmap, cell, grid.fitMode, img.crop);
    });
    if (showSelectionChrome && selectedId) {
      const selIndex = images.findIndex((img) => img.id === selectedId);
      const cell = selIndex >= 0 ? cells[selIndex] : null;
      if (cell) {
        ctx.save();
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = Math.max(3, Math.min(width, height) * 0.005);
        ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
        ctx.restore();
      }
    }
    return;
  }

  // Freeform: draw in z-index order, each with its own rotation.
  const ordered = [...images].sort((a, b) => a.zIndex - b.zIndex);
  for (const img of ordered) {
    const { x, y, width: w, height: h, rotation } = img.transform;
    const { dx, dy, dw, dh } = computeCoverPlacement(w, h, img.bitmap.width, img.bitmap.height, img.crop);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.rect(-w / 2, -h / 2, w, h);
    ctx.clip();
    ctx.drawImage(img.bitmap, -w / 2 + dx, -h / 2 + dy, dw, dh);
    ctx.restore();

    if (showSelectionChrome && img.id === selectedId) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = Math.max(3, Math.min(width, height) * 0.005);
      ctx.setLineDash([Math.max(6, w * 0.02), Math.max(4, w * 0.015)]);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.setLineDash([]);

      const handleRadius = Math.max(12, Math.min(width, height) * 0.016);
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, handleRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = Math.max(3, handleRadius * 0.28);
      ctx.strokeStyle = "#6366f1";
      ctx.stroke();
      ctx.restore();
    }
  }
}
