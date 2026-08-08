export const EMPTY_SESSION = {
  title: '',
  location: '',
  description: '',
  information: '',
  date: '',
  start: '',
  end: '',
  track_title: '',
  enrollable: false,
  admin: false,
  force_attendance: false,
  speaker_default_alpha_sort: true,
};

export const EMPTY_SPEAKER = () => ({
  speaker_name: '',
  speaker_company: '',
  speaker_designation: '',
  speaker_email: '',
  speaker_image: '',
  speaker_profile: '',
  speaker_sort_order: 0,
});

export const EMPTY_MODERATOR = () => ({
  moderator_uuid: '',
  moderator_name: '',
  moderator_company: '',
  moderator_designation: '',
  moderator_image: '',
  moderator_profile: '',
});
