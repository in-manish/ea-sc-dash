export const SCAN_LOCATION_PANELS = [
  {
    id: 'locations',
    label: 'Scan locations',
    summary: 'A place where staff scan badges, such as the entrance or a lunch counter.',
    shows: 'Each location, the permissions it requires, and whether it is a special gate.',
    actions: 'Add a location, edit its name and required permissions, or delete it. No permissions means any badge can enter.',
  },
  {
    id: 'codes',
    label: 'Permission codes',
    summary: 'A right you put on a badge, then require at a scan location. Example: Lunch.',
    shows: 'Code, name, valid dates, time window, and whether it is active.',
    actions: 'Add a code, or edit its name and when it is valid. The letter or digit cannot change. Delete is blocked while a location or badge still uses it.',
  },
  {
    id: 'service',
    label: 'SurveyJS mapping',
    summary: 'Link what attendees buy on SurveyJS to permission codes.',
    shows: 'The SurveyJS options on one side and the event permissions on the other, with what each option grants.',
    actions: 'Fetch the options, tick the permissions each one grants (nothing is mapped automatically), backfill attendees, and read the ledger of every sync.',
  },
  {
    id: 'metrics',
    label: 'Metrics',
    summary: 'How many badges hold each permission, and how scans are spread across locations.',
    shows: 'Badges per permission, where each is required, scans and unique badges per location.',
    actions: 'Filter scans by date and direction, and refresh the numbers. Results are cached for 10 minutes.',
  },
];

export function activeScanPanel(raw) {
  return SCAN_LOCATION_PANELS.some((panel) => panel.id === raw) ? raw : 'locations';
}
