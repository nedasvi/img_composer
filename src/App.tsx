import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { UploadZone } from "./components/UploadZone";
import { ImageList } from "./components/ImageList";
import { CanvasSettingsPanel } from "./components/CanvasSettingsPanel";
import { LayoutPanel } from "./components/LayoutPanel";
import { SelectedImagePanel } from "./components/SelectedImagePanel";
import { ExportPanel } from "./components/ExportPanel";
import { CollageCanvas } from "./components/CollageCanvas";
import type { CanvasAspect, CanvasSettings, ComposerImage, GridSettings, LayoutMode, Transform } from "./types";
import { loadImageFiles } from "./utils/loadImage";
import { scatterTransform } from "./utils/layout";
import { dimensionsForAspect } from "./utils/aspect";
import { downloadBlob, exportCompositionBlob, type ExportFormat } from "./utils/exportCanvas";

const DEFAULT_CANVAS: CanvasSettings = {
  width: 1600,
  height: 1600,
  aspect: "match-first",
  backgroundColor: "#f5f5f0",
  transparentBackground: false,
};

const DEFAULT_GRID: GridSettings = { fitMode: "cover", gap: 16, columns: "auto" };

function App() {
  const [images, setImages] = useState<ComposerImage[]>([]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>(DEFAULT_CANVAS);
  const [gridSettings, setGridSettings] = useState<GridSettings>(DEFAULT_GRID);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [failedUploads, setFailedUploads] = useState<string[]>([]);

  const handleFilesAdded = useCallback(
    async (files: File[]) => {
      const { images: newImages, failed } = await loadImageFiles(files);
      if (failed.length) setFailedUploads((prev) => [...prev, ...failed]);
      if (newImages.length === 0) return;

      setImages((prevImages) => {
        const combined = [...prevImages, ...newImages];
        let nextSettings = canvasSettings;

        if (canvasSettings.aspect === "match-first" && prevImages.length === 0) {
          const first = combined[0];
          const dims = dimensionsForAspect(
            "match-first",
            { width: first.naturalWidth, height: first.naturalHeight },
            { width: canvasSettings.width, height: canvasSettings.height },
          );
          nextSettings = { ...canvasSettings, ...dims };
          setCanvasSettings(nextSettings);
        }

        const maxZ = prevImages.reduce((m, i) => Math.max(m, i.zIndex), 0);
        newImages.forEach((img, idx) => {
          img.transform = scatterTransform(
            img,
            nextSettings.width,
            nextSettings.height,
            prevImages.length + idx,
            combined.length,
          );
          img.zIndex = maxZ + idx + 1;
        });

        return combined;
      });
    },
    [canvasSettings],
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      target?.bitmap.close();
      return prev.filter((i) => i.id !== id);
    });
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const clearAll = useCallback(() => {
    setImages((prev) => {
      prev.forEach((i) => i.bitmap.close());
      return [];
    });
    setSelectedId(null);
  }, []);

  const reorderImages = useCallback((fromId: string, toId: string) => {
    setImages((prev) => {
      const fromIndex = prev.findIndex((i) => i.id === fromId);
      const toIndex = prev.findIndex((i) => i.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const updateTransform = useCallback((id: string, transform: Transform) => {
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, transform } : i)));
  }, []);

  const patchTransform = useCallback((id: string, patch: Partial<Transform>) => {
    setImages((prev) =>
      prev.map((i) => (i.id === id ? { ...i, transform: { ...i.transform, ...patch } } : i)),
    );
  }, []);

  const bringToFront = useCallback((id: string) => {
    setImages((prev) => {
      const maxZ = prev.reduce((m, i) => Math.max(m, i.zIndex), 0);
      return prev.map((i) => (i.id === id ? { ...i, zIndex: maxZ + 1 } : i));
    });
  }, []);

  const sendToBack = useCallback((id: string) => {
    setImages((prev) => {
      const minZ = prev.reduce((m, i) => Math.min(m, i.zIndex), 0);
      return prev.map((i) => (i.id === id ? { ...i, zIndex: minZ - 1 } : i));
    });
  }, []);

  const handleInteractionStart = useCallback(
    (id: string) => {
      setSelectedId(id);
      bringToFront(id);
    },
    [bringToFront],
  );

  const rescatter = useCallback(() => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        transform: scatterTransform(img, canvasSettings.width, canvasSettings.height, idx, prev.length),
      })),
    );
  }, [canvasSettings.width, canvasSettings.height]);

  const handleAspectChange = useCallback(
    (aspect: CanvasAspect) => {
      const first = images[0] ? { width: images[0].naturalWidth, height: images[0].naturalHeight } : null;
      const dims = dimensionsForAspect(aspect, first, {
        width: canvasSettings.width,
        height: canvasSettings.height,
      });
      setCanvasSettings((prev) => ({ ...prev, aspect, ...dims }));
    },
    [images, canvasSettings.width, canvasSettings.height],
  );

  // Keep "match first image" canvas sizing in sync if the first image changes.
  useEffect(() => {
    if (canvasSettings.aspect !== "match-first") return;
    const first = images[0];
    if (!first) return;
    const dims = dimensionsForAspect(
      "match-first",
      { width: first.naturalWidth, height: first.naturalHeight },
      { width: canvasSettings.width, height: canvasSettings.height },
    );
    if (dims.width !== canvasSettings.width || dims.height !== canvasSettings.height) {
      setCanvasSettings((prev) => ({ ...prev, ...dims }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images[0]?.id]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!selectedId || layoutMode !== "freeform") return;
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        removeImage(selectedId);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, layoutMode, removeImage]);

  const selectedImage = useMemo(
    () => images.find((i) => i.id === selectedId) ?? null,
    [images, selectedId],
  );

  const handleExport = useCallback(
    async (format: ExportFormat, quality: number, scale: number) => {
      const blob = await exportCompositionBlob({
        images,
        settings: canvasSettings,
        layoutMode,
        grid: gridSettings,
        format,
        quality,
        scale,
      });
      const ext = format === "jpeg" ? "jpg" : format;
      downloadBlob(blob, `collage.${ext}`);
    },
    [images, canvasSettings, layoutMode, gridSettings],
  );

  const hasImages = images.length > 0;

  return (
    <div className="app">
      <header className="app__header">
        <h1>Collage Composer</h1>
        <p>Upload any number of images, arrange them into one canvas, and export the result.</p>
      </header>

      {failedUploads.length > 0 && (
        <div className="banner banner--warning" role="alert">
          <span>
            {failedUploads.length} file{failedUploads.length > 1 ? "s" : ""} couldn't be loaded as
            images and were skipped.
          </span>
          <button type="button" onClick={() => setFailedUploads([])}>
            Dismiss
          </button>
        </div>
      )}

      {!hasImages ? (
        <div className="empty-state">
          <UploadZone onFiles={handleFilesAdded} />
        </div>
      ) : (
        <div className="editor">
          <div className="editor__stage">
            <div className="canvas-stage">
              <CollageCanvas
                images={images}
                settings={canvasSettings}
                layoutMode={layoutMode}
                grid={gridSettings}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onInteractionStart={handleInteractionStart}
                onTransformChange={updateTransform}
              />
            </div>
            <p className="canvas-stage__dims">
              {Math.round(canvasSettings.width)} × {Math.round(canvasSettings.height)}px
            </p>
          </div>

          <aside className="editor__sidebar">
            <UploadZone onFiles={handleFilesAdded} compact />
            <ImageList
              images={images}
              selectedId={selectedId}
              reorderable={layoutMode === "grid"}
              onSelect={setSelectedId}
              onRemove={removeImage}
              onReorder={reorderImages}
              onClearAll={clearAll}
            />
            <CanvasSettingsPanel
              settings={canvasSettings}
              hasImages={hasImages}
              onChange={setCanvasSettings}
              onAspectChange={handleAspectChange}
            />
            <LayoutPanel
              layoutMode={layoutMode}
              grid={gridSettings}
              onLayoutModeChange={setLayoutMode}
              onGridChange={setGridSettings}
              onRescatter={rescatter}
            />
            {layoutMode === "freeform" && selectedImage && (
              <SelectedImagePanel
                image={selectedImage}
                onChange={patchTransform}
                onBringToFront={bringToFront}
                onSendToBack={sendToBack}
                onRemove={removeImage}
              />
            )}
            <ExportPanel
              disabled={!hasImages}
              width={canvasSettings.width}
              height={canvasSettings.height}
              onExport={handleExport}
            />
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
