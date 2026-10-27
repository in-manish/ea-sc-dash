const TYPE_NAME = /^[A-Za-z_]+$/;
const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function result(fields) {
  return { fields, ok: Object.keys(fields).length === 0 };
}

/** The name is part of the attendee-app URL (`/evc/rating/types/<name>/`), so letters and underscores only. */
export function validateTypeForm({ name, description }) {
  const fields = {};
  const trimmed = name.trim();
  if (!trimmed) fields.name = 'Name is required.';
  else if (!TYPE_NAME.test(trimmed)) fields.name = 'Use letters and underscores only, for example meeting_rating.';
  else if (trimmed.length > 100) fields.name = 'Name cannot exceed 100 characters.';
  if (description.length > 1000) fields.description = 'Description cannot exceed 1000 characters.';
  return result(fields);
}

export function typeBody({ name, description, category, isActive }) {
  return {
    name: name.trim(),
    description: description.trim(),
    rating_category: category,
    is_active: isActive,
  };
}

export function validateScaleForm({ value, label, color, order }) {
  const fields = {};
  const n = Number(value);
  if (value === '' || !Number.isInteger(n) || n < 1 || n > 100) fields.value = 'Enter a whole number from 1 to 100.';
  if (label.length > 100) fields.label = 'Label cannot exceed 100 characters.';
  if (color && !HEX_COLOR.test(color)) fields.color = 'Use a hex colour such as #22c55e.';
  const o = Number(order);
  if (order === '' || !Number.isInteger(o) || o < 0) fields.order = 'Enter 0 or a positive whole number.';
  return result(fields);
}

export function scaleBody({ value, label, color, order, isActive }) {
  return {
    rating_value: Number(value),
    label: label.trim(),
    color_code: color || null,
    display_order: Number(order),
    is_active: isActive,
  };
}

export function validateOptionForm({ title, description }) {
  const fields = {};
  if (!title.trim()) fields.title = 'Title is required.';
  else if (title.trim().length > 255) fields.title = 'Title cannot exceed 255 characters.';
  if (description.length > 1000) fields.description = 'Description cannot exceed 1000 characters.';
  return result(fields);
}

export function optionBody({ title, description, order, isActive }) {
  return {
    title: title.trim(),
    description: description.trim(),
    display_order: Number(order) || 0,
    is_active: isActive,
  };
}
