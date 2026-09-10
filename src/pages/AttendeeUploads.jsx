import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AttendeeUploadHistoryPanel from '../features/Attendees/ui/AttendeeUploadHistoryPanel';
import CompanyUploadHistoryPanel from '../features/Companies/ui/CompanyUploadHistoryPanel';
import UploadsTabs from '../features/Attendees/ui/UploadsTabs';

const COMPANIES_TAB = 'companies';

/** Standalone page: CSV upload history for attendees and companies. */
const AttendeeUploads = () => {
    const { selectedEvent, token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') === COMPANIES_TAB ? COMPANIES_TAB : 'attendees';
    const isCompanies = tab === COMPANIES_TAB;

    const setTab = (next) => {
        const params = new URLSearchParams(searchParams);
        if (next === 'attendees') params.delete('tab');
        else params.set('tab', next);
        setSearchParams(params);
    };

    return (
        <div className="w-full animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary mb-1">Uploads</h1>
                <p className="text-sm text-text-secondary">
                    {isCompanies
                        ? 'History of company CSV uploads for this event.'
                        : 'History of attendee CSV uploads for this event.'}
                </p>
            </div>

            <UploadsTabs activeTab={tab} onTabChange={setTab} />

            {selectedEvent && !isCompanies && (
                <AttendeeUploadHistoryPanel eventId={selectedEvent.id} token={token} />
            )}
            {selectedEvent && isCompanies && (
                <CompanyUploadHistoryPanel eventId={selectedEvent.id} token={token} />
            )}
        </div>
    );
};

export default AttendeeUploads;
