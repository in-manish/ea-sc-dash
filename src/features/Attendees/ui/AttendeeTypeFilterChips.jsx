const AttendeeTypeFilterChips = ({
    attendeeTypes = [],
    loading = false,
    selected = [],
    onToggle,
}) => (
    <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
            Attendee Type
        </h4>
        <div className="flex flex-wrap gap-2 mt-1">
            {loading && <p className="text-xs text-text-tertiary m-0">Loading types…</p>}
            {!loading && attendeeTypes.length === 0 && (
                <p className="text-xs text-text-tertiary m-0">No attendee types available</p>
            )}
            {!loading &&
                attendeeTypes.map((type) => {
                    const name = type.name;
                    const isActive = selected.includes(name);
                    return (
                        <button
                            key={type.id ?? name}
                            type="button"
                            className={`py-2 px-3.5 border rounded-full text-xs font-medium transition-all duration-200 ${isActive ? 'bg-accent text-white border-accent' : 'bg-bg-primary border-border text-text-secondary hover:border-accent hover:text-text-primary hover:bg-bg-secondary'}`}
                            onClick={() => onToggle(name)}
                        >
                            {name}
                        </button>
                    );
                })}
        </div>
    </div>
);

export default AttendeeTypeFilterChips;
