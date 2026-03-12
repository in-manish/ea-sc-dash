import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const GroupedOptionsSection = ({ options, onUpdateGroup, onAddGroup, onRemoveGroup, onAddValue, onUpdateValue, onRemoveValue }) => (
    <div className="space-y-6 animate-slide-up">
        <div className="flex justify-between items-center">
            <label className="input-label mb-0 text-xs uppercase tracking-wider font-bold text-text-tertiary">Option Groups</label>
            <button type="button" onClick={onAddGroup} className="text-xs font-bold text-accent flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"><Plus size={14} /> Add Group</button>
        </div>
        <div className="space-y-4">
            {options.map((group, gi) => (
                <div key={gi} className="p-4 bg-bg-secondary/30 rounded-xl border border-border/80 group relative">
                    <div className="flex gap-3 mb-4">
                        <input required type="text" className="input-field py-2 text-xs font-bold bg-white" placeholder="Group Name (e.g. INDIA)" value={group.name} onChange={e => onUpdateGroup(gi, e.target.value)} />
                        <button type="button" onClick={() => onRemoveGroup(gi)} className="p-1.5 text-text-tertiary hover:text-status-danger transition-colors" disabled={options.length <= 1}><Trash2 size={16} /></button>
                    </div>
                    <div className="pl-6 border-l-2 border-border/50 space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-tight">Values in {group.name || 'group'}</p>
                            <button type="button" onClick={() => onAddValue(gi)} className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"><Plus size={10} /> Add Value</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {group.values?.map((val, vi) => (
                                <div key={vi} className="flex gap-2">
                                    <input required type="text" className="input-field py-1.5 text-xs bg-white" placeholder="Value..." value={val.name} onChange={e => onUpdateValue(gi, vi, e.target.value)} />
                                    <button type="button" onClick={() => onRemoveValue(gi, vi)} className="p-1.5 text-text-tertiary hover:text-status-danger transition-colors" disabled={group.values.length <= 1}><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default GroupedOptionsSection;
