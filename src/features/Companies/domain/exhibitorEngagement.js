function toCount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function pctOf(count, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((count * 100) / total)));
}

function stepPercentage(raw, count, total) {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.max(0, Math.min(100, Math.round(raw)));
  }
  return pctOf(count, total);
}

/** Each step is % of total exhibitors (open funnel), not a nested subset. */
export function normalizeExhibitorEngagement(payload) {
  const totalExhibitors = toCount(payload?.total_exhibitors);
  const funnel = payload?.activation_funnel || {};
  const rawSteps = Array.isArray(funnel.steps) ? funnel.steps : [];

  const steps = rawSteps
    .map((item, index) => {
      const count = toCount(item?.count);
      return {
        step: Number(item?.step) || index + 1,
        key: item?.key || `step_${index + 1}`,
        label: item?.label || `Step ${index + 1}`,
        count,
        percentage: stepPercentage(item?.percentage, count, totalExhibitors),
      };
    })
    .sort((a, b) => a.step - b.step);

  return {
    title: payload?.title || 'Exhibitor Engagement',
    totalExhibitors,
    generatedAt: payload?.generated_at || '',
    fromCache: Boolean(payload?.from_cache),
    funnelTitle: funnel.title || 'Activation Funnel',
    steps,
  };
}

function messageFromBody(result) {
  if (!result || typeof result !== 'object') return '';
  if (typeof result.detail === 'string') return result.detail;
  return result.message || result.msg || result.error || '';
}

function messageForStatus(result, status) {
  if (status === 401) return 'Authentication required. Please sign in again.';
  if (status === 403) return 'You do not have permission to view exhibitor engagement.';
  if (status === 404) return messageFromBody(result) || 'Event not found.';
  return messageFromBody(result) || `Failed to load exhibitor engagement (${status})`;
}

export function parseExhibitorEngagementError(result, status) {
  const error = new Error(messageForStatus(result, status));
  error.status = status;
  error.data = result;
  return error;
}

export function formatCount(value) {
  return toCount(value).toLocaleString();
}

export function formatExhibitorCount(value) {
  const n = toCount(value);
  return `${n.toLocaleString()} ${n === 1 ? 'exhibitor' : 'exhibitors'}`;
}

export function isWeakestStep(step, steps) {
  if (!step || !Array.isArray(steps) || steps.length < 2) return false;
  const min = Math.min(...steps.map((s) => s.percentage));
  if (steps.every((s) => s.percentage === min)) return false;
  return step.percentage === min;
}

export function barFillWidth(percentage) {
  const fill = Math.max(0, Math.min(100, Number(percentage) || 0));
  return {
    width: `${fill}%`,
    minWidth: fill > 0 ? '6px' : '0px',
  };
}
