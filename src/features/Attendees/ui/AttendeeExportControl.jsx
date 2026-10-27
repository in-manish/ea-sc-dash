import { Download } from 'lucide-react';
import useAttendeeExport from '../hooks/useAttendeeExport';
import AttendeeExportModal from './AttendeeExportModal';

/** Header button + modal: export the ticked rows, or everything matching the current search and filters. */
export default function AttendeeExportControl({ eventId, token, selection, disabled }) {
    const exporter = useAttendeeExport({ eventId, token, selection });

    return (
        <>
            <button
                type="button"
                data-testid="export-attendees-btn"
                className="btn btn-secondary gap-2 disabled:opacity-50"
                onClick={exporter.open}
                disabled={disabled}
                title="Download attendees as CSV, Excel or PDF"
            >
                <Download size={16} />
                Export
            </button>
            <AttendeeExportModal exporter={exporter} />
        </>
    );
}
