import React, { useState, useRef, useEffect } from 'react';
import { Copy, AlertCircle, ChevronDown, Check, Save, Loader2 } from 'lucide-react';
import EBadgeEditor from '../../../components/common/EBadgeEditor';
import EBadgeTemplateInfo from '../../../components/common/EBadgeTemplateInfo';

const EBadgeContentTab = ({ selectedType, setSelectedType, attendeeTypes = [], handleSaveEBadgeContent, isActionLoading }) => {
    const [copyFromId, setCopyFromId] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleContentChange = (content) => {
        if (setSelectedType) {
            setSelectedType(prev => ({ ...prev, ebadge_content: content }));
        }
    };

    const handleCopy = () => {
        if (!copyFromId) return;
        const source = attendeeTypes.find(at => at.id.toString() === copyFromId);
        if (source && setSelectedType) {
            handleContentChange(source.ebadge_content || '');
            setCopyFromId('');
        }
    };

    const otherTypes = attendeeTypes.filter(at => at.id !== selectedType?.id);
    const selectedCopyType = otherTypes.find(at => at.id.toString() === copyFromId);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* E-Badge Content Section */}
            <div className="bg-bg-primary border border-border rounded-xl p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <h4 className="text-[15px] font-bold text-text-primary">E-Badge Content</h4>
                        <p className="text-xs text-text-tertiary mt-1">Configure the printable e-badge content for this attendee type.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {otherTypes.length > 0 && (
                            <div className="flex items-center gap-2 bg-bg-secondary p-1.5 rounded-lg border border-border">
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center justify-between w-full min-w-[200px] text-xs p-2 bg-bg-primary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-text-primary"
                                    >
                                        <span className="truncate pr-2">
                                            {selectedCopyType ? selectedCopyType.name : 'Select type to copy from...'}
                                        </span>
                                        <ChevronDown size={14} className={`text-text-tertiary transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in">
                                            <div className="max-h-[250px] overflow-y-auto outline-none">
                                                {otherTypes.map(at => (
                                                    <button
                                                        key={at.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setCopyFromId(at.id.toString());
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2.5 text-xs transition-colors flex items-center justify-between
                                                            ${copyFromId === at.id.toString() 
                                                                ? 'bg-accent/10 text-accent font-medium' 
                                                                : 'text-text-primary hover:bg-bg-secondary'
                                                            }`}
                                                    >
                                                        <span className="truncate">{at.name}</span>
                                                        {copyFromId === at.id.toString() && <Check size={14} className="text-accent ml-2 shrink-0" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={handleCopy}
                                    disabled={!copyFromId}
                                    className="px-3 py-2 rounded-md font-bold text-xs flex items-center gap-1.5 transition-all bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-h-[34px]"
                                >
                                    <Copy size={14} />
                                    Copy
                                </button>
                            </div>
                        )}
                        <button
                            onClick={handleSaveEBadgeContent}
                            disabled={isActionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-bold text-sm transition-all hover:bg-accent/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-h-[46px]"
                        >
                            {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save
                        </button>
                    </div>
                </div>

                <EBadgeEditor
                    label="E-Badge Text Content"
                    description="This content will be displayed on the attendee's e-badge."
                    value={selectedType?.ebadge_content || ''}
                    onChange={handleContentChange}
                />
            </div>

            <EBadgeTemplateInfo />

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">About E-Badge Content</h4>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        This content will be rendered on the E-Badge exactly as formatted here. Please use the Preview toggle to verify line breaks and layout before saving.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EBadgeContentTab;
