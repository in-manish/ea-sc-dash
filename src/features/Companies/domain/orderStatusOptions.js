/** Additional-requirements order statuses (same values as the Requirement Orders page). */
export const ORDER_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pay_later', label: 'Pay Later' },
  { value: 'pending', label: 'Pending' },
  { value: 'cart', label: 'Cart' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export const DEFAULT_ORDER_STATUSES = ['paid', 'pay_later'];
