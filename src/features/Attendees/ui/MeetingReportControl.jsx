import { FileText } from 'lucide-react';
import useMeetingReport from '../hooks/useMeetingReport';
import MeetingReportModal from './MeetingReportModal';

/** Selection-bar button + modal: download (one attendee) or email (many) the EA meeting report PDF. */
export default function MeetingReportControl({ eventId, token, selection }) {
    const report = useMeetingReport({ eventId, token, selection });
    const { unsupported, count } = report.target;
    const disabled = unsupported || count === 0;

    return (
        <>
            <button
                type="button"
                className="btn btn-secondary gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={report.open}
                disabled={disabled}
                title={
                    unsupported
                        ? 'Meeting reports work on rows selected on this page, or all attendees without a search'
                        : count === 0
                          ? 'Selected attendees have no Reg ID'
                          : 'Download the meeting report PDF'
                }
            >
                <FileText size={16} />
                Meeting report
            </button>
            <MeetingReportModal report={report} />
        </>
    );
}
