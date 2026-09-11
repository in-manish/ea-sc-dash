import { EDITOR_PRESETS } from '../../../components/imageEditor';

export const EVENT_IMAGE_FIELDS = [
  {
    name: 'meta_logo',
    label: 'Meta Logo',
    description: 'Logo used in meta tags and social previews (Open Graph).',
    editorConfig: EDITOR_PRESETS.logo,
  },
  {
    name: 'logo',
    label: 'Logo',
    description: 'Primary event logo.',
    editorConfig: EDITOR_PRESETS.logo,
  },
  {
    name: 'logo2',
    label: 'Logo (Secondary)',
    description: 'Secondary/alternate logo, used where the primary logo does not fit.',
    editorConfig: EDITOR_PRESETS.logo,
  },
  {
    name: 'event_background_image',
    label: 'Event Background Image',
    description: 'Background image used across event pages.',
    editorConfig: EDITOR_PRESETS.background,
  },
  {
    name: 'event_banner_logo',
    label: 'Event Banner Logo',
    description: 'Logo shown on the event banner.',
    editorConfig: EDITOR_PRESETS.banner,
  },
  {
    name: 'meetingdiary_portal_bg_image',
    label: 'Meeting Diary Portal Background',
    description: 'Background image for the meeting diary portal.',
    editorConfig: EDITOR_PRESETS.background,
  },
];

export const EVENT_VIDEO_POSTER_EDITOR = EDITOR_PRESETS.banner;

export const EVENT_VIDEO_FIELD_NAMES = [
  'event_banner_video',
  'event_banner_video_poster',
];

export const EVENT_MEDIA_FIELD_NAMES = [
  ...EVENT_IMAGE_FIELDS.map((field) => field.name),
  ...EVENT_VIDEO_FIELD_NAMES,
];
