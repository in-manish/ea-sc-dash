import { UserPlus } from 'lucide-react';
import { ACTION_BTN_STYLE } from '../constants';

const AttendeesPageHeader = ({ total, activeTab, onCreateClick }) => (
    <div className="flex justify-between items-end mb-6">
        <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Attendees</h1>
            <p className="text-sm text-text-secondary">Total: {total} registered</p>
        </div>

        {activeTab === 'list' && (
            <button
                type="button"
                data-testid="create-attendee-btn"
                style={ACTION_BTN_STYLE}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all border border-transparent bg-accent text-accent-text hover:bg-accent-hover"
                onClick={onCreateClick}
            >
                <UserPlus size={16} style={{ marginRight: '0.5rem' }} />
                Create Attendee
            </button>
        )}
    </div>
);

export default AttendeesPageHeader;
