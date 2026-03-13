import React from 'react';
import { Search, RefreshCw, Edit2, Trash2, ExternalLink, PackageOpen } from 'lucide-react';

const ProductList = ({ 
    products, 
    currentEventId, 
    viewEventId, 
    setViewEventId, 
    isLoading, 
    onEdit, 
    onDelete, 
    onRefresh,
    searchQuery,
    setSearchQuery
}) => {
    const showShortcuts = true; // Show shortcuts for easier navigation across test events

    const handleEventShortcut = (id) => {
        setViewEventId(id);
    };

    return (
        <div className="space-y-4">
            {/* Search and Navigation */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-bg-secondary p-4 rounded-lg border border-border">
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Viewing Event ID</label>
                    <div className="flex gap-2">
                        <div className="relative group/input">
                            <input 
                                type="number"
                                value={viewEventId}
                                onChange={(e) => setViewEventId(e.target.value)}
                                className="w-20 p-2 border border-border rounded-md text-sm bg-bg-primary font-mono focus:ring-2 focus:ring-accent/10 outline-none transition-all shadow-sm"
                            />
                        </div>

                        {showShortcuts && (
                            <div className="flex items-center gap-1 bg-bg-tertiary/50 p-1 rounded-lg border border-border/50">
                                <span className="text-[8px] font-bold text-text-tertiary uppercase px-1.5 border-r border-border/50 mr-1">Events</span>
                                {(() => {
                                    const curr = Number(currentEventId);
                                    let ids = [];
                                    
                                    if (curr <= 10) {
                                        // Show 1 to curr-1 if curr is small
                                        for (let i = 1; i < curr; i++) ids.push(i);
                                    } else {
                                        // Show 1, 2, 3 ... curr-4, curr-3, curr-2, curr-1
                                        ids = [1, 2, 3, '...', curr - 4, curr - 3, curr - 2, curr - 1];
                                    }

                                    return ids.map((id, index) => (
                                        id === '...' ? (
                                            <span key={`sep-${index}`} className="text-[10px] text-text-tertiary px-1">...</span>
                                        ) : (
                                            <button
                                                key={id}
                                                onClick={() => handleEventShortcut(id)}
                                                className={`w-7 h-7 flex items-center justify-center rounded text-[11px] font-bold transition-all ${Number(viewEventId) === id ? 'bg-accent text-white shadow-sm ring-2 ring-accent/20' : 'text-text-secondary hover:bg-bg-primary hover:text-accent'}`}
                                                type="button"
                                                title={`View Event ${id}`}
                                            >
                                                {id}
                                            </button>
                                        )
                                    ));
                                })()}
                            </div>
                        )}

                        <button 
                            onClick={() => setViewEventId(currentEventId)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${Number(viewEventId) === Number(currentEventId) ? 'bg-bg-tertiary/50 text-text-tertiary cursor-default pointer-events-none' : 'bg-accent/5 text-accent hover:bg-accent/10 border border-accent/20'}`}
                            type="button"
                        >
                            Reset to Current ({currentEventId})
                        </button>
                    </div>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                    <input 
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent/10"
                    />
                </div>
            </div>

            {/* List Table */}
            <div className="overflow-hidden rounded-lg border border-border bg-bg-primary">
                {isLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-3 text-text-secondary">
                        <RefreshCw className="animate-spin text-accent" size={24} />
                        <p className="text-sm">Loading products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-secondary border-b border-border">
                                <th className="p-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">ID</th>
                                <th className="p-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Name</th>
                                <th className="p-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-bg-secondary/50 transition-colors group">
                                    <td className="p-4 text-sm text-text-tertiary font-mono">{product.id}</td>
                                    <td className="p-4 text-sm font-medium text-text-primary">{product.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${product.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => onEdit(product)}
                                                className="w-8 h-8 flex items-center justify-center rounded border border-border bg-bg-primary text-text-secondary hover:bg-bg-tertiary"
                                                title="Edit Product"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(product.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded border border-border bg-bg-primary text-danger hover:bg-red-50"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center text-text-tertiary">
                        <PackageOpen className="mx-auto mb-3 opacity-20" size={48} />
                        <p className="text-sm">No company products found.</p>
                        <p className="text-xs mt-1">Try a different search or event ID.</p>
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-text-tertiary px-1">
                <p>Showing {products.length} products</p>
                <button onClick={onRefresh} className="flex items-center gap-1 hover:text-accent">
                    <RefreshCw size={10} />
                    Refresh List
                </button>
            </div>
        </div>
    );
};

export default ProductList;
