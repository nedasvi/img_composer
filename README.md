# Collage Composer

A browser-based collage maker. Upload any number of images, arrange them on one canvas, and export the result as a single image — no server, no uploads, everything runs client-side.

## Features

- **Bulk upload** via drag-and-drop or file picker — JPG, PNG, WebP, GIF, BMP, AVIF, SVG, and more (anything the browser can decode).
- **Two layout modes**
  - *Evenly aligned grid* — auto-tiled grid with adjustable columns, gap, and fit mode (cover/contain/stretch).
  - *Free-form scatter* — drag to move, drag the corner handle to resize, adjust rotation, reorder z-index.
- **Canvas sizing** — pick a standard aspect ratio, or "Match first image" to size the canvas to the resolution/aspect ratio of the first image you upload so everything else lines up against it.
- **Export** — PNG (with transparency), JPEG, or WebP, at up to 3× the canvas resolution.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static production build in `dist/` that can be hosted anywhere (no backend required).
