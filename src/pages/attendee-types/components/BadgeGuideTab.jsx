import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import EBadgeEditor from '../../../components/common/EBadgeEditor';

const BadgeGuideTab = ({ selectedType, setSelectedType, handleSaveBadgeGuide, isActionLoading }) => {
    const handleContentChange = (content) => {
        setSelectedType(prev => ({ ...prev, badge_guide: content }));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-bg-primary border border-border rounded-xl p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <h4 className="text-[15px] font-bold text-text-primary">Badge Guide</h4>
                        <p className="text-xs text-text-tertiary mt-1">Instructions shown with the badge for this attendee type (e.g. where to collect it). Leave empty to remove.</p>
                    </div>
                    <button
                        onClick={handleSaveBadgeGuide}
                        disabled={isActionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-bold text-sm transition-all hover:bg-accent/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-h-[46px]"
                    >
                        {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save
                    </button>
                </div>

                <EBadgeEditor
                    label="Badge Guide Text"
                    description="Plain text or HTML."
                    value={selectedType?.badge_guide || ''}
                    onChange={handleContentChange}
                />
            </div>
        </div>
    );
};

export default BadgeGuideTab;
