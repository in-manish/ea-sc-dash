import { MATCHMAKING_PRESET_KEY, QUESTION_OPTIONS_TOKEN } from '../constants';

export function validatePresetForm(form, { isCreate } = {}) {
  const errors = {};
  const key = (form.preset_key || '').trim();
  if (isCreate && !key) errors.preset_key = 'This field is required.';
  if (!(form.name || '').trim()) errors.name = 'This field is required.';
  if (!(form.system_prompt || '').trim()) errors.system_prompt = 'This field is required.';
  if (key === MATCHMAKING_PRESET_KEY && !(form.system_prompt || '').includes(QUESTION_OPTIONS_TOKEN)) {
    errors.system_prompt =
      `This preset must include ${QUESTION_OPTIONS_TOKEN} so the event catalog can be injected.`;
  }
  return errors;
}

export function buildCreatePayload(form) {
  return {
    preset_key: form.preset_key.trim(),
    name: form.name.trim(),
    system_prompt: form.system_prompt,
    is_default: Boolean(form.is_default),
    is_active: Boolean(form.is_active),
  };
}

export function buildPatchPayload(form) {
  return {
    name: form.name.trim(),
    system_prompt: form.system_prompt,
    is_default: Boolean(form.is_default),
    is_active: Boolean(form.is_active),
  };
}
