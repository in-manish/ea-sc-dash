import { otmEventCode } from '../../Matchmaking/domain/otmEventCode';
import { useSurveyFormList } from '../../Matchmaking/ui/SurveyMapping/hooks/useSurveyFormList';
import usePermissionCodes from '../hooks/usePermissionCodes';
import usePersistedState from '../hooks/usePersistedState';
import useOtmServiceData from '../hooks/useOtmServiceData';
import useServiceBackfill from '../hooks/useServiceBackfill';
import useServiceLedger from '../hooks/useServiceLedger';
import useServiceOptions from '../hooks/useServiceOptions';
import PanelMessage from './PanelMessage';
import ServiceBackfillSection from './ServiceBackfillSection';
import ServiceFormPicker from './ServiceFormPicker';
import ServiceLedgerSection from './ServiceLedgerSection';
import ServiceMappingBoard from './ServiceMappingBoard';
import ServiceOptionsImport from './ServiceOptionsImport';

const SECTIONS = [['map', 'Options and mapping'], ['backfill', 'Backfill'], ['ledger', 'Ledger']];

/**
 * Map the SurveyJS options (price codes, dates, times) to permission codes by hand, backfill attendees that
 * bought them, and read the ledger. Organizer only.
 */
export default function ServiceMappingPanel({ eventId, token, onUnauthorized }) {
  // kept in the browser per event, so leaving this screen and coming back finds the same form and section
  const [section, setSection] = usePersistedState(`ea_service_mapping:${eventId}:section`, 'map');
  const [formValue, setFormValue] = usePersistedState(`ea_service_mapping:${eventId}:form`, '');
  const [extraQuery, setExtraQuery] = usePersistedState(`ea_service_mapping:${eventId}:query`, '');
  const eventCode = otmEventCode(eventId);
  const forms = useSurveyFormList(eventCode);
  const codes = usePermissionCodes(eventId, token, onUnauthorized);
  const options = useServiceOptions(eventId, token, onUnauthorized);
  const otm = useOtmServiceData(token, eventCode);
  const backfill = useServiceBackfill(eventId, token, onUnauthorized);
  const ledger = useServiceLedger(eventId, token, onUnauthorized);

  if (options.denied) {
    return (
      <p className="m-0 rounded-2xl border border-dashed border-border py-10 text-center text-sm text-text-secondary">
        Only an organizer can map SurveyJS options.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <ServiceFormPicker forms={forms.forms} loading={forms.loading} error={forms.error} value={formValue}
        onChange={setFormValue} extraQuery={extraQuery} onExtraQueryChange={setExtraQuery} />
      <div className="flex gap-1.5" role="tablist" aria-label="SurveyJS mapping">
        {SECTIONS.map(([id, text]) => (
          <button key={id} type="button" role="tab" aria-selected={section === id} onClick={() => setSection(id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${section === id ? 'bg-text-primary text-bg-primary' : 'bg-bg-secondary text-text-secondary'}`}>
            {text}
          </button>
        ))}
      </div>
      <PanelMessage type="success" text={options.notice} onClear={options.clearNotice} />
      <PanelMessage type="error" text={options.error} onClear={options.clearError} />
      {codes.error ? <PanelMessage type="error" text={codes.error} onClear={codes.clearError} /> : null}

      {section === 'map' ? (
        <>
          <ServiceOptionsImport formValue={formValue} extraQuery={extraQuery} otm={otm} saving={options.saving} onPush={options.push} />
          <ServiceMappingBoard eventId={eventId} options={options.options} codes={codes.codes} codesReady={!codes.loading}
            saving={options.saving} onSave={options.saveMapping} />
        </>
      ) : null}
      {section === 'backfill' ? (
        <ServiceBackfillSection eventId={eventId} codes={codes.codes} formValue={formValue} extraQuery={extraQuery}
          otm={otm} backfill={backfill} />
      ) : null}
      {section === 'ledger' ? <ServiceLedgerSection eventId={eventId} ledger={ledger} /> : null}
    </div>
  );
}
