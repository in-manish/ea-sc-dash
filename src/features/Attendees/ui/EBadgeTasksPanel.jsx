import { Loader2 } from 'lucide-react';
import { getJobStatusColor } from '../domain/jobTiming';
import ListPagination from './ListPagination';

const EBadgeTasksPanel = ({
    jobs,
    jobsLoading,
    jobsError,
    jobsTotal,
    jobsPage,
    onPrevPage,
    onNextPage,
}) => (
    <>
        <div className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                            Progress UUID
                        </th>
                        <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                            Progress
                        </th>
                        <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                            Status
                        </th>
                        <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                            Created At
                        </th>
                        <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                            Finished At
                        </th>
                        <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border text-right">
                            Duration
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {jobsLoading && jobs.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center p-12 text-text-secondary">
                                <Loader2 className="animate-spin text-accent mx-auto" size={24} />
                            </td>
                        </tr>
                    ) : jobsError ? (
                        <tr>
                            <td colSpan="6" className="text-center p-12 text-red-500 font-medium">
                                {jobsError}
                            </td>
                        </tr>
                    ) : jobs.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center p-12 text-text-secondary">
                                No e-badge tasks found.
                            </td>
                        </tr>
                    ) : (
                        jobs.map((job) => {
                            const statusColor = getJobStatusColor(job.status);
                            return (
                                <tr
                                    key={job.progress_uuid}
                                    className="hover:bg-bg-secondary [&>td]:border-b [&>td]:border-border group"
                                >
                                    <td className="py-4 px-6 font-mono text-xs text-text-primary select-all">
                                        {job.progress_uuid}
                                    </td>
                                    <td className="py-4 px-6 min-w-[200px]">
                                        <div className="flex flex-col gap-1.5 w-full">
                                            <div className="flex justify-between text-xs font-medium text-text-secondary">
                                                <span>
                                                    {job.processed} / {job.total} processed
                                                </span>
                                                <span>{job.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${job.status === 'failed' ? 'bg-red-500' : 'bg-accent'}`}
                                                    style={{ width: `${job.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-flex py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}
                                        >
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-text-secondary">
                                        {job.created_at
                                            ? new Date(job.created_at).toLocaleString()
                                            : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-text-secondary">
                                        {job.finished_at
                                            ? new Date(job.finished_at).toLocaleString()
                                            : '-'}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-text-primary font-medium text-right">
                                        {job.time_taken_display || '-'}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>

        {jobsTotal > 20 && (
            <ListPagination
                page={jobsPage}
                loading={jobsLoading}
                hasNext={jobs.length >= 20}
                onPrev={onPrevPage}
                onNext={onNextPage}
            />
        )}
    </>
);

export default EBadgeTasksPanel;
