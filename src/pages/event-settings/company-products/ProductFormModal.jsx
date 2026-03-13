import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { FormField, ToggleSwitch } from '../components/SharedComponents';

const ProductFormModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        is_active: product ? product.is_active : true
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        setIsSaving(true);
        try {
            await onSave(formData);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-bg-primary border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                <div className="flex justify-between items-center p-6 border-b border-border bg-bg-secondary">
                    <h3 className="text-lg font-bold text-text-primary">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-border rounded-full transition-colors">
                        <X size={20} className="text-text-tertiary" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <FormField label="Product Name" description="Must be unique within this event.">
                        <input 
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2.5 border border-border rounded-md text-sm bg-bg-primary focus:ring-2 focus:ring-accent/10 focus:border-accent"
                            placeholder="e.g. Premium Booth"
                            autoFocus
                            required
                        />
                    </FormField>

                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border">
                        <div>
                            <p className="text-sm font-semibold text-text-primary">Active Status</p>
                            <p className="text-[10px] text-text-tertiary">Product will be visible in dropdowns if active.</p>
                        </div>
                        <ToggleSwitch 
                            checked={formData.is_active}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-bg-tertiary transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSaving || !formData.name.trim()}
                            className="flex-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving ? 'Saving...' : <><Save size={16} /> Save Product</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
