import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

const Dropdown = ({ options, value, onChange, placeholder, title, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.id === value || opt.id?.toString() === value?.toString());

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white border-2 rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all duration-300 shadow-sm
                    ${isOpen ? 'border-accent ring-4 ring-accent/5' : 'border-border/60 hover:border-accent/40'}
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden text-left">
                    {Icon && <Icon size={16} className={selectedOption ? 'text-accent' : 'text-text-tertiary'} />}
                    <div className="flex flex-col min-w-0">
                        {title && <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest leading-none mb-1">{title}</span>}
                        <span className={`text-[13px] font-bold leading-snug break-words whitespace-normal ${selectedOption ? 'text-text-primary' : 'text-text-tertiary opacity-60 italic'}`}>
                            {selectedOption ? selectedOption.name : placeholder}
                        </span>
                    </div>
                </div>
                <ChevronRight size={18} className={`text-text-tertiary transition-transform duration-300 ${isOpen ? 'rotate-90 text-accent' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden z-[100] animate-slide-up py-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {options.length === 0 ? (
                        <div className="px-5 py-4 text-center text-xs text-text-tertiary italic">No options available</div>
                    ) : (
                        <div className="flex flex-col">
                            {options.map((option, idx) => {
                                const isFirstInGroup = idx === 0 || options[idx - 1].group !== option.group;
                                return (
                                    <React.Fragment key={option.id}>
                                        {option.group && isFirstInGroup && (
                                            <div className="px-5 py-2 mt-2 bg-bg-secondary/50 text-[9px] font-black text-accent/60 uppercase tracking-widest border-y border-border/40">
                                                {option.group}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(option.id);
                                                setIsOpen(false);
                                            }}
                                            className={`px-5 py-3.5 text-left text-[13px] font-bold transition-all flex items-center justify-between hover:bg-accent/5 group
                                                ${selectedOption?.id === option.id ? 'bg-accent/10 text-accent' : 'text-text-primary hover:text-accent'}
                                            `}
                                        >
                                            <span className="whitespace-normal leading-snug py-1 pr-4">{option.name}</span>
                                            {selectedOption?.id === option.id && <CheckCircle2 size={16} className="text-accent" />}
                                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0" />
                                        </button>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
