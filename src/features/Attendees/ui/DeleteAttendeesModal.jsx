import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

const PREVIEW_LIMIT = 5;

// Mounted only while open, so the typed confirmation resets on every open.
const DeleteAttendeesDialog = ({ attendees, count, deleting, error, canForce, onClose, onConfirm }) => {
    const [inputValue, setInputValue] = useState('');
    const [forceDelete, setForceDelete] = useState(false);
    const isValid = inputValue === 'DELETE';
    const preview = attendees.slice(0, PREVIEW_LIMIT);
    const remaining = count - preview.length;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid && !deleting) onConfirm({ forceDelete: canForce && forceDelete });
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in" onClick={onClose}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-modal-smooth" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-center bg-danger/5">
                    <div className="flex items-center gap-2 text-danger">
                        <AlertTriangle size={20} />
                        <h2 className="text-lg font-bold">
                            Delete {count} attendee{count === 1 ? '' : 's'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X size={20} /></button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-text-secondary mb-3">
                        This <b>permanently</b> deletes the selected badges from this event and cannot be undone.
                        Attendees with linked meetings are refused unless you force delete, and nothing is deleted in that case.
                    </p>
                    {preview.length > 0 && (
                        <ul className="text-sm text-text-primary mb-4 list-disc pl-5 space-y-0.5">
                            {preview.map((a) => (
                                <li key={a.uuid}>{a.name || a.email || a.uuid}</li>
                            ))}
                            {remaining > 0 && (
                                <li className="text-text-tertiary list-none -ml-5">and {remaining} more</li>
                            )}
                        </ul>
                    )}
                    {error && (
                        <div className="bg-red-50 text-red-800 p-3 border border-red-200 rounded-md mb-4 text-sm whitespace-pre-line">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {canForce && (
                            <label className="flex items-start gap-2 text-sm text-text-primary cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mt-0.5"
                                    checked={forceDelete}
                                    onChange={(e) => setForceDelete(e.target.checked)}
                                />
                                <span>
                                    <b>Force delete</b> anyway. The linked meetings are kept, but this attendee is
                                    removed from them as sender / receiver.
                                </span>
                            </label>
                        )}
                        <div className="input-group mb-0">
                            <label className="input-label">Type <b>DELETE</b> to confirm</label>
                            <input
                                type="text"
                                className="input-field border-danger/30 focus:border-danger ring-danger/10"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="DELETE"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3 mt-2">
                            <button type="button" onClick={onClose} disabled={deleting} className="btn btn-secondary flex-1">Cancel</button>
                            <button
                                type="submit"
                                disabled={!isValid || deleting}
                                className="btn bg-status-danger hover:opacity-90 text-white flex-1 gap-2 border-none disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                            >
                                {deleting && <Loader2 size={16} className="animate-spin" />}
                                {canForce && forceDelete ? 'Force Delete' : 'Delete Permanently'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const DeleteAttendeesModal = ({ isOpen, attendees = [], ...props }) =>
    isOpen ? <DeleteAttendeesDialog attendees={attendees} {...props} /> : null;

export default DeleteAttendeesModal;
