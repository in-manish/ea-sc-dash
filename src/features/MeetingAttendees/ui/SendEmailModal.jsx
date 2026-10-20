import { useMemo, useState } from 'react';
import { Loader2, Mail, X } from 'lucide-react';
import { DEFAULT_MAX_COMPANIES } from '../constants';
import { defaultTemplateChoices, templatesByAttendeeType } from '../domain/meetingTemplates';
import { missingTemplateTypeIds } from '../domain/sendPayload';
import SendEmailPickStep from './SendEmailPickStep';
import SendEmailReviewStep from './SendEmailReviewStep';

/** Step 1: choose templates. Step 2: review how the email will be sent, then confirm. */
export default function SendEmailModal({ types, templateState, recipientCount, selectAll, sending, error, onSend, onClose, onCreateTemplate }) {
  const [step, setStep] = useState('pick');
  const [picked, setPicked] = useState({});
  const [modeChoice, setModeChoice] = useState(null);
  const [commonId, setCommonId] = useState('');
  const [maxCompanies, setMaxCompanies] = useState(DEFAULT_MAX_COMPANIES);
  const defaults = useMemo(() => defaultTemplateChoices(types, templateState.templates), [types, templateState.templates]);
  // Until the admin chooses, start with one shared template when some type has none of its own.
  const ownTemplates = useMemo(() => templatesByAttendeeType(types, templateState.templates), [types, templateState.templates]);
  const someTypeHasNone = types.some((type) => !ownTemplates[type.id]);
  const mode = types.length < 2 ? 'perType' : modeChoice || (someTypeHasNone ? 'common' : 'perType');
  const templateByType = mode === 'common'
    ? (commonId ? Object.fromEntries(types.map((type) => [type.id, commonId])) : {})
    : { ...defaults, ...picked };
  const missing = missingTemplateTypeIds(types.map((type) => type.id), templateByType);

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50" onClick={sending ? undefined : onClose} role="presentation">
      <div role="dialog" aria-modal="true" className="bg-bg-primary border border-border rounded-lg shadow-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-base font-semibold text-text-primary m-0">
            {step === 'pick' ? 'Send email: choose templates' : 'Send email: review'}
          </h3>
          <button type="button" onClick={onClose} disabled={sending} className="bg-transparent border-none cursor-pointer p-1 text-text-tertiary" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-4">
          {step === 'pick' ? (
            <SendEmailPickStep
              types={types}
              templates={templateState.templates}
              loading={templateState.loading}
              loadError={templateState.error}
              choices={templateByType}
              onPickTemplate={(typeId, id) => setPicked((prev) => ({ ...prev, [typeId]: id }))}
              mode={mode}
              onMode={setModeChoice}
              onPickCommon={setCommonId}
              onCreateTemplate={onCreateTemplate}
              maxCompanies={maxCompanies}
              onMaxCompanies={setMaxCompanies}
            />
          ) : (
            <SendEmailReviewStep types={types} templates={templateState.templates} templateByType={templateByType} recipientCount={recipientCount} selectAll={selectAll} maxCompanies={maxCompanies} />
          )}
          {error && <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2 m-0 whitespace-pre-line" role="alert">{error}</p>}
          <div className="flex justify-end gap-2">
            {step === 'review' && <button type="button" className="btn btn-secondary" disabled={sending} onClick={() => setStep('pick')}>Back</button>}
            {step === 'pick' ? (
              <button type="button" className="btn btn-primary" disabled={missing.length > 0 || templateState.loading} onClick={() => setStep('review')}>
                Review
              </button>
            ) : (
              <button type="button" className="btn btn-primary inline-flex items-center gap-1.5" disabled={sending} onClick={() => onSend({ templateByType, maxCompanies })}>
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                {sending ? 'Sending…' : 'Confirm and send'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
