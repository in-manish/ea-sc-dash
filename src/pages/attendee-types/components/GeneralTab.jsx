import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const GeneralTab = ({ selectedType }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Type Name</label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={selectedType.name}
                            readOnly
                            className="w-full p-3.5 bg-bg-secondary border border-border rounded-xl text-text-primary font-medium focus:outline-none opacity-80"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] bg-bg-tertiary px-2 py-1 rounded border border-border text-text-tertiary">Read-only here</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider block">Special Category</label>
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${selectedType.is_special ? 'bg-amber-50 border-amber-100' : 'bg-bg-secondary border-border'
                        }`}>
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${selectedType.is_special ? 'text-amber-700' : 'text-text-primary'}`}>
                                {selectedType.is_special ? 'Enabled' : 'Disabled'}
                            </span>
                            <span className="text-[11px] text-text-tertiary mt-0.5">Custom logic and priority badge processing</span>
                        </div>
                        <CheckCircle2 className={selectedType.is_special ? 'text-amber-500' : 'text-text-tertiary'} size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">About this type</h4>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        This attendee type is used to categorize participants. You can customize badge designs and email/SMS templates specifically for this group using the tabs on the left.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GeneralTab;
