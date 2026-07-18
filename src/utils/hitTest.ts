import type { Transform } from "../types";

export interface LocalPoint {
  x: number;
  y: number;
}

/** Converts a canvas-space point into the image's local (unrotated, centered) space. */
export function toLocalSpace(px: number, py: number, t: Transform): LocalPoint {
  const dx = px - t.x;
  const dy = py - t.y;
  const rad = (-t.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: dx * cos - dy * sin, y: dx * sin + dy * cos };
}

export function isInsideTransform(px: number, py: number, t: Transform): boolean {
  const local = toLocalSpace(px, py, t);
  return Math.abs(local.x) <= t.width / 2 && Math.abs(local.y) <= t.height / 2;
}

export function isNearResizeHandle(
  px: number,
  py: number,
  t: Transform,
  handleRadius: number,
): boolean {
  const local = toLocalSpace(px, py, t);
  const cornerX = t.width / 2;
  const cornerY = t.height / 2;
  return Math.hypot(local.x - cornerX, local.y - cornerY) <= handleRadius;
}
