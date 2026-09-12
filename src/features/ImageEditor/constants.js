export const CUSTOM_PROPS = [
  'layerId',
  'layerName',
  'layerType',
  'locked',
  'isMainImage',
  'isArtboard',
  'isCropGuide',
  'isGuide',
];

export const MAX_FILE_BYTES = 80 * 1024 * 1024;
export const WARN_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_EDGE = 8192;
export const WORK_EDGE = 4096;
export const HISTORY_LIMIT = 40;
export const MIN_ZOOM = 0.05;
export const MAX_ZOOM = 8;
export const NUDGE = 1;
export const NUDGE_FAST = 10;
export const DESKTOP_MQ = '(min-width: 768px)';

export const ACCEPT_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

export const ACCEPT_ATTR = ACCEPT_TYPES.join(',');
export const ACCEPT_LABEL = 'JPG, PNG, WebP, AVIF';

export const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Impact',
  'Trebuchet MS',
];

export const TOOLS = {
  select: 'select',
  pan: 'pan',
  crop: 'crop',
  eyedropper: 'eyedropper',
  text: 'text',
  pencil: 'pencil',
  brush: 'brush',
  marker: 'marker',
  highlighter: 'highlighter',
  eraser: 'eraser',
  line: 'line',
  arrow: 'arrow',
  rect: 'rect',
  roundRect: 'roundRect',
  circle: 'circle',
  ellipse: 'ellipse',
  triangle: 'triangle',
  polygon: 'polygon',
  star: 'star',
  blurRegion: 'blurRegion',
  pixelateRegion: 'pixelateRegion',
  mosaic: 'mosaic',
  redact: 'redact',
};

export const BRUSH_TOOLS = new Set([
  TOOLS.pencil,
  TOOLS.brush,
  TOOLS.marker,
  TOOLS.highlighter,
  TOOLS.eraser,
]);

export const SHAPE_TOOLS = new Set([
  TOOLS.line,
  TOOLS.arrow,
  TOOLS.rect,
  TOOLS.roundRect,
  TOOLS.circle,
  TOOLS.ellipse,
  TOOLS.triangle,
  TOOLS.polygon,
  TOOLS.star,
]);

export const REGION_TOOLS = new Set([
  TOOLS.blurRegion,
  TOOLS.pixelateRegion,
  TOOLS.mosaic,
  TOOLS.redact,
]);
