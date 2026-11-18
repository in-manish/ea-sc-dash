const TABS = [
    { value: 'list', label: 'Attendee List' },
    { value: 'tasks', label: 'E-badge Tasks' },
    { value: 'card-emails', label: 'Email log' },
];

/** Tab values that may come from `?tab=` (anything else falls back to the list). */
export const ATTENDEE_TABS = TABS.map((tab) => tab.value);

const AttendeesTabs = ({ activeTab, onTabChange }) => (
    <div className="flex border-b border-border mb-4">
        {TABS.map((tab) => (
            <button
                key={tab.value}
                className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${activeTab === tab.value ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                onClick={() => onTabChange(tab.value)}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

export default AttendeesTabs;
