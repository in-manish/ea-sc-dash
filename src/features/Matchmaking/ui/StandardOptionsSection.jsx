import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const StandardOptionsSection = ({ options, onUpdate, onAdd, onRemove }) => (
    <div className="space-y-4 animate-slide-up">
        <div className="flex justify-between items-center">
            <label className="input-label mb-0 text-xs uppercase tracking-wider font-bold text-text-tertiary">Options</label>
            <button type="button" onClick={onAdd} className="text-xs font-bold text-accent flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"><Plus size={14} /> Add Option</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, i) => (
                <div key={i} className="flex gap-2 group">
                    <input required type="text" className="input-field py-1.5 text-xs bg-bg-secondary/30 group-hover:bg-bg-secondary transition-colors" placeholder={`Option ${i+1}`} value={opt.name} onChange={e => onUpdate(i, e.target.value)} />
                    <button type="button" onClick={() => onRemove(i)} className="p-1.5 text-text-tertiary hover:text-status-danger transition-colors" disabled={options.length <= 1}><Trash2 size={14} /></button>
                </div>
            ))}
        </div>
    </div>
);

export default StandardOptionsSection;
