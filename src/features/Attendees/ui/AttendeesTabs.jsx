const AttendeesTabs = ({ activeTab, onTabChange }) => (
    <div className="flex border-b border-border mb-4">
        <button
            className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${activeTab === 'list' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
            onClick={() => onTabChange('list')}
        >
            Attendee List
        </button>
        <button
            className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${activeTab === 'tasks' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
            onClick={() => onTabChange('tasks')}
        >
            E-badge Tasks
        </button>
    </div>
);

export default AttendeesTabs;
