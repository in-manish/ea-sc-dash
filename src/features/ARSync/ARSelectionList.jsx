import React, { useState } from 'react';
import { Package, ChevronRight, ChevronDown, CheckCircle2, Circle } from 'lucide-react';

const ARSelectionList = ({ groups, selectedItems, onToggleGroup, onToggleProduct, onSelectAll }) => {
    const [expandedGroups, setExpandedGroups] = useState(new Set());

    const toggleExpand = (groupId) => {
        const next = new Set(expandedGroups);
        if (next.has(groupId)) next.delete(groupId);
        else next.add(groupId);
        setExpandedGroups(next);
    };

    const isGroupSelected = (groupId) => selectedItems.groups.has(groupId);
    const isProductSelected = (productId) => selectedItems.products.has(productId);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-border bg-bg-secondary flex justify-between items-center">
                <span className="text-sm font-semibold">{groups.length} Groups Found</span>
                <button
                    onClick={onSelectAll}
                    className="text-xs font-bold text-accent uppercase hover:underline"
                >
                    Select All
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {groups.map((group) => (
                    <div key={group.id} className="border border-border rounded-xl overflow-hidden bg-white">
                        <div className="p-3 flex items-center gap-3 hover:bg-bg-secondary transition-colors cursor-pointer group">
                            <button onClick={(e) => { e.stopPropagation(); toggleExpand(group.id); }} className="text-text-tertiary">
                                {expandedGroups.has(group.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            <div className="flex-1 min-w-0" onClick={() => onToggleGroup(group)}>
                                <h4 className="font-bold text-sm truncate">{group.group_name}</h4>
                                <p className="text-[10px] text-text-tertiary uppercase font-bold">{group.products?.length || 0} Products</p>
                            </div>
                            <button onClick={() => onToggleGroup(group)} className="text-accent">
                                {isGroupSelected(group.id) ? <CheckCircle2 size={20} /> : <Circle size={20} className="text-border group-hover:text-accent/50" />}
                            </button>
                        </div>
                        {expandedGroups.has(group.id) && group.products?.length > 0 && (
                            <div className="bg-bg-secondary/50 border-t border-border p-2 space-y-1">
                                {group.products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer group/item"
                                        onClick={() => onToggleProduct(product, group.id)}
                                    >
                                        <Package size={14} className="text-text-tertiary ml-6" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{product.product_name}</p>
                                            <p className="text-[10px] text-emerald-600 font-bold">₹{product.inr_value}</p>
                                        </div>
                                        <button className="text-accent">
                                            {isProductSelected(product.id) ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-border group-hover/item:text-accent/50" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ARSelectionList;
