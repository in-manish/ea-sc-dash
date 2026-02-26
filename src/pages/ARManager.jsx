import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, Plus, Edit2, Trash2, ChevronRight, ChevronDown, Package, Image as ImageIcon, Eye } from 'lucide-react';

const ARManager = ({ eventId }) => {
    const { token } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Expanded groups
    const [expandedGroups, setExpandedGroups] = useState(new Set());

    // Group products map: { groupId: { loading, data, error } }
    const [productsState, setProductsState] = useState({});

    // Modals state
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null); // null for new
    const [groupForm, setGroupForm] = useState({ group_name: '', position: 0, group_details_json: '{}', is_active: true });
    const [savingGroup, setSavingGroup] = useState(false);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [activeGroupIdForProduct, setActiveGroupIdForProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null); // null for new
    const [productForm, setProductForm] = useState({
        product_name: '', product_desc: '', inr_value: '', usd_value: '', max_order: '', position: 0, is_visible: true, is_active: true
    });
    const [productPhoto, setProductPhoto] = useState(null);
    const [savingProduct, setSavingProduct] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, [eventId, token]);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const data = await eventService.getARGroups(eventId, token);
            setGroups(data.results || data); // handle both paginated and non-paginated shapes if they differ
        } catch (err) {
            setError('Failed to load groups.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsForGroup = async (groupId) => {
        setProductsState(prev => ({ ...prev, [groupId]: { loading: true, data: [], error: null } }));
        try {
            const data = await eventService.getARProducts(eventId, groupId, token);
            setProductsState(prev => ({
                ...prev,
                [groupId]: { loading: false, data: data.results || data, error: null }
            }));
        } catch (err) {
            setProductsState(prev => ({
                ...prev,
                [groupId]: { loading: false, data: [], error: 'Failed to load products.' }
            }));
        }
    };

    const toggleGroup = (groupId) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupId)) {
            newExpanded.delete(groupId);
        } else {
            newExpanded.add(groupId);
            if (!productsState[groupId]) {
                fetchProductsForGroup(groupId);
            }
        }
        setExpandedGroups(newExpanded);
    };

    // --- Group Actions ---
    const handleOpenGroupModal = (group = null) => {
        if (group) {
            setEditingGroup(group);
            setGroupForm({
                group_name: group.group_name || '',
                position: group.position || 0,
                group_details_json: JSON.stringify(group.group_details_json || {}, null, 2),
                is_active: group.is_active
            });
        } else {
            setEditingGroup(null);
            setGroupForm({ group_name: '', position: 0, group_details_json: '{}', is_active: true });
        }
        setIsGroupModalOpen(true);
    };

    const handleSaveGroup = async () => {
        setSavingGroup(true);
        try {
            let jsonPayload = {};
            try {
                jsonPayload = JSON.parse(groupForm.group_details_json);
            } catch (e) {
                // If invalid JSON, maybe alert or default to empty
            }

            const payload = {
                group_name: groupForm.group_name,
                position: parseInt(groupForm.position) || 0,
                group_details_json: jsonPayload,
                is_active: groupForm.is_active
            };

            if (editingGroup) {
                await eventService.updateARGroup(eventId, editingGroup.id, token, payload);
            } else {
                await eventService.createARGroup(eventId, token, payload);
            }
            setIsGroupModalOpen(false);
            fetchGroups();
        } catch (err) {
            alert('Failed to save group');
        } finally {
            setSavingGroup(false);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (window.confirm('Are you sure you want to delete this group?')) {
            try {
                await eventService.deleteARGroup(eventId, groupId, token);
                fetchGroups();
            } catch (err) {
                alert('Failed to delete group');
            }
        }
    };

    // --- Product Actions ---
    const handleOpenProductModal = (groupId, product = null) => {
        setActiveGroupIdForProduct(groupId);
        if (product) {
            setEditingProduct(product);
            setProductForm({
                product_name: product.product_name || '',
                product_desc: product.product_desc || '',
                inr_value: product.inr_value || '',
                usd_value: product.usd_value || '',
                max_order: product.max_order || '',
                position: product.position || 0,
                is_visible: product.is_visible,
                is_active: product.is_active
            });
        } else {
            setEditingProduct(null);
            setProductForm({
                product_name: '', product_desc: '', inr_value: '', usd_value: '', max_order: '10', position: 0, is_visible: true, is_active: true
            });
        }
        setProductPhoto(null);
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async () => {
        setSavingProduct(true);
        try {
            let payload;
            let isMultipart = false;

            if (productPhoto) {
                isMultipart = true;
                payload = new FormData();
                payload.append('product_name', productForm.product_name);
                payload.append('product_desc', productForm.product_desc);
                payload.append('inr_value', productForm.inr_value);
                payload.append('usd_value', productForm.usd_value);
                payload.append('max_order', productForm.max_order || '');
                payload.append('position', productForm.position || 0);
                payload.append('is_visible', productForm.is_visible);
                payload.append('is_active', productForm.is_active);
                payload.append('product_photo', productPhoto);
                // Also default quantity if required
                payload.append('quantity', 10000);
            } else {
                payload = {
                    product_name: productForm.product_name,
                    product_desc: productForm.product_desc,
                    inr_value: productForm.inr_value,
                    usd_value: productForm.usd_value,
                    max_order: productForm.max_order || null,
                    position: parseInt(productForm.position) || 0,
                    is_visible: productForm.is_visible,
                    is_active: productForm.is_active,
                    quantity: 10000
                };
            }

            if (editingProduct) {
                await eventService.updateARProduct(eventId, editingProduct.id, token, payload, isMultipart);
            } else {
                await eventService.createARProduct(eventId, activeGroupIdForProduct, token, payload, isMultipart);
            }
            setIsProductModalOpen(false);
            if (expandedGroups.has(activeGroupIdForProduct)) {
                fetchProductsForGroup(activeGroupIdForProduct);
            }
        } catch (err) {
            alert('Failed to save product');
        } finally {
            setSavingProduct(false);
        }
    };

    const handleDeleteProduct = async (groupId, productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await eventService.deleteARProduct(eventId, productId, token);
                if (expandedGroups.has(groupId)) {
                    fetchProductsForGroup(groupId);
                }
            } catch (err) {
                alert('Failed to delete product');
            }
        }
    };

    const renderGroupModal = () => (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="text-xl font-bold">{editingGroup ? 'Edit Group' : 'Create Group'}</h3>
                    <button className="text-text-tertiary hover:text-text-primary" onClick={() => setIsGroupModalOpen(false)}><XIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Group Name</label>
                        <input type="text" className="w-full p-2.5 border border-border rounded-lg" value={groupForm.group_name} onChange={e => setGroupForm({ ...groupForm, group_name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Position (Sort Order)</label>
                        <input type="number" className="w-full p-2.5 border border-border rounded-lg" value={groupForm.position} onChange={e => setGroupForm({ ...groupForm, position: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Group Details (JSON)</label>
                        <textarea className="w-full p-2.5 border border-border rounded-lg h-24 font-mono text-sm" value={groupForm.group_details_json} onChange={e => setGroupForm({ ...groupForm, group_details_json: e.target.value })} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-border">
                        <span className="font-semibold text-sm">Active</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={groupForm.is_active} onChange={e => setGroupForm({ ...groupForm, is_active: e.target.checked })} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                    </div>
                </div>
                <div className="p-6 border-t border-border flex justify-end gap-3 rounded-b-xl bg-gray-50">
                    <button className="btn btn-secondary font-semibold" onClick={() => setIsGroupModalOpen(false)}>Cancel</button>
                    <button className="btn btn-primary font-semibold" disabled={savingGroup} onClick={handleSaveGroup}>
                        {savingGroup ? 'Saving...' : 'Save Group'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderProductModal = () => (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                    <button className="text-text-tertiary hover:text-text-primary" onClick={() => setIsProductModalOpen(false)}><XIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Product Name</label>
                        <input type="text" className="w-full p-2.5 border border-border rounded-lg" value={productForm.product_name} onChange={e => setProductForm({ ...productForm, product_name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Description</label>
                        <textarea className="w-full p-2.5 border border-border rounded-lg h-24" value={productForm.product_desc} onChange={e => setProductForm({ ...productForm, product_desc: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">INR Price</label>
                            <input type="number" step="0.01" className="w-full p-2.5 border border-border rounded-lg" value={productForm.inr_value} onChange={e => setProductForm({ ...productForm, inr_value: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">USD Price</label>
                            <input type="number" step="0.01" className="w-full p-2.5 border border-border rounded-lg" value={productForm.usd_value} onChange={e => setProductForm({ ...productForm, usd_value: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Max Order</label>
                            <input type="number" className="w-full p-2.5 border border-border rounded-lg" value={productForm.max_order} onChange={e => setProductForm({ ...productForm, max_order: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Position</label>
                            <input type="number" className="w-full p-2.5 border border-border rounded-lg" value={productForm.position} onChange={e => setProductForm({ ...productForm, position: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border">
                            <span className="font-semibold text-sm">Visible</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={productForm.is_visible} onChange={e => setProductForm({ ...productForm, is_visible: e.target.checked })} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border">
                            <span className="font-semibold text-sm">Active</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={productForm.is_active} onChange={e => setProductForm({ ...productForm, is_active: e.target.checked })} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Product Photo</label>
                        <input type="file" className="w-full p-2 text-sm border border-border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-accent hover:file:bg-blue-100" onChange={e => setProductPhoto(e.target.files[0])} accept="image/*" />
                        {editingProduct?.product_photo && !productPhoto && (
                            <div className="mt-2 text-xs text-text-secondary">Current photo exists. Uploading a new one will replace it.</div>
                        )}
                    </div>
                </div>
                <div className="p-6 border-t border-border flex justify-end gap-3 rounded-b-xl bg-gray-50">
                    <button className="btn btn-secondary font-semibold" onClick={() => setIsProductModalOpen(false)}>Cancel</button>
                    <button className="btn btn-primary font-semibold" disabled={savingProduct} onClick={handleSaveProduct}>
                        {savingProduct ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>
        </div>
    );

    const XIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    );

    if (loading && groups.length === 0) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div>;
    if (error) return <div className="p-4 bg-red-50 text-red-800 rounded-md">{error}</div>;

    return (
        <div className="py-4 animate-fade-in w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Requirement Setup</h1>
                    <p className="text-sm text-text-secondary">Configure Additional Requirement Groups and Products for Event #{eventId}</p>
                </div>
                <button className="btn btn-primary shadow-md hover:shadow-lg transition-all" onClick={() => handleOpenGroupModal()}>
                    <Plus size={16} className="mr-2" /> New Group
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {groups.map(group => {
                    const isExpanded = expandedGroups.has(group.id);
                    const groupProducts = productsState[group.id];

                    return (
                        <div key={group.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300">
                            {/* Group Header */}
                            <div className="p-4 flex items-center justify-between border-b border-transparent group hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleGroup(group.id)}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'bg-primary/10 text-primary rotate-90' : 'bg-gray-100 text-gray-500'}`}>
                                        <ChevronRight size={18} />
                                    </div>
                                    <h3 className="text-[15px] font-bold text-gray-800 uppercase tracking-wide m-0">{group.group_name}</h3>
                                    {!group.is_active && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 uppercase">
                                            Inactive
                                        </span>
                                    )}
                                    <span className="text-xs font-semibold text-accent bg-blue-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        VIEW PRODUCTS
                                    </span>
                                    <div className="text-xs text-gray-400 ml-auto mr-4 shadow-none">
                                        Group ID: {group.id} • Order: {group.position}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="text-gray-400 hover:text-accent p-1.5 rounded-md hover:bg-blue-50 transition-colors" onClick={() => handleOpenGroupModal(group)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors" onClick={() => handleDeleteGroup(group.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                    <button className="btn-sm px-4 py-1.5 text-sm font-semibold text-white bg-slate-500 hover:bg-slate-600 rounded-md ml-2 transition-colors flex items-center gap-1.5" onClick={() => handleOpenProductModal(group.id)}>
                                        <Plus size={14} /> Add Product
                                    </button>
                                </div>
                            </div>

                            {/* Products Area */}
                            {isExpanded && (
                                <div className="border-t border-gray-100 bg-gray-50/50 p-6 animate-fade-in">
                                    {groupProducts?.loading ? (
                                        <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-accent" /></div>
                                    ) : groupProducts?.error ? (
                                        <div className="text-red-500 text-sm text-center py-4">{groupProducts.error}</div>
                                    ) : groupProducts?.data?.length === 0 ? (
                                        <div className="text-gray-400 text-sm py-8 text-center bg-white rounded-lg border border-dashed border-gray-300">No products added to this group yet.</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {groupProducts.data.map(product => (
                                                <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-accent/40 transition-all group/product relative overflow-hidden flex items-start gap-4">

                                                    {/* Product Image */}
                                                    <div className="w-[60px] h-[60px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                                                        {product.product_photo ? (
                                                            <img src={product.product_photo} alt={product.product_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="text-gray-300" size={24} />
                                                        )}
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0 pr-16">
                                                        <h4 className="font-bold text-gray-800 text-sm truncate mb-1 pr-2" title={product.product_name}>{product.product_name}</h4>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className="text-xs font-bold text-emerald-600">₹{parseFloat(product.inr_value || 0).toFixed(2)}</span>
                                                            {product.usd_value && <span className="text-xs font-semibold text-purple-600">${parseFloat(product.usd_value || 0).toFixed(2)}</span>}
                                                        </div>
                                                        <span className="text-[10px] uppercase font-bold text-gray-400">Order: {product.position} • Max: {product.max_order || '∞'}</span>
                                                    </div>

                                                    {/* Product Actions */}
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-10 md:opacity-0 group-hover/product:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-gray-100">
                                                        <button className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded" title="View details" onClick={() => handleOpenProductModal(group.id, product)}>
                                                            <Eye size={14} />
                                                        </button>
                                                        <button className="p-1.5 text-gray-500 hover:text-accent hover:bg-blue-50 rounded" title="Edit" onClick={() => handleOpenProductModal(group.id, product)}>
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete" onClick={() => handleDeleteProduct(group.id, product.id)}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                {groups.length === 0 && !loading && (
                    <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-600 mb-2">No Groups Found</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Create your first group to start adding products and managing additional requirements.</p>
                        <button className="btn btn-primary shadow-sm" onClick={() => handleOpenGroupModal()}>
                            <Plus size={16} className="mr-2" /> Create First Group
                        </button>
                    </div>
                )}
            </div>

            {isGroupModalOpen && renderGroupModal()}
            {isProductModalOpen && renderProductModal()}
        </div>
    );
};

export default ARManager;
