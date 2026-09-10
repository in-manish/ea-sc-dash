import { FREE_ASPECT, SQUARE_ASPECT } from './sizeSuggestions';

const logo = {
  aspectRatios: FREE_ASPECT,
  recommended: {
    web: { width: 400, height: 200, maxKb: 80 },
    mobile: { width: 200, height: 100, maxKb: 40 },
    note: 'Keep logos sharp and light. Transparent PNG if you skip Optimize.',
  },
  maxOutputDim: 1200,
  allowOptimize: true,
  defaultOptimize: true,
};

const banner = {
  aspectRatios: FREE_ASPECT,
  recommended: {
    web: { width: 1920, height: 600, maxKb: 250 },
    mobile: { width: 1080, height: 540, maxKb: 120 },
    note: 'Wide banners: keep important content in the center third.',
  },
  maxOutputDim: 1920,
  allowOptimize: true,
  defaultOptimize: true,
};

const background = {
  aspectRatios: FREE_ASPECT,
  recommended: {
    web: { width: 1920, height: 1080, maxKb: 300 },
    mobile: { width: 1080, height: 1920, maxKb: 180 },
    note: 'Full-bleed backgrounds. Crop width and height independently to fit web vs mobile.',
  },
  maxOutputDim: 1920,
  allowOptimize: true,
  defaultOptimize: true,
};

const avatar = {
  aspectRatios: SQUARE_ASPECT,
  recommended: {
    web: { width: 400, height: 400, maxKb: 80 },
    mobile: { width: 200, height: 200, maxKb: 40 },
    note: 'Square portraits crop cleanly in lists and emails.',
  },
  maxOutputDim: 800,
  allowOptimize: true,
  defaultOptimize: true,
};

const product = {
  aspectRatios: SQUARE_ASPECT,
  recommended: {
    web: { width: 800, height: 800, maxKb: 150 },
    mobile: { width: 400, height: 400, maxKb: 70 },
    note: 'Product photos work best square or 4:3.',
  },
  maxOutputDim: 1200,
  allowOptimize: true,
  defaultOptimize: true,
};

const thumbnail = {
  aspectRatios: FREE_ASPECT,
  recommended: {
    web: { width: 640, height: 360, maxKb: 80 },
    mobile: { width: 320, height: 180, maxKb: 40 },
    note: 'Thumbnails are usually 16:9; free crop if the artwork is not wide.',
  },
  maxOutputDim: 1280,
  allowOptimize: true,
  defaultOptimize: true,
};

const badge = {
  aspectRatios: FREE_ASPECT,
  recommended: {
    web: { width: 1000, height: 1400, maxKb: 400 },
    mobile: { width: 500, height: 700, maxKb: 150 },
    note: 'Email badge template is typically 1000×1400 px (portrait).',
  },
  maxOutputDim: 2000,
  allowOptimize: false,
  defaultOptimize: false,
};

const certificate = {
  aspectRatios: FREE_ASPECT,
  recommended: {
    web: { width: 2480, height: 3508, maxKb: 800 },
    mobile: { width: 1240, height: 1754, maxKb: 300 },
    note: 'A4-like portrait (≈ 1:√2). Crop width and height independently to match the print layout.',
  },
  maxOutputDim: 3508,
  allowOptimize: false,
  defaultOptimize: false,
};

const generic = {
  aspectRatios: FREE_ASPECT,
  recommended: {
    web: { width: 1600, height: 1200, maxKb: 250 },
    mobile: { width: 1080, height: 1080, maxKb: 120 },
    note: 'Prefer under 250 KB for web and 120 KB for mobile.',
  },
  maxOutputDim: 1920,
  allowOptimize: true,
  defaultOptimize: true,
};

export const EDITOR_PRESETS = {
  logo,
  banner,
  background,
  avatar,
  product,
  thumbnail,
  badge,
  certificate,
  generic,
};
