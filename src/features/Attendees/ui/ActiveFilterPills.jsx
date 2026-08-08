import { X } from 'lucide-react';
import { pillColors } from '../constants';

const ActiveFilterPills = ({ filters, onRemoveFilter }) => {
    if (Object.keys(filters).length === 0) return null;

    return (
        <div className="flex flex-wrap gap-3 mb-6 py-2 animate-fade-in">
            {Object.entries(filters).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;

                const pillClass = pillColors[key] || 'bg-white text-gray-800 border-black/5';

                if (Array.isArray(value)) {
                    return value.map((val) => (
                        <div
                            key={`${key}-${val}`}
                            className={`inline-flex items-center gap-2 py-2 px-3.5 rounded-xl text-[0.8125rem] font-semibold tracking-wide border transition-all duration-200 hover:-translate-y-px hover:shadow-md ${pillClass}`}
                        >
                            <span className="uppercase text-[0.625rem] tracking-wider opacity-60">
                                {key.replace(/_/g, ' ')}:
                            </span>
                            <span>{val}</span>
                            <button
                                className="flex items-center justify-center p-0.5 rounded bg-black/10 border-none transition-colors duration-200 hover:bg-black/20"
                                onClick={() => onRemoveFilter(key, val)}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ));
                }

                return (
                    <div
                        key={key}
                        className={`inline-flex items-center gap-2 py-2 px-3.5 rounded-xl text-[0.8125rem] font-semibold tracking-wide border transition-all duration-200 hover:-translate-y-px hover:shadow-md ${pillClass}`}
                    >
                        <span className="uppercase text-[0.625rem] tracking-wider opacity-60">
                            {key.replace(/_/g, ' ')}:
                        </span>
                        <span>{value === 'true' ? 'Yes' : value}</span>
                        <button
                            className="flex items-center justify-center p-0.5 rounded bg-black/10 border-none transition-colors duration-200 hover:bg-black/20"
                            onClick={() => onRemoveFilter(key)}
                        >
                            <X size={12} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ActiveFilterPills;
