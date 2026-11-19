import { useSearchParams } from 'react-router-dom';
import { FileBarChart } from 'lucide-react';
import { companyReportCounts, findCompanyReport } from '../domain/companyReportCatalog';
import CompanyReportList from './CompanyReportList';
import CompanyReportDetail from './CompanyReportDetail';
import CompanyReportRunner from './CompanyReportRunner';

const REPORT_ID_PARAM = 'report_id';
const RUN_PARAM = 'run';

function SummaryStrip() {
  const counts = companyReportCounts();
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 p-4 rounded-xl border border-border bg-bg-primary shadow-sm">
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-lg bg-bg-secondary text-accent"><FileBarChart size={18} /></span>
        <div>
          <p className="text-sm font-semibold text-text-primary m-0">{counts.total} company reports</p>
          <p className="text-xs text-text-tertiary m-0">
            {counts.download} downloadable · {counts.email} by email · {counts.screen} on screen
          </p>
        </div>
      </div>
      <p className="text-xs text-text-secondary m-0 flex-1 min-w-[16rem]">
        Pick a report, check the sample to see what each row contains, then run it.
        Emailed reports are built in the background and arrive as a CSV attachment.
      </p>
    </div>
  );
}

/**
 * Companies → Reports: every company report in one place, with a summary and sample rows.
 * URL: ?tab=reports&report_id=<id>[&run=1] so the selection and the open dialog survive refresh.
 */
export default function CompanyReportsTab({ eventId, token }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const report = findCompanyReport(searchParams.get(REPORT_ID_PARAM));
  const running = searchParams.get(RUN_PARAM) === '1';

  const update = (mutate, options) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next, options);
  };
  const select = (id) => update((p) => { p.set(REPORT_ID_PARAM, id); p.delete(RUN_PARAM); }, { replace: true });
  const openRun = () => update((p) => { p.set(REPORT_ID_PARAM, report.id); p.set(RUN_PARAM, '1'); });
  const closeRun = () => update((p) => p.delete(RUN_PARAM));

  return (
    <div className="animate-fade-in">
      <SummaryStrip />
      <div className="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] gap-6 items-start">
        <CompanyReportList selectedId={report.id} onSelect={select} />
        <CompanyReportDetail report={report} onRun={openRun} canRun={Boolean(eventId && token)} />
      </div>
      {running && eventId && token && (
        <CompanyReportRunner key={report.id} report={report} eventId={eventId} token={token} onClose={closeRun} />
      )}
    </div>
  );
}
