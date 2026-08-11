import { useState } from 'react';
import { ChevronDown, ClipboardList } from 'lucide-react';
import { companyApi } from '../api/companyApi';
import { sortSetupSteps } from '../domain/setupChecklistHelpers';
import SetupProgressSkeleton from './SetupProgressSkeleton';
import SetupProgressStep from './SetupProgressStep';

/**
 * Compact by default so Company Detail cards stay in view.
 * Expand for full checklist. Overview API only.
 */
export default function SetupProgressSection({
  eventId,
  companyId,
  token,
  overview,
  loading,
  error,
  onReload,
  expanded,
  onExpandedChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [remindingId, setRemindingId] = useState(null);
  const [remindSuccess, setRemindSuccess] = useState('');
  const [remindError, setRemindError] = useState('');

  const isControlled = typeof expanded === 'boolean';
  const open = isControlled ? expanded : internalOpen;
  const setOpen = (next) => {
    if (!isControlled) setInternalOpen(next);
    onExpandedChange?.(next);
  };

  const checklist = overview?.setup_checklist;
  const progress =
    checklist?.overall_progress ?? overview?.event_summary?.setup_progress ?? 0;

  const handleRemind = async (step) => {
    setRemindSuccess('');
    setRemindError('');
    setRemindingId(step.id);
    try {
      await companyApi.sendSetupChecklistReminder(eventId, token, {
        stepId: step.id,
        companyIds: [Number(companyId) || companyId],
      });
      setRemindSuccess('Reminder sent.');
      onReload?.();
    } catch (err) {
      setRemindError(
        err.message || 'Failed to send reminder. Please try again.'
      );
      if (!open) setOpen(true);
    } finally {
      setRemindingId(null);
    }
  };

  if (loading) return <SetupProgressSkeleton />;

  if (error) {
    return (
      <div className="bg-bg-primary border border-border rounded-lg px-4 py-3 shadow-sm text-sm text-text-secondary">
        Couldn&apos;t load exhibitor portal checklist.
      </div>
    );
  }

  if (!checklist || checklist.visible === false) return null;

  const steps = sortSetupSteps(checklist.steps);
  const completed = checklist.completed_count ?? 0;
  const total = checklist.total_count ?? steps.length;
  const recommendedId = checklist.recommended_step_id;
  const nextStep = steps.find((s) => s.id === recommendedId);
  const pct = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <section
      id="company-exhibitor-portal-checklist"
      className="bg-bg-primary border border-border rounded-lg shadow-sm"
    >
      <button
        type="button"
        className="w-full text-left px-4 py-3 flex flex-wrap items-center gap-3 bg-transparent border-none cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <ClipboardList size={18} className="text-text-tertiary shrink-0" />
        <span className="text-sm font-semibold uppercase text-text-tertiary tracking-wide">
          Exhibitor portal checklist
        </span>
        <span className="text-sm text-text-secondary">
          {completed}/{total} complete
        </span>
        <span className="text-sm font-semibold text-text-primary tabular-nums">{pct}%</span>
        {!open && nextStep?.title && (
          <span className="text-xs text-text-tertiary truncate max-w-[220px] sm:max-w-xs">
            Next: {nextStep.title}
          </span>
        )}
        <ChevronDown
          size={18}
          className={`ml-auto text-text-tertiary shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div className="px-4 pb-3">
        <div className="h-1.5 w-full rounded-full bg-bg-tertiary overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          {remindSuccess && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 mb-3 m-0">
              {remindSuccess}
            </p>
          )}
          {remindError && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-3">
              <p className="m-0 font-medium">{remindError}</p>
              {/portal_base_url/i.test(remindError) && (
                <p className="m-0 mt-1 text-xs text-red-600">
                  Set the portal base URL under Companies → Checklist Reminder →
                  Setup reminder, then try again.
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-3">
            {steps.map((step) => (
              <SetupProgressStep
                key={step.id}
                step={step}
                isRecommended={step.id === recommendedId}
                eventId={eventId}
                companyId={companyId}
                onRemind={handleRemind}
                reminding={remindingId === step.id}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
