import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Copy, Search, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { SectionHeader } from '../components/SharedComponents';
import { companyProductService } from '../../../services/companyProductService';
import ProductList from './ProductList';
import ProductFormModal from './ProductFormModal';
import ProductCopyModal from './ProductCopyModal';

const CompanyProductSection = ({ eventId, token }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewEventId, setViewEventId] = useState(eventId); // Default to current event

    const fetchProducts = useCallback(async (targetId = viewEventId) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await companyProductService.getCompanyProducts(targetId, token, {
                search: searchQuery
            });
            setProducts(data.results || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load company products.');
        } finally {
            setIsLoading(false);
        }
    }, [token, searchQuery, viewEventId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsFormModalOpen(true);
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await companyProductService.deleteCompanyProduct(eventId, productId, token);
            fetchProducts();
        } catch (err) {
            alert('Failed to delete product.');
        }
    };

    const handleSave = async (data) => {
        try {
            if (selectedProduct) {
                await companyProductService.updateCompanyProduct(eventId, selectedProduct.id, token, data);
            } else {
                await companyProductService.createCompanyProduct(eventId, token, data);
            }
            setIsFormModalOpen(false);
            fetchProducts(eventId); // Always refresh current event list
            setViewEventId(eventId);
        } catch (err) {
            alert('Failed to save product.');
        }
    };

    const handleCopyComplete = () => {
        setIsCopyModalOpen(false);
        setViewEventId(eventId);
        fetchProducts(eventId);
    };

    return (
        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm mt-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <SectionHeader 
                    icon={Package} 
                    title="Company Products" 
                    colorClass="text-emerald-500" 
                    borderClass="bg-emerald-500" 
                />
                <div className="flex gap-2">
                    <button 
                        className="btn btn-sm btn-secondary flex items-center gap-1.5"
                        onClick={() => setIsCopyModalOpen(true)}
                        type="button"
                    >
                        <Copy size={14} />
                        Copy from Event
                    </button>
                    <button 
                        className="btn btn-sm btn-primary flex items-center gap-1.5"
                        onClick={handleCreate}
                        type="button"
                    >
                        <Plus size={14} />
                        Add Product
                    </button>
                </div>
            </div>

            <ProductList 
                products={products}
                currentEventId={eventId}
                viewEventId={viewEventId}
                setViewEventId={setViewEventId}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={() => fetchProducts()}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {isFormModalOpen && (
                <ProductFormModal 
                    product={selectedProduct}
                    onClose={() => setIsFormModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {isCopyModalOpen && (
                <ProductCopyModal 
                    targetEventId={eventId}
                    token={token}
                    onClose={() => setIsCopyModalOpen(false)}
                    onComplete={handleCopyComplete}
                />
            )}
        </div>
    );
};

export default CompanyProductSection;
