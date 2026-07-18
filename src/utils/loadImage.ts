import type { ComposerImage } from "../types";
import { DEFAULT_CROP } from "../types";
import { createId } from "./id";

/** Decodes an image file into a ComposerImage with a default (unset) transform. */
export async function loadImageFile(file: File): Promise<ComposerImage | null> {
  try {
    const bitmap = await createImageBitmap(file);
    return {
      id: createId(),
      file,
      name: file.name,
      bitmap,
      naturalWidth: bitmap.width,
      naturalHeight: bitmap.height,
      transform: { x: 0, y: 0, width: 0, height: 0, rotation: 0 },
      zIndex: 0,
      crop: { ...DEFAULT_CROP },
    };
  } catch (err) {
    console.warn(`Could not decode "${file.name}" as an image`, err);
    return null;
  }
}

export async function loadImageFiles(
  files: File[],
): Promise<{ images: ComposerImage[]; failed: string[] }> {
  const imageFiles = files.filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|gif|webp|bmp|avif|svg|heic|heif)$/i.test(f.name));
  const results = await Promise.all(imageFiles.map(loadImageFile));
  const images: ComposerImage[] = [];
  const failed: string[] = [];
  results.forEach((res, i) => {
    if (res) images.push(res);
    else failed.push(imageFiles[i].name);
  });
  const skippedCount = files.length - imageFiles.length;
  for (let i = 0; i < skippedCount; i++) failed.push("(non-image file skipped)");
  return { images, failed };
}
