import { formatReportNumber } from '../domain/reportChart';
import AttendeesReportBarChart from './AttendeesReportBarChart';
import AttendeesReportPieChart from './AttendeesReportPieChart';

const AttendeesReportCharts = ({ report }) => {
    const types = report?.attendee_types || [];

    if (types.length === 0) {
        return (
            <p className="text-sm text-text-tertiary m-0 py-3">
                No attendee type breakdown returned.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <p className="text-sm font-medium text-text-primary m-0">Event total</p>
                    <p className="text-xs text-text-tertiary m-0 mt-0.5">Matching registered badges</p>
                </div>
                <span className="text-sm font-bold text-text-primary tabular-nums shrink-0">
                    {formatReportNumber(report?.total)}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider m-0 mb-1">
                        By type
                    </p>
                    <AttendeesReportBarChart report={report} />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider m-0 mb-1">
                        Share
                    </p>
                    <AttendeesReportPieChart report={report} />
                </div>
            </div>
        </div>
    );
};

export default AttendeesReportCharts;
