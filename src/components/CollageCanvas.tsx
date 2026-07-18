import { useEffect, useRef } from "react";
import type { CanvasSettings, ComposerImage, GridSettings, LayoutMode, Transform } from "../types";
import { drawComposition } from "../utils/canvasDraw";
import { isInsideTransform, isNearResizeHandle } from "../utils/hitTest";
import { computeGridCells } from "../utils/layout";

interface CollageCanvasProps {
  images: ComposerImage[];
  settings: CanvasSettings;
  layoutMode: LayoutMode;
  grid: GridSettings;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onInteractionStart: (id: string) => void;
  onTransformChange: (id: string, transform: Transform) => void;
}

type DragMode = "move" | "resize";

interface DragState {
  mode: DragMode;
  id: string;
  startPointer: { x: number; y: number };
  startTransform: Transform;
}

export function CollageCanvas({
  images,
  settings,
  layoutMode,
  grid,
  selectedId,
  onSelect,
  onInteractionStart,
  onTransformChange,
}: CollageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawComposition(ctx, {
      images,
      settings,
      layoutMode,
      grid,
      selectedId,
      showSelectionChrome: layoutMode === "freeform",
    });
  }, [images, settings, layoutMode, grid, selectedId]);

  function canvasPointFromEvent(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const point = canvasPointFromEvent(e);

    if (layoutMode === "grid") {
      const cells = computeGridCells(images.length, settings.width, settings.height, grid.gap, grid.columns);
      const hitIndex = cells.findIndex(
        (cell) =>
          point.x >= cell.x &&
          point.x <= cell.x + cell.width &&
          point.y >= cell.y &&
          point.y <= cell.y + cell.height,
      );
      onSelect(hitIndex >= 0 ? images[hitIndex].id : null);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const handleRadius = 16 * scale;

    const ordered = [...images].sort((a, b) => b.zIndex - a.zIndex);

    // Prefer the resize handle of the currently selected image, if the pointer is near it.
    const selected = ordered.find((img) => img.id === selectedId);
    if (selected && isNearResizeHandle(point.x, point.y, selected.transform, handleRadius)) {
      dragRef.current = {
        mode: "resize",
        id: selected.id,
        startPointer: point,
        startTransform: selected.transform,
      };
      onInteractionStart(selected.id);
      canvas.setPointerCapture(e.pointerId);
      return;
    }

    for (const img of ordered) {
      if (isNearResizeHandle(point.x, point.y, img.transform, handleRadius)) {
        dragRef.current = {
          mode: "resize",
          id: img.id,
          startPointer: point,
          startTransform: img.transform,
        };
        onInteractionStart(img.id);
        canvas.setPointerCapture(e.pointerId);
        return;
      }
      if (isInsideTransform(point.x, point.y, img.transform)) {
        dragRef.current = {
          mode: "move",
          id: img.id,
          startPointer: point,
          startTransform: img.transform,
        };
        onInteractionStart(img.id);
        canvas.setPointerCapture(e.pointerId);
        return;
      }
    }
    onSelect(null);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const point = canvasPointFromEvent(e);
    const dx = point.x - drag.startPointer.x;
    const dy = point.y - drag.startPointer.y;

    if (drag.mode === "move") {
      onTransformChange(drag.id, {
        ...drag.startTransform,
        x: drag.startTransform.x + dx,
        y: drag.startTransform.y + dy,
      });
    } else {
      const rad = (-drag.startTransform.rotation * Math.PI) / 180;
      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);
      const cornerX = drag.startTransform.width / 2;
      const cornerY = drag.startTransform.height / 2;
      const origDist = Math.hypot(cornerX, cornerY);
      const newDist = Math.hypot(cornerX + localX, cornerY + localY);
      const scale = Math.min(8, Math.max(0.08, newDist / origDist));
      onTransformChange(drag.id, {
        ...drag.startTransform,
        width: drag.startTransform.width * scale,
        height: drag.startTransform.height * scale,
      });
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    dragRef.current = null;
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={settings.width}
      height={settings.height}
      className="collage-canvas collage-canvas--interactive"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}
