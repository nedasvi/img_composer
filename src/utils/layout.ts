import type { ComposerImage, Transform } from "../types";

export interface GridCell {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Computes an evenly-tiled grid of cells that fills the given canvas size. */
export function computeGridCells(
  count: number,
  canvasWidth: number,
  canvasHeight: number,
  gap: number,
  columnsOverride: number | "auto",
): GridCell[] {
  if (count <= 0) return [];

  const aspect = canvasWidth / canvasHeight;
  let cols =
    columnsOverride === "auto"
      ? Math.max(1, Math.round(Math.sqrt(count * aspect)))
      : Math.max(1, Math.min(columnsOverride, count));
  cols = Math.min(cols, count);
  let rows = Math.ceil(count / cols);

  // Try to avoid a sparsely-populated final row when we can shrink columns instead.
  if (columnsOverride === "auto") {
    while (cols > 1 && Math.ceil(count / (cols - 1)) === rows) {
      cols -= 1;
    }
    rows = Math.ceil(count / cols);
  }

  const cellWidth = (canvasWidth - gap * (cols + 1)) / cols;
  const cellHeight = (canvasHeight - gap * (rows + 1)) / rows;

  const cells: GridCell[] = [];
  let remaining = count;
  for (let row = 0; row < rows; row++) {
    const itemsInRow = Math.min(cols, remaining);
    const rowWidth = itemsInRow * cellWidth + (itemsInRow - 1) * gap;
    const rowOffsetX = (canvasWidth - rowWidth) / 2;
    const y = gap + row * (cellHeight + gap);
    for (let col = 0; col < itemsInRow; col++) {
      const x = rowOffsetX + col * (cellWidth + gap);
      cells.push({ x, y, width: cellWidth, height: cellHeight });
    }
    remaining -= itemsInRow;
  }
  return cells;
}

/** Produces a natural, slightly-overlapping scattered arrangement for freeform mode. */
export function scatterTransform(
  image: ComposerImage,
  canvasWidth: number,
  canvasHeight: number,
  index: number,
  total: number,
  tiltEnabled: boolean = false,
): Transform {
  const targetLong = Math.min(canvasWidth, canvasHeight) * (total > 6 ? 0.32 : 0.42);
  const aspect = image.naturalWidth / image.naturalHeight;
  const width = aspect >= 1 ? targetLong : targetLong * aspect;
  const height = aspect >= 1 ? targetLong / aspect : targetLong;

  // Deterministic pseudo-random spread based on index so re-layout is stable per image.
  const seed = (index * 9301 + 49297) % 233280;
  const rand = (seed / 233280) * 2 - 1; // -1..1
  const seed2 = ((index + 1) * 4931 + 12345) % 233280;
  const rand2 = (seed2 / 233280) * 2 - 1;

  const marginX = width / 2;
  const marginY = height / 2;
  const cols = Math.ceil(Math.sqrt(total));
  const rowIdx = Math.floor(index / cols);
  const colIdx = index % cols;
  const cellW = canvasWidth / cols;
  const cellH = canvasHeight / Math.ceil(total / cols);

  const baseX = cellW * (colIdx + 0.5);
  const baseY = cellH * (rowIdx + 0.5);

  const x = clamp(baseX + rand * cellW * 0.25, marginX, canvasWidth - marginX);
  const y = clamp(baseY + rand2 * cellH * 0.25, marginY, canvasHeight - marginY);
  const rotation = tiltEnabled ? rand * 14 : 0;

  return { x, y, width, height, rotation };
}

function clamp(v: number, min: number, max: number): number {
  if (min > max) return (min + max) / 2;
  return Math.min(max, Math.max(min, v));
}
