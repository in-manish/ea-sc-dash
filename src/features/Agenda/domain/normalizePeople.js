import { EMPTY_MODERATOR, EMPTY_SPEAKER } from '../constants';

export function normalizeSpeakers(list = []) {
  return (Array.isArray(list) ? list : [list].filter(Boolean)).map((s, i) => ({
    ...EMPTY_SPEAKER(),
    ...s,
    speaker_profile: s.speaker_profile || s.speaker_bio || '',
    speaker_sort_order: Number.isFinite(Number(s.speaker_sort_order))
      ? Number(s.speaker_sort_order)
      : i + 1,
  }));
}

export function normalizeModerators(list = []) {
  return (Array.isArray(list) ? list : [list].filter(Boolean)).map((m) => ({
    ...EMPTY_MODERATOR(),
    ...m,
  }));
}

export function speakersForPayload(speakers, alphaSort) {
  return speakers
    .filter((s) => (s.speaker_name || '').trim())
    .map((s, i) => {
      const { speaker_image_preview, speaker_bio, ...rest } = s;
      return {
        ...rest,
        speaker_image: rest.speaker_image || '',
        speaker_profile: rest.speaker_profile || '',
        speaker_sort_order: alphaSort ? i + 1 : Number(rest.speaker_sort_order) || i + 1,
      };
    });
}

export function moderatorsForPayload(moderators) {
  return moderators
    .filter((m) => (m.moderator_name || '').trim())
    .map((m) => {
      const { moderator_image_preview, ...rest } = m;
      return {
        ...rest,
        moderator_image: rest.moderator_image || '',
        moderator_profile: rest.moderator_profile || '',
      };
    });
}
