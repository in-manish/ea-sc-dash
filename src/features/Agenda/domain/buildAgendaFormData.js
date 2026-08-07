import { moderatorsForPayload, speakersForPayload } from './normalizePeople';

export function buildAgendaFormData({
  formData,
  speakers,
  moderators,
  imageBlobs,
}) {
  const data = new FormData();
  const alphaSort = Boolean(formData.speaker_default_alpha_sort);

  Object.entries(formData).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      data.append(key, value ? 'true' : 'false');
    } else {
      data.append(key, value ?? '');
    }
  });

  const keptSpeakerIndexes = [];
  speakers.forEach((s, i) => {
    if ((s.speaker_name || '').trim()) keptSpeakerIndexes.push(i);
  });
  const keptModeratorIndexes = [];
  moderators.forEach((m, i) => {
    if ((m.moderator_name || '').trim()) keptModeratorIndexes.push(i);
  });

  data.append('speaker', JSON.stringify(speakersForPayload(speakers, alphaSort)));
  data.append('moderator', JSON.stringify(moderatorsForPayload(moderators)));

  keptSpeakerIndexes.forEach((oldIndex, newIndex) => {
    const blob = imageBlobs.get(`speaker_image_${oldIndex}`);
    if (blob) data.append(`speaker_image_${newIndex}`, blob.blob, blob.filename);
  });
  keptModeratorIndexes.forEach((oldIndex, newIndex) => {
    const blob = imageBlobs.get(`moderator_image_${oldIndex}`);
    if (blob) data.append(`moderator_image_${newIndex}`, blob.blob, blob.filename);
  });

  return data;
}
