import React from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';

const ToggleSwitch = ({ name, checked, onChange }) => (
    <label className="relative inline-block w-11 h-6 cursor-pointer m-0">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="block absolute inset-0 rounded-full transition-all duration-300 bg-slate-300 peer-checked:bg-success"></span>
        <span className="absolute left-[3px] bottom-[3px] bg-white w-[18px] h-[18px] rounded-full transition-all duration-300 peer-checked:translate-x-[20px]"></span>
    </label>
);

const AddEditModal = ({
    isAttendeeModalOpen,
    setIsAttendeeModalOpen,
    editingAttendeeType,
    attendeeTypeForm,
    setAttendeeTypeForm,
    isAttendeeSaving,
    handleSaveAttendeeType
}) => {
    if (!isAttendeeModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[1000] animate-fade-in p-4">
            <div className="bg-bg-primary rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">
                            {editingAttendeeType ? 'Edit Attendee Type' : 'Add Attendee Type'}
                        </h3>
                        <p className="text-xs text-text-tertiary mt-0.5">Define name and category properties</p>
                    </div>
                    <button
                        className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                        onClick={() => setIsAttendeeModalOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 flex flex-col gap-6">
                    <div>
                        <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2.5">Type Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-border rounded-xl bg-bg-primary text-[15px] focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                            placeholder="e.g. Exhibitor, Visitor, VIP..."
                            value={attendeeTypeForm.name}
                            onChange={(e) => setAttendeeTypeForm({ ...attendeeTypeForm, name: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                        <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-text-primary font-mono">Special Category</span>
                            <span className="text-[11px] text-text-tertiary mt-0.5 italic">Enhanced permissions or custom logic</span>
                        </div>
                        <ToggleSwitch
                            name="is_special"
                            checked={attendeeTypeForm.is_special}
                            onChange={(e) => setAttendeeTypeForm({ ...attendeeTypeForm, is_special: e.target.checked })}
                        />
                    </div>
                </div>
                <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-secondary/50">
                    <button
                        className="px-5 py-2.5 rounded-xl font-bold text-sm text-text-secondary hover:bg-bg-tertiary transition-colors"
                        onClick={() => setIsAttendeeModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center min-w-[120px]"
                        disabled={isAttendeeSaving || !attendeeTypeForm.name.trim()}
                        onClick={handleSaveAttendeeType}
                    >
                        {isAttendeeSaving ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                <CheckCircle2 size={18} className="mr-2" />
                                {editingAttendeeType ? 'Save Changes' : 'Create Type'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEditModal;
