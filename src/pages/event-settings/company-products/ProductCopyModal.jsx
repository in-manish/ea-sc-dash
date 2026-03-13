import React, { useState } from 'react';
import { X, Search, Check, Copy, Loader2, Package, History } from 'lucide-react';
import { companyProductService } from '../../../services/companyProductService';

const ProductCopyModal = ({ targetEventId, token, onClose, onComplete }) => {
    const [sourceEventId, setSourceEventId] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [error, setError] = useState(null);

    const fetchSourceProducts = async () => {
        if (!sourceEventId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await companyProductService.getCompanyProducts(sourceEventId, token);
            setProducts(data.results || []);
            setSelectedIds([]); // Reset selection
        } catch (err) {
            setError('Failed to load products from event ' + sourceEventId);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleProduct = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
    };

    const handleCopy = async () => {
        if (selectedIds.length === 0) return;
        setIsCopying(true);
        try {
            const productsToCopy = products.filter(p => selectedIds.includes(p.id));
            await companyProductService.copyCompanyProducts(targetEventId, token, sourceEventId, productsToCopy);
            onComplete();
        } catch (err) {
            alert('Failed to copy some products. Check for duplicate names.');
        } finally {
            setIsCopying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-bg-primary border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-border bg-bg-secondary">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Copy Products</h3>
                        <p className="text-xs text-text-tertiary mt-0.5">Select a source event to copy company products from.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-border rounded-full transition-colors">
                        <X size={20} className="text-text-tertiary" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 bg-bg-tertiary border-b border-border flex gap-3">
                    <div className="relative flex-1">
                        <History className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                        <input 
                            type="number"
                            placeholder="Enter Source Event ID..."
                            value={sourceEventId}
                            onChange={(e) => setSourceEventId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchSourceProducts()}
                            className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-bg-primary"
                        />
                    </div>
                    <button 
                        onClick={fetchSourceProducts}
                        disabled={isLoading || !sourceEventId}
                        className="px-4 py-2 bg-text-primary text-white text-sm font-medium rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Fetch Products'}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-danger text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {products.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                    {products.length} Products Found
                                </p>
                                <button 
                                    onClick={handleSelectAll}
                                    className="text-xs text-accent font-medium hover:underline"
                                >
                                    {selectedIds.length === products.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {products.map(product => (
                                    <div 
                                        key={product.id}
                                        onClick={() => handleToggleProduct(product.id)}
                                        className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${selectedIds.includes(product.id) ? 'bg-accent/5 border-accent shadow-sm' : 'bg-bg-primary border-border hover:border-text-tertiary'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.includes(product.id) ? 'bg-accent border-accent text-white' : 'bg-bg-primary border-border'}`}>
                                                {selectedIds.includes(product.id) && <Check size={12} strokeWidth={4} />}
                                            </div>
                                            <span className="text-sm font-medium">{product.name}</span>
                                        </div>
                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : !isLoading && !error && (
                        <div className="h-full flex flex-col items-center justify-center text-text-tertiary py-12">
                            <Package size={48} className="opacity-10 mb-2" />
                            <p className="text-sm">Enter an event ID to see available products.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-bg-secondary flex justify-between items-center">
                    <p className="text-xs text-text-tertiary">
                        Selected: <span className="font-bold text-text-primary">{selectedIds.length}</span>
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-border rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleCopy}
                            disabled={selectedIds.length === 0 || isCopying}
                            className="px-6 py-2 bg-accent text-white text-sm font-bold rounded-lg hover:shadow-lg hover:bg-accent-hover transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
                        >
                            {isCopying ? <Loader2 className="animate-spin" size={16} /> : <Copy size={16} />}
                            {isCopying ? 'Copying...' : `Copy to Event ${targetEventId}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCopyModal;
