import { Play } from 'lucide-react';
import CompanyReportBadges from './CompanyReportBadges';
import CompanyReportSampleTable from './CompanyReportSampleTable';

function Fact({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">{label}</span>
      <span className="text-sm text-text-primary">{children}</span>
    </div>
  );
}

const RUN_LABEL = { company_metrics: 'Open report' };

/** Right column of the Reports tab: what the report is, when to use it, sample rows, run button. */
export default function CompanyReportDetail({ report, onRun, canRun }) {
  return (
    <section className="bg-bg-primary border border-border rounded-xl shadow-sm p-6 flex flex-col gap-5 min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h2 className="text-lg font-bold text-text-primary m-0">{report.title}</h2>
          <p className="text-sm text-text-secondary m-0 max-w-2xl">{report.summary}</p>
        </div>
        <button
          type="button"
          className="btn btn-primary inline-flex items-center gap-1.5 shrink-0"
          onClick={onRun}
          disabled={!canRun}
        >
          <Play size={14} />
          {RUN_LABEL[report.id] || 'Run report'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-bg-secondary/60 border border-border">
        <Fact label="Use it when">{report.useWhen}</Fact>
        <Fact label="Each row">{report.rowUnit}</Fact>
        <Fact label="Covers">{report.scope}</Fact>
        <Fact label="Delivery"><CompanyReportBadges delivery={report.delivery} /></Fact>
        {report.options?.length > 0 && <Fact label="Options">{report.options.join(' · ')}</Fact>}
        {report.note && <Fact label="Good to know">{report.note}</Fact>}
      </div>

      <CompanyReportSampleTable sample={report.sample} />

      <span className="text-[11px] font-mono text-text-tertiary">{report.endpoint}</span>
    </section>
  );
}
