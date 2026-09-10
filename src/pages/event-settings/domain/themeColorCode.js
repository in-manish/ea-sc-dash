const HEX3 = /^#?([0-9a-fA-F]{3})$/;
const HEX6 = /^#?([0-9a-fA-F]{6})$/;

/** Normalize `#RGB` / `#RRGGBB` (with or without #) to `#RRGGBB`. */
export function parseThemeHex(value) {
    if (value == null || typeof value !== 'string') return null;
    const trimmed = value.trim();
    const six = trimmed.match(HEX6);
    if (six) return `#${six[1].toUpperCase()}`;
    const three = trimmed.match(HEX3);
    if (!three) return null;
    const [r, g, b] = three[1];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
}

export function toColorPickerValue(value) {
    return parseThemeHex(value) || '#000000';
}

export function contrastTextOn(hex) {
    const parsed = parseThemeHex(hex);
    if (!parsed) return '#ffffff';
    const r = parseInt(parsed.slice(1, 3), 16);
    const g = parseInt(parsed.slice(3, 5), 16);
    const b = parseInt(parsed.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 >= 160 ? '#111827' : '#ffffff';
}
