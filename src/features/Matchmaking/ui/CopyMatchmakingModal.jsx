import React, { useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCopyMatchmaking } from '../hooks/useCopyMatchmaking';
import CopySourceStep from './CopySourceStep';
import CopyQuestionsStep from './CopyQuestionsStep';
import CopyMappingStep from './CopyMappingStep';

const CopyMatchmakingModal = ({ isOpen, onClose, toEventId, onSuccess, onDestExists, onOpenDestQuestion }) => {
    const { token } = useAuth();
    const copy = useCopyMatchmaking({
        isOpen, toEventId, token, onSuccess, onDestExists,
    });

    useEffect(() => {
        if (isOpen) copy.resetWizard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1100]" onClick={onClose}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary">
                    <h2 className="text-lg font-bold">Copy from another event</h2>
                    <button type="button" onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X size={20} /></button>
                </div>
                <div className="p-6">
                    {copy.success ? (
                        <div className="flex flex-col items-center py-8 text-center">
                            <CheckCircle2 size={48} className="text-success mb-4" />
                            <h3 className="font-bold text-text-primary mb-2">Copied</h3>
                            <p className="text-sm text-text-secondary">Loading this event&apos;s new question IDs…</p>
                        </div>
                    ) : copy.step === 'source' ? (
                        <CopySourceStep
                            fromId={copy.fromId}
                            setFromId={copy.setFromId}
                            toEventId={toEventId}
                            error={copy.error}
                            loading={copy.loading}
                            onContinue={copy.loadSource}
                        />
                    ) : copy.step === 'questions' ? (
                        <CopyQuestionsStep
                            sourceForm={copy.sourceForm}
                            destQuestions={copy.destQuestions}
                            selectedIds={copy.selectedIds}
                            toggleQuestion={copy.toggleQuestion}
                            toggleSelectAll={copy.toggleSelectAll}
                            error={copy.error}
                            onBack={() => { copy.setStep('source'); copy.setError(null); }}
                            onContinue={() => { copy.setError(null); copy.setStep('mapping'); }}
                            onOpenDestQuestion={onOpenDestQuestion}
                        />
                    ) : (
                        <CopyMappingStep
                            types={copy.types}
                            setTypes={copy.setTypes}
                            sourceTypes={copy.sourceTypes}
                            destTypes={copy.destTypes}
                            error={copy.error}
                            loading={copy.loading}
                            onBack={() => { copy.setStep('questions'); copy.setError(null); }}
                            onSubmit={copy.submitCopy}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CopyMatchmakingModal;
