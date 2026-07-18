export type FitMode = "cover" | "contain" | "stretch";

export type LayoutMode = "grid" | "freeform";

export type CanvasAspect =
  | "square"
  | "4:3"
  | "3:2"
  | "16:9"
  | "9:16"
  | "match-first"
  | "custom";

export interface Transform {
  /** center x, in canvas pixels */
  x: number;
  /** center y, in canvas pixels */
  y: number;
  /** width, in canvas pixels */
  width: number;
  /** height, in canvas pixels */
  height: number;
  /** rotation in degrees */
  rotation: number;
}

export interface CropState {
  /** how far zoomed in past the base "fill the frame" size, 1 = no extra crop */
  zoom: number;
  /** pan offset as a fraction of the available range, -1..1, 0 = centered */
  offsetX: number;
  /** pan offset as a fraction of the available range, -1..1, 0 = centered */
  offsetY: number;
}

export const DEFAULT_CROP: CropState = { zoom: 1, offsetX: 0, offsetY: 0 };

export interface ComposerImage {
  id: string;
  file: File;
  name: string;
  bitmap: ImageBitmap;
  naturalWidth: number;
  naturalHeight: number;
  /** freeform placement, populated lazily */
  transform: Transform;
  /** stacking order in freeform mode, higher draws on top */
  zIndex: number;
  /** which part of the photo is visible within its frame */
  crop: CropState;
}

export interface CanvasSettings {
  width: number;
  height: number;
  aspect: CanvasAspect;
  backgroundColor: string;
  transparentBackground: boolean;
}

export interface GridSettings {
  fitMode: FitMode;
  gap: number;
  columns: number | "auto";
}

export type ExportFormat = "png" | "jpeg" | "webp";
