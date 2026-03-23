import React, { useState } from 'react';
import { Info, Code, ChevronDown } from 'lucide-react';

const EBadgeTemplateInfo = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const variables = [
        { name: 'name', desc: 'Attendee Full Name' },
        { name: 'reg_id', desc: 'Registration ID' },
        { name: 'attendee_type_name', desc: 'Attendee Type Name' },
        { name: 'event_name', desc: 'Event Name' },
        { name: 'event_address', desc: 'Event Address' },
        { name: 'event_start_date', desc: 'Event Start Date' },
        { name: 'event_end_date', desc: 'Event End Date' },
        { name: 'company', desc: 'Company Name' },
        { name: 'designation', desc: 'Designation / Job Title' },
        { name: 'email', desc: 'Email Address' },
        { name: 'phone_number', desc: 'Phone Number' }
    ];

    return (
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl overflow-hidden transition-all duration-300">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 bg-blue-50/80 hover:bg-blue-100/50 transition-colors focus:outline-none"
            >
                <div className="flex items-center gap-2 text-blue-800">
                    <Info size={16} />
                    <h4 className="text-sm font-bold">Supported Template Variables</h4>
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-blue-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                />
            </button>
            
            <div 
                className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="p-4 pt-0 space-y-4">
                    <p className="text-xs text-blue-600 leading-relaxed">
                        Use the following variables to inject dynamic context into the e-badge content. Wrap them in double braces like <code className="bg-blue-100/80 px-1 py-0.5 rounded font-mono text-[11px]">{'{{ name }}'}</code>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {variables.map(v => (
                            <div key={v.name} className="flex flex-col bg-white border border-blue-50 rounded-lg p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors hover:border-blue-200 hover:shadow-sm">
                                <span className="font-mono font-bold text-blue-700 flex items-center gap-1.5 mb-1 text-[11px]">
                                    <Code size={12} className="text-blue-400" />
                                    {`{{ ${v.name} }}`}
                                </span>
                                <span className="text-text-tertiary text-[10px] uppercase tracking-wide font-medium">{v.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EBadgeTemplateInfo;
