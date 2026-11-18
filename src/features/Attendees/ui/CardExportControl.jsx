import { Contact } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import useCardExport from '../hooks/useCardExport';
import CardExportModal from './CardExportModal';

/** Selection-bar button + modal: download or email the business cards the attendees exchanged on SnapCard. */
export default function CardExportControl({ eventId, token, selection }) {
    const { selectedEvent } = useAuth();
    const report = useCardExport({ eventId, token, selection, event: selectedEvent });
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
                        ? 'Business cards work on rows selected on this page, or all attendees without a search'
                        : count === 0
                          ? 'Selected attendees have no Reg ID'
                          : 'Download or email the business cards these attendees exchanged'
                }
            >
                <Contact size={16} />
                Business cards
            </button>
            <CardExportModal report={report} />
        </>
    );
}
