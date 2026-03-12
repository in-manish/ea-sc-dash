import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, formName, loading }) => {
    const [inputValue, setInputValue] = useState('');
    const isValid = inputValue === 'DELETE';

    if (!isOpen) return null;

    const handleConfirm = (e) => {
        e.preventDefault();
        if (isValid) onConfirm();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in" onClick={onClose}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-modal-smooth" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-center bg-danger/5">
                    <div className="flex items-center gap-2 text-danger">
                        <AlertTriangle size={20} />
                        <h2 className="text-lg font-bold">Delete Form</h2>
                    </div>
                    <button onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X size={20} /></button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-text-secondary mb-4">
                        This action is <b>permanent</b> and cannot be undone. All questions in <b>{formName}</b> will be lost.
                    </p>
                    <form onSubmit={handleConfirm} className="flex flex-col gap-4">
                        <div className="input-group mb-0">
                            <label className="input-label">Type <b>DELETE</b> to confirm</label>
                            <input 
                                type="text" 
                                className="input-field border-danger/30 focus:border-danger ring-danger/10" 
                                value={inputValue} 
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="DELETE"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3 mt-2">
                            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
                            <button 
                                type="submit" 
                                disabled={!isValid || loading} 
                                className="btn bg-status-danger hover:opacity-90 text-white flex-1 gap-2 border-none disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                Delete Permanently
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
