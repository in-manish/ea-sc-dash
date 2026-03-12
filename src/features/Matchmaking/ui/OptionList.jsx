import React from 'react';

const OptionList = ({ options }) => {
    if (!options || options.length === 0) return null;

    return (
        <div className="mt-4">
            <h4 className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
                Options ({options.length})
            </h4>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <span 
                        key={option.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-bg-tertiary text-text-secondary border border-border transition-colors hover:border-border-hover"
                    >
                        {option.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default OptionList;
