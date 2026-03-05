import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { arSyncService } from './arSyncService';
import EventSelector from './EventSelector';
import ARSelectionList from './ARSelectionList';
import SyncProgressView from './SyncProgressView';

const ARSyncModal = ({ targetEventId, token, onClose, onRefresh }) => {
    const [step, setStep] = useState('selector');
    const [loading, setLoading] = useState(false);
    const [sourceEventId, setSourceEventId] = useState(null);
    const [sourceGroups, setSourceGroups] = useState([]);
    const [selectedItems, setSelectedItems] = useState({ groups: new Set(), products: new Set() });
    const [syncProgress, setSyncProgress] = useState({ total: 0, completed: 0 });
    const [syncResults, setSyncResults] = useState([]);

    const handleLoadSource = async (eventId) => {
        setLoading(true);
        setSourceEventId(eventId);
        try {
            const data = await arSyncService.fetchSourceData(eventId, token);
            setSourceGroups(data);
            setStep('selection');
        } catch (error) {
            alert('Failed to load event data. Please verify the ID.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleGroup = (group) => {
        const next = { ...selectedItems, groups: new Set(selectedItems.groups), products: new Set(selectedItems.products) };
        if (next.groups.has(group.id)) {
            next.groups.delete(group.id);
            group.products?.forEach(p => next.products.delete(p.id));
        } else {
            next.groups.add(group.id);
            group.products?.forEach(p => next.products.add(p.id));
        }
        setSelectedItems(next);
    };

    const handleToggleProduct = (product, groupId) => {
        const next = { ...selectedItems, groups: new Set(selectedItems.groups), products: new Set(selectedItems.products) };
        if (next.products.has(product.id)) next.products.delete(product.id);
        else {
            next.products.add(product.id);
            next.groups.add(groupId);
        }
        setSelectedItems(next);
    };

    const handleStartSync = async () => {
        // Prepare payload for the bulk copy API
        const selection = Array.from(selectedItems.groups).map(groupId => {
            const group = sourceGroups.find(g => g.id === groupId);
            const productIds = group.products
                ?.filter(p => selectedItems.products.has(p.id))
                .map(p => p.id) || [];
            return { groupId, productIds };
        });

        if (selection.length === 0) return;

        setSyncProgress({ total: 1, completed: 0 });
        setSyncResults([{ name: 'Bulk Copy Operation', status: 'pending' }]);
        setStep('progress');

        try {
            await arSyncService.copyData(targetEventId, sourceEventId, selection, token);
            setSyncResults([{ name: 'Bulk Copy Operation', status: 'success' }]);
            setSyncProgress({ total: 1, completed: 1 });
        } catch (err) {
            setSyncResults([{ name: 'Bulk Copy Operation', status: 'failed', error: err.message }]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        {step !== 'selector' && step !== 'progress' && (
                            <button onClick={() => setStep('selector')} className="p-1 hover:bg-gray-200 rounded-lg text-text-tertiary"><ArrowLeft size={18} /></button>
                        )}
                        <h3 className="font-bold text-gray-800">Sync from Other Event</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-red-50 text-text-tertiary hover:text-red-500 rounded-lg transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-hidden">
                    {step === 'selector' && <EventSelector currentEventId={targetEventId} onSelect={handleLoadSource} loading={loading} />}
                    {step === 'selection' && (
                        <ARSelectionList
                            groups={sourceGroups}
                            selectedItems={selectedItems}
                            onToggleGroup={handleToggleGroup}
                            onToggleProduct={handleToggleProduct}
                            onSelectAll={() => sourceGroups.forEach(handleToggleGroup)}
                        />
                    )}
                    {step === 'progress' && <SyncProgressView progress={syncProgress} results={syncResults} onRetry={handleStartSync} onDone={() => { onRefresh(); onClose(); }} />}
                </div>

                {step === 'selection' && (
                    <div className="p-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                        <button onClick={onClose} className="btn btn-secondary font-semibold px-6">Cancel</button>
                        <button
                            disabled={selectedItems.groups.size === 0}
                            onClick={handleStartSync}
                            className="btn btn-primary font-bold px-8 shadow-md"
                        >
                            Sync {selectedItems.products.size} Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ARSyncModal;
