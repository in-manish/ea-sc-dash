import React from 'react';
import { ArrowRightLeft, Loader2, AlertCircle } from 'lucide-react';

const TransferTab = ({
    selectedType,
    attendeeTypes,
    transferTargetId,
    setTransferTargetId,
    handleTransferAttendees,
    isActionLoading
}) => {
    return (
        <div className="space-y-6 animate-fade-in flex flex-col items-center py-10">
            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary mb-4">
                <ArrowRightLeft size={32} />
            </div>
            <div className="text-center max-w-sm mb-8">
                <h4 className="text-lg font-bold text-text-primary">Transfer Attendees</h4>
                <p className="text-sm text-text-tertiary mt-2">Move all attendees from <b>{selectedType.name}</b> to a different category.</p>
            </div>

            <div className="w-full max-w-xs space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block text-center">Select Target Category</label>
                    <select
                        className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                        value={transferTargetId}
                        onChange={(e) => setTransferTargetId(e.target.value)}
                    >
                        <option value="">Choose a type...</option>
                        {attendeeTypes.filter(at => at.id !== selectedType.id).map(at => (
                            <option key={at.id} value={at.id}>{at.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    className="w-full btn btn-primary py-3 rounded-xl font-bold shadow-lg shadow-accent/20 mt-4 flex items-center justify-center gap-2"
                    onClick={handleTransferAttendees}
                    disabled={isActionLoading || !transferTargetId}
                >
                    {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRightLeft size={18} />}
                    Confirm Transfer
                </button>
            </div>

            <div className="mt-10 p-4 bg-red-50 border border-red-100 rounded-xl max-w-md">
                <div className="flex gap-3">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <h5 className="text-xs font-bold text-red-900 uppercase tracking-tight">Warning</h5>
                        <p className="text-[11px] text-red-700 mt-1 leading-relaxed">
                            This action will update all attendees currently assigned to this type. This cannot be easily undone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferTab;
