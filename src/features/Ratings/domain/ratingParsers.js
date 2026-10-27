import { CATEGORY_OPTIONS } from '../constants';

const categoryLabel = (value) => CATEGORY_OPTIONS.find((c) => c.value === value)?.label || value || '';
const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

export function parseType(raw) {
  return {
    id: raw.id,
    name: raw.name || '',
    description: raw.description || '',
    category: raw.rating_category,
    categoryLabel: categoryLabel(raw.rating_category),
    isActive: raw.is_active !== false,
  };
}

export function parseScale(raw) {
  return {
    id: raw.id,
    value: num(raw.rating_value),
    label: raw.label || '',
    color: raw.color_code || '',
    isActive: raw.is_active !== false,
    order: num(raw.display_order),
  };
}

export function parseOption(raw) {
  return {
    id: raw.id,
    title: raw.title || '',
    description: raw.description || '',
    isActive: raw.is_active !== false,
    order: num(raw.display_order),
  };
}

/** `GET rating/options/?applicable_rating_id=` returns groups by scale value; one scale means one group. */
export function parseOptionGroups(result) {
  const groups = Array.isArray(result?.data) ? result.data : [];
  return groups.flatMap((group) => (group.options || []).map(parseOption));
}

export const sortScales = (scales) => [...scales].sort((a, b) => a.order - b.order || a.value - b.value);
export const sortOptions = (options) => [...options].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
