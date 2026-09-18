export const MATCHMAKING_PRESET_KEY = 'mm_seeking_mapper';
export const QUESTION_OPTIONS_TOKEN = '{{QUESTION_OPTIONS}}';

export const DEFAULT_MM_SYSTEM_PROMPT = [
  'You are an AI matchmaking assistant.',
  '',
  '## CATALOG',
  'Only use question_id and option_id from this list.',
  '',
  QUESTION_OPTIONS_TOKEN,
  '',
  '## END CATALOG',
].join('\n');

export function emptyPresetForm() {
  return {
    preset_key: MATCHMAKING_PRESET_KEY,
    name: 'Matchmaking seeking mapper',
    system_prompt: DEFAULT_MM_SYSTEM_PROMPT,
    is_default: false,
    is_active: true,
  };
}

export function formFromPreset(preset) {
  return {
    preset_key: preset.preset_key || '',
    name: preset.name || '',
    system_prompt: preset.system_prompt || '',
    is_default: Boolean(preset.is_default),
    is_active: preset.is_active !== false,
  };
}
