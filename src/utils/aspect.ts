import type { CanvasAspect } from "../types";

export const ASPECT_RATIOS: Record<Exclude<CanvasAspect, "match-first" | "custom">, number> = {
  square: 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
};

export const ASPECT_LABELS: Record<CanvasAspect, string> = {
  square: "Square (1:1)",
  "4:3": "Standard (4:3)",
  "3:2": "Photo (3:2)",
  "16:9": "Widescreen (16:9)",
  "9:16": "Portrait (9:16)",
  "match-first": "Match first image",
  custom: "Custom",
};

const DEFAULT_LONG_EDGE = 1600;

/** Computes concrete canvas pixel dimensions for a given aspect setting. */
export function dimensionsForAspect(
  aspect: CanvasAspect,
  firstImageSize: { width: number; height: number } | null,
  fallback: { width: number; height: number },
): { width: number; height: number } {
  if (aspect === "custom") return fallback;
  if (aspect === "match-first") {
    if (firstImageSize) {
      const { width, height } = firstImageSize;
      const longEdge = Math.max(width, height);
      if (longEdge <= DEFAULT_LONG_EDGE) return { width, height };
      const scale = DEFAULT_LONG_EDGE / longEdge;
      return { width: Math.round(width * scale), height: Math.round(height * scale) };
    }
    return fallback;
  }
  const ratio = ASPECT_RATIOS[aspect];
  if (ratio >= 1) {
    return { width: DEFAULT_LONG_EDGE, height: Math.round(DEFAULT_LONG_EDGE / ratio) };
  }
  return { width: Math.round(DEFAULT_LONG_EDGE * ratio), height: DEFAULT_LONG_EDGE };
}
