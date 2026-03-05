import React, { useState, useEffect } from 'react';
import { Search, History } from 'lucide-react';

const EventSelector = ({ currentEventId, onSelect, loading }) => {
    const [id, setId] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Suggest previous event IDs
        const cur = parseInt(currentEventId);
        if (!isNaN(cur) && cur > 1) {
            const sugs = [];
            for (let i = cur - 1; i >= Math.max(1, cur - 3); i--) {
                sugs.push(i);
            }
            setSuggestions(sugs);
        }
    }, [currentEventId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) onSelect(id);
    };

    return (
        <div className="p-6 animate-fade-in">
            <h3 className="text-lg font-bold mb-4">Select Source Event</h3>
            <p className="text-sm text-text-secondary mb-6">
                Enter the ID of the event from which you want to sync groups and products.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="number"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Event ID (e.g. 12)"
                    className="flex-1 p-2.5 border border-border rounded-lg outline-none focus:border-accent"
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={!id || loading}
                    className="btn btn-primary px-6 flex items-center gap-2"
                >
                    {loading ? 'Fetching...' : <><Search size={18} /> Load Data</>}
                </button>
            </form>

            {suggestions.length > 0 && (
                <div className="mt-8">
                    <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3 flex items-center gap-2">
                        <History size={14} /> Suggestions
                    </h4>
                    <div className="flex gap-2">
                        {suggestions.map((sug) => (
                            <button
                                key={sug}
                                onClick={() => { setId(sug.toString()); onSelect(sug.toString()); }}
                                className="px-4 py-2 bg-bg-secondary border border-border rounded-lg hover:border-accent hover:text-accent transition-colors text-sm font-medium"
                            >
                                Event #{sug}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventSelector;
