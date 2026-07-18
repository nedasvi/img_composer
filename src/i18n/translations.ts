export type Lang = "en" | "ru";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export interface Dictionary {
  appTitle: string;
  appSubtitle: string;

  bannerDismiss: string;
  bannerFailedFiles: (count: number) => string;

  uploadTitle: string;
  uploadHint: string;
  uploadCompact: string;

  imagesHeading: (count: number) => string;
  imagesReorderHint: string;
  imagesClearAll: string;
  imagesRemove: (name: string) => string;

  canvasHeading: string;
  canvasAspectLabel: string;
  canvasAspectHint: string;
  aspectSquare: string;
  aspect4_3: string;
  aspect3_2: string;
  aspect16_9: string;
  aspect9_16: string;
  aspectMatchFirst: string;
  aspectCustom: string;
  canvasWidthLabel: string;
  canvasHeightLabel: string;
  canvasTransparentLabel: string;
  canvasBackgroundColorLabel: string;

  layoutHeading: string;
  layoutGridButton: string;
  layoutFreeformButton: string;
  fitModeLabel: string;
  fitModeCover: string;
  fitModeContain: string;
  fitModeStretch: string;
  columnsLabel: string;
  columnsAuto: string;
  gapLabel: (px: number) => string;
  freeformHint: string;
  tiltLabel: string;
  tiltHint: string;
  shuffleButton: string;

  selectedHeading: (name: string) => string;
  sizeLabel: (px: number) => string;
  rotationLabel: (deg: number) => string;
  bringToFront: string;
  sendToBack: string;
  deleteImage: string;

  cropHeading: string;
  cropZoomLabel: (percent: number) => string;
  cropMoveHint: string;
  cropMoveUp: string;
  cropMoveDown: string;
  cropMoveLeft: string;
  cropMoveRight: string;
  cropReset: string;
  cropUnavailable: string;

  exportHeading: string;
  exportFormatLabel: string;
  exportFormatPng: string;
  exportFormatJpeg: string;
  exportFormatWebp: string;
  exportQualityLabel: (percent: number) => string;
  exportResolutionLabel: (w: number, h: number) => string;
  exportResHalf: string;
  exportResCanvas: string;
  exportResHigh: string;
  exportResMax: string;
  exportButton: string;
  exportButtonBusy: string;
  exportDisabledHint: string;

  languageLabel: string;
}

export const dictionaries: Record<Lang, Dictionary> = {
  en: {
    appTitle: "Collage Composer",
    appSubtitle: "Upload your photos, arrange them on one canvas, and save the result as a picture.",

    bannerDismiss: "Dismiss",
    bannerFailedFiles: (count) =>
      `${count} file${count === 1 ? "" : "s"} could not be opened as a picture and ${
        count === 1 ? "was" : "were"
      } skipped.`,

    uploadTitle: "Add your photos",
    uploadHint: "Tap here to choose photos from your device. You can add as many as you like, in any common format.",
    uploadCompact: "+ Add more photos",

    imagesHeading: (count) => `Your photos (${count})`,
    imagesReorderHint: "Press and drag a photo up or down to change its place in the grid.",
    imagesClearAll: "Remove all",
    imagesRemove: (name) => `Remove ${name}`,

    canvasHeading: "Canvas size",
    canvasAspectLabel: "Shape",
    canvasAspectHint:
      "“Match first photo” makes the canvas the same shape as the first photo you added, so everything else lines up with it.",
    aspectSquare: "Square",
    aspect4_3: "Standard (4:3)",
    aspect3_2: "Photo (3:2)",
    aspect16_9: "Wide (16:9)",
    aspect9_16: "Tall (9:16)",
    aspectMatchFirst: "Match first photo",
    aspectCustom: "Custom size",
    canvasWidthLabel: "Width (pixels)",
    canvasHeightLabel: "Height (pixels)",
    canvasTransparentLabel: "See-through background",
    canvasBackgroundColorLabel: "Background color",

    layoutHeading: "Arrangement",
    layoutGridButton: "Neat grid",
    layoutFreeformButton: "Scattered, movable",
    fitModeLabel: "How photos fill each box",
    fitModeCover: "Fill the box (crop edges)",
    fitModeContain: "Show the whole photo (may add borders)",
    fitModeStretch: "Stretch to fit (may distort)",
    columnsLabel: "Number of columns",
    columnsAuto: "Choose automatically",
    gapLabel: (px) => `Space between photos: ${px}px`,
    freeformHint:
      "Drag a photo to move it. Drag the small circle in its corner to resize it. Tap a photo to select it.",
    tiltLabel: "Tilt photos slightly, like a scrapbook",
    tiltHint: "When off, photos are placed straight, not at an angle.",
    shuffleButton: "Rearrange photos",

    selectedHeading: (name) => `Selected: ${name}`,
    sizeLabel: (px) => `Size: ${px}px`,
    rotationLabel: (deg) => `Rotation: ${deg}°`,
    bringToFront: "Move to front",
    sendToBack: "Move to back",
    deleteImage: "Remove this photo",

    cropHeading: "Crop this photo",
    cropZoomLabel: (percent) => `Zoom: ${percent}%`,
    cropMoveHint: "Use the arrows to move the photo inside its frame.",
    cropMoveUp: "Move photo up",
    cropMoveDown: "Move photo down",
    cropMoveLeft: "Move photo left",
    cropMoveRight: "Move photo right",
    cropReset: "Reset crop",
    cropUnavailable: "Cropping is available when “Fill the box” is selected above.",

    exportHeading: "Save your collage",
    exportFormatLabel: "File type",
    exportFormatPng: "PNG (best quality, larger file)",
    exportFormatJpeg: "JPEG (smaller file)",
    exportFormatWebp: "WebP (small file, good quality)",
    exportQualityLabel: (percent) => `Quality: ${percent}%`,
    exportResolutionLabel: (w, h) => `Picture size: ${w}×${h}px`,
    exportResHalf: "Smaller (half size)",
    exportResCanvas: "Normal (canvas size)",
    exportResHigh: "High quality (2×)",
    exportResMax: "Best quality (3×)",
    exportButton: "Download my collage",
    exportButtonBusy: "Preparing…",
    exportDisabledHint: "Add at least one photo to save your collage.",

    languageLabel: "Language",
  },
  ru: {
    appTitle: "Конструктор коллажей",
    appSubtitle: "Загрузите фотографии, расположите их на одном холсте и сохраните результат как картинку.",

    bannerDismiss: "Закрыть",
    bannerFailedFiles: (count) => `${count} ${ruPluralFiles(count)} не удалось открыть как изображение, и ${
      count === 1 ? "он был пропущен" : "они были пропущены"
    }.`,

    uploadTitle: "Добавьте фотографии",
    uploadHint: "Нажмите здесь, чтобы выбрать фото с вашего устройства. Можно добавить сколько угодно, в любом обычном формате.",
    uploadCompact: "+ Добавить ещё фото",

    imagesHeading: (count) => `Ваши фото (${count})`,
    imagesReorderHint: "Нажмите и перетащите фото вверх или вниз, чтобы изменить его место в сетке.",
    imagesClearAll: "Удалить все",
    imagesRemove: (name) => `Удалить ${name}`,

    canvasHeading: "Размер холста",
    canvasAspectLabel: "Форма",
    canvasAspectHint:
      "«По первому фото» делает холст такой же формы, как первое добавленное фото, чтобы всё остальное было выровнено по нему.",
    aspectSquare: "Квадрат",
    aspect4_3: "Стандартный (4:3)",
    aspect3_2: "Фото (3:2)",
    aspect16_9: "Широкий (16:9)",
    aspect9_16: "Высокий (9:16)",
    aspectMatchFirst: "По первому фото",
    aspectCustom: "Свой размер",
    canvasWidthLabel: "Ширина (пикселей)",
    canvasHeightLabel: "Высота (пикселей)",
    canvasTransparentLabel: "Прозрачный фон",
    canvasBackgroundColorLabel: "Цвет фона",

    layoutHeading: "Расположение",
    layoutGridButton: "Ровная сетка",
    layoutFreeformButton: "Свободно, можно двигать",
    fitModeLabel: "Как фото заполняют ячейку",
    fitModeCover: "Заполнить ячейку (обрезать края)",
    fitModeContain: "Показать всё фото (могут быть поля)",
    fitModeStretch: "Растянуть по размеру (может исказить)",
    columnsLabel: "Количество столбцов",
    columnsAuto: "Выбрать автоматически",
    gapLabel: (px) => `Расстояние между фото: ${px}px`,
    freeformHint:
      "Перетащите фото, чтобы переместить его. Потяните за кружок в углу, чтобы изменить размер. Нажмите на фото, чтобы выбрать его.",
    tiltLabel: "Слегка наклонять фото, как в альбоме",
    tiltHint: "Если выключено, фото располагаются ровно, без наклона.",
    shuffleButton: "Расположить заново",

    selectedHeading: (name) => `Выбрано: ${name}`,
    sizeLabel: (px) => `Размер: ${px}px`,
    rotationLabel: (deg) => `Поворот: ${deg}°`,
    bringToFront: "Переместить наверх",
    sendToBack: "Переместить назад",
    deleteImage: "Удалить это фото",

    cropHeading: "Обрезка фото",
    cropZoomLabel: (percent) => `Масштаб: ${percent}%`,
    cropMoveHint: "Используйте стрелки, чтобы сдвинуть фото внутри рамки.",
    cropMoveUp: "Сдвинуть фото вверх",
    cropMoveDown: "Сдвинуть фото вниз",
    cropMoveLeft: "Сдвинуть фото влево",
    cropMoveRight: "Сдвинуть фото вправо",
    cropReset: "Сбросить обрезку",
    cropUnavailable: "Обрезка доступна, когда выше выбрано «Заполнить ячейку».",

    exportHeading: "Сохранить коллаж",
    exportFormatLabel: "Тип файла",
    exportFormatPng: "PNG (лучшее качество, файл больше)",
    exportFormatJpeg: "JPEG (файл меньше)",
    exportFormatWebp: "WebP (маленький файл, хорошее качество)",
    exportQualityLabel: (percent) => `Качество: ${percent}%`,
    exportResolutionLabel: (w, h) => `Размер картинки: ${w}×${h}px`,
    exportResHalf: "Меньше (половина размера)",
    exportResCanvas: "Обычный (размер холста)",
    exportResHigh: "Высокое качество (2×)",
    exportResMax: "Наилучшее качество (3×)",
    exportButton: "Скачать коллаж",
    exportButtonBusy: "Готовим…",
    exportDisabledHint: "Добавьте хотя бы одно фото, чтобы сохранить коллаж.",

    languageLabel: "Язык",
  },
};

function ruPluralFiles(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "файл";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "файла";
  return "файлов";
}
