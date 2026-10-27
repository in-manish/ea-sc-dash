export const CATEGORY_OPTIONS = [
  { value: 'interaction_based', label: 'Interaction', hint: 'Rates a specific thing, such as a meeting.' },
  { value: 'profile_based', label: 'Profile', hint: 'A general impression of a person.' },
];

export const DEFAULT_SCALE_COLORS = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#84cc16',
  5: '#22c55e',
};

// One click creates these for an empty rating type.
export const STARTER_SCALE = [
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Average' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Excellent' },
];
