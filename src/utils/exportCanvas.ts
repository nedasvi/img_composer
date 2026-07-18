import type { CanvasSettings, ComposerImage, GridSettings, LayoutMode } from "../types";
import { drawComposition } from "./canvasDraw";

export type ExportFormat = "png" | "jpeg" | "webp";

const MIME: Record<ExportFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export interface ExportOptions {
  images: ComposerImage[];
  settings: CanvasSettings;
  layoutMode: LayoutMode;
  grid: GridSettings;
  format: ExportFormat;
  quality: number; // 0..1, used for jpeg/webp
  scale: number; // export resolution multiplier
}

export async function exportCompositionBlob(opts: ExportOptions): Promise<Blob> {
  const { settings, scale } = opts;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(settings.width * scale);
  canvas.height = Math.round(settings.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create export canvas context");

  ctx.scale(scale, scale);
  drawComposition(ctx, {
    images: opts.images,
    settings: opts.settings,
    layoutMode: opts.layoutMode,
    grid: opts.grid,
    showSelectionChrome: false,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      MIME[opts.format],
      opts.format === "png" ? undefined : opts.quality,
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
