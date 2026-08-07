import { AlertCircle } from 'lucide-react';

const ScSyncErrorModal = ({ isOpen, error, onClose }) => {
    if (!isOpen || !error) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1300] animate-fade-in p-4"
            onClick={onClose}
        >
            <div
                className="bg-bg-primary rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-border/50 w-full max-w-sm p-8 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
                    <AlertCircle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Sync SC Failed</h3>
                <p className="text-sm text-text-secondary mb-6 break-words">{error}</p>
                <button className="btn btn-primary w-full" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default ScSyncErrorModal;
