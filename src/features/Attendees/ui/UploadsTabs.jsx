const tabClass = (active) =>
    `py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${
        active
            ? 'border-accent text-accent'
            : 'border-transparent text-text-secondary hover:text-text-primary'
    }`;

/** Attendees / Companies tabs on the event Uploads page. */
export default function UploadsTabs({ activeTab, onTabChange }) {
    return (
        <div className="flex border-b border-border mb-4">
            <button
                type="button"
                className={tabClass(activeTab === 'attendees')}
                onClick={() => onTabChange('attendees')}
            >
                Attendee Uploads
            </button>
            <button
                type="button"
                className={tabClass(activeTab === 'companies')}
                onClick={() => onTabChange('companies')}
            >
                Company Uploads
            </button>
        </div>
    );
}
