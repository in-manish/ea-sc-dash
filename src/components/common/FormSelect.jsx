import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const defaultMatch = (value, optionValue) => value === optionValue;

const FormSelect = ({ value, onChange, options, placeholder = 'Select...', className = '', matchOption = defaultMatch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selected = options.find(opt => matchOption(value, opt.value));
    const displayLabel = selected?.label ?? placeholder;

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`input-field py-2.5 px-5 text-sm font-semibold w-full flex items-center justify-between gap-3 bg-white border border-border/60 rounded-xl shadow-sm transition-all text-left
                    ${isOpen ? 'ring-4 ring-accent/5 border-accent/40' : 'hover:border-accent/30'}`}
            >
                <span className={`truncate ${selected ? 'text-text-primary' : 'text-text-tertiary'}`}>{displayLabel}</span>
                <ChevronDown size={16} className={`text-text-tertiary transition-transform shrink-0 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-border/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-xl overflow-hidden z-50 py-1 max-h-60 overflow-y-auto custom-scrollbar animate-slide-up">
                    {options.map((opt, idx) => {
                        const isSelected = matchOption(value, opt.value);
                        return (
                            <React.Fragment key={opt.value === '' ? '__empty__' : opt.value}>
                                {opt.dividerBefore && (
                                    <div className="my-1.5 mx-4 border-t border-border/60" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-5 py-2.5 text-left text-sm font-semibold flex items-center justify-between gap-3 transition-colors
                                        ${isSelected ? 'bg-accent/10 text-accent' : 'text-text-primary hover:bg-accent/5 hover:text-accent'}`}
                                >
                                    <span>{opt.label}</span>
                                    {isSelected && <Check size={14} className="text-accent shrink-0" />}
                                </button>
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FormSelect;
