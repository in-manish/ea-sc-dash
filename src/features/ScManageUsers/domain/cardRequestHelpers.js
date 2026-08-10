/** Activity filter chips for admin card_requests status query. */
export const ACTIVITY_FILTERS = [
  { value: '', label: 'All' },
  { value: 'SENT', label: 'Sent' },
  { value: 'REQD', label: 'Received' },
  { value: 'EXCH', label: 'Exchanged' },
];

const ACTIVITY_META = {
  SENT: { label: 'Sent', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  REQD: { label: 'Received', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  EXCH: { label: 'Exchanged', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  APRV: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  SAVD: { label: 'Saved', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  RECV: { label: 'Received', className: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const CARD_STATUS_META = {
  PENDING_OUT_REQUEST: { label: 'Pending out', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  PENDING_IN_REQUEST: { label: 'Pending in', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONTACT_SAVED: { label: 'Saved', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CONTACT_NOT_SAVED: { label: 'Not saved', className: 'bg-bg-secondary text-text-secondary border-border' },
};

export const activityMeta = (activity) =>
  ACTIVITY_META[activity] || {
    label: activity || 'Activity',
    className: 'bg-bg-secondary text-text-secondary border-border',
  };

export const cardStatusMeta = (status) =>
  CARD_STATUS_META[status] || {
    label: status || 'Unknown',
    className: 'bg-bg-secondary text-text-secondary border-border',
  };

export const activityItemKey = (item, index) => {
  const card = item?.card;
  return `${item?.activity || 'x'}-${card?.card_id ?? card?.id ?? index}-${index}`;
};
