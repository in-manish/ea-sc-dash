import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Braces, List, Check, X, Edit2 } from 'lucide-react';

const JsonTreeNode = ({ label, value, isLast = true, onUpdate, path = [] }) => {
    const [isExpanded, setIsExpanded] = useState(path.length < 1);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    
    const isObject = value !== null && typeof value === 'object';
    const isArray = Array.isArray(value);

    const handleStartEdit = () => {
        if (!onUpdate) return;
        setEditValue(typeof value === 'string' ? value : JSON.stringify(value));
        setIsEditing(true);
    };

    const handleSave = () => {
        try {
            let newValue = editValue;
            // Try to parse as JSON if it's not a simple string
            if (editValue !== 'null' && editValue !== 'true' && editValue !== 'false' && !isNaN(editValue)) {
                newValue = JSON.parse(editValue);
            } else if (editValue === 'true') newValue = true;
            else if (editValue === 'false') newValue = false;
            else if (editValue === 'null') newValue = null;
            
            onUpdate(path, newValue);
            setIsEditing(false);
        } catch (err) {
            // If parsing fails, treat as string if it was originally a string, otherwise error
            if (typeof value === 'string') {
                onUpdate(path, editValue);
                setIsEditing(false);
            } else {
                alert('Invalid format for this value type.');
            }
        }
    };

    if (!isObject) {
        return (
            <div className="flex items-start gap-2 py-0.5 text-[11px] leading-relaxed group/node">
                <span className="text-indigo-400 font-mono whitespace-nowrap">"{label}":</span>
                {isEditing ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <input 
                            autoFocus
                            className="bg-white/10 border-none text-white font-mono px-1 rounded w-full outline-none ring-1 ring-accent"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                        <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300"><Check size={12} /></button>
                        <button onClick={() => setIsEditing(false)} className="text-rose-400 hover:text-rose-300"><X size={12} /></button>
                    </div>
                ) : (
                    <span 
                        className={`font-mono break-all cursor-pointer hover:bg-white/5 px-1 rounded transition-colors ${
                            typeof value === 'string' ? 'text-emerald-400' : 
                            typeof value === 'number' ? 'text-amber-400' : 
                            typeof value === 'boolean' ? 'text-rose-400' : 'text-slate-400'
                        }`}
                        onClick={handleStartEdit}
                        title={onUpdate ? "Click to edit" : ""}
                    >
                        {JSON.stringify(value)}{!isLast && <span className="text-text-tertiary">,</span>}
                        {onUpdate && <Edit2 size={10} className="inline ml-2 opacity-0 group-hover/node:opacity-50 text-text-tertiary" />}
                    </span>
                )}
            </div>
        );
    }

    const keys = Object.keys(value);
    const isEmpty = keys.length === 0;

    return (
        <div className="text-[11px] font-mono">
            <div 
                className="flex items-center gap-1 py-0.5 cursor-pointer group hover:bg-white/5 rounded-sm px-1 -ml-1 transition-colors"
                onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
            >
                <div className="w-4 h-4 flex items-center justify-center">
                    {!isEmpty && (
                        isExpanded ? <ChevronDown size={12} className="text-text-tertiary group-hover:text-text-secondary" /> : <ChevronRight size={12} className="text-text-tertiary group-hover:text-text-secondary" />
                    )}
                </div>
                {isArray ? <List size={12} className="text-blue-400/70" /> : <Braces size={12} className="text-purple-400/70" />}
                <span className="text-indigo-300 font-medium">"{label}":</span>
                <span className="text-text-tertiary text-[10px]">
                    {isArray ? `Array[${keys.length}]` : `Object{${keys.length}}`}
                    {(!isExpanded || isEmpty) && (isArray ? ' []' : ' {}')}
                    {!isLast && !isExpanded && ','}
                </span>
            </div>
            
            {isExpanded && !isEmpty && (
                <div className="ml-4 border-l border-white/10 pl-4 py-1">
                    {keys.map((key, index) => (
                        <JsonTreeNode 
                            key={key} 
                            label={key} 
                            value={value[key]} 
                            isLast={index === keys.length - 1}
                            onUpdate={onUpdate}
                            path={[...path, key]}
                        />
                    ))}
                </div>
            )}
            {isExpanded && !isEmpty && (
                <div className="text-text-tertiary opacity-50 h-2 flex items-center">
                    {isArray ? ']' : '}'}{!isLast && ','}
                </div>
            )}
        </div>
    );
};

const JsonTree = ({ data, title, onUpdate }) => {
    if (!data) return null;

    return (
        <div className="bg-[#1e1e2e] rounded-lg border border-white/10 overflow-hidden shadow-xl">
            {title && (
                <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{title}</span>
                </div>
            )}
            <div className="p-4 max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="text-[11px] font-mono text-text-tertiary mb-1">{Array.isArray(data) ? '[' : '{'}</div>
                <div className="ml-4">
                    {Object.keys(data).map((key, index) => (
                        <JsonTreeNode 
                            key={key} 
                            label={key} 
                            value={data[key]} 
                            isLast={index === Object.keys(data).length - 1} 
                            onUpdate={onUpdate}
                            path={[key]}
                        />
                    ))}
                </div>
                <div className="text-[11px] font-mono text-text-tertiary mt-1">{Array.isArray(data) ? ']' : '}'}</div>
            </div>
        </div>
    );
};

export default JsonTree;
