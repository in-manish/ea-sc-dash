import React from 'react';

export const ToggleSwitch = ({ name, checked, isModified, onChange }) => (
    <label className="relative inline-block w-11 h-6 cursor-pointer m-0">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
        <span className={`block absolute inset-0 rounded-full transition-all duration-300 ${isModified ? 'bg-amber-500 peer-checked:bg-amber-500' : 'bg-slate-300 peer-checked:bg-success'}`}></span>
        <span className="absolute left-[3px] bottom-[3px] bg-white w-[18px] h-[18px] rounded-full transition-all duration-300 peer-checked:translate-x-[20px]"></span>
    </label>
);

export const getInputClass = (fieldName, isModified, isIcon = false) => `w-full p-2.5 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 ${isIcon ? 'pl-9' : ''} ${isModified ? 'border-amber-500 bg-[#fffbeb] text-amber-900 focus:border-amber-600 focus:ring-amber-500/20' : 'border-border bg-bg-primary text-text-primary focus:border-accent focus:ring-accent/10'}`;

export const SectionHeader = ({ icon: Icon, title, colorClass = 'text-accent', borderClass = 'bg-accent' }) => (
    <div className="relative">
        <div className={`absolute top-0 left-0 w-1 h-full ${borderClass} opacity-20`}></div>
        <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border flex items-center gap-2">
            {Icon && <Icon size={18} className={colorClass} />}
            {title}
        </h3>
    </div>
);

export const FormField = ({ label, children, description }) => (
    <div className="space-y-2">
        {label && <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">{label}</label>}
        {children}
        {description && <p className="text-[10px] text-text-tertiary mt-1">{description}</p>}
    </div>
);
