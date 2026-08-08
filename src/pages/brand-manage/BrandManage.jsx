import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { brandService } from '../../services/brandService';
import {
    RefreshCw, Plus, Edit2, X, Save, Loader2,
    CheckCircle2, XCircle, Tag, Globe, ExternalLink,
    Search, Filter, LayoutTemplate, Hash, Server,
} from 'lucide-react';

const DEFAULT_WELCOME_TITLE = 'Welcome to Exhibitor Portal';

const emptyForm = () => ({
    title: '',
    description: '',
    website: '',
    exhibitor_portal_host: '',
    welcome_title: DEFAULT_WELCOME_TITLE,
    brand_line: [],
});

const brandToForm = (brand) => ({
    title: brand.title || '',
    description: brand.description || '',
    website: brand.website || '',
    exhibitor_portal_host: brand.exhibitor_portal_host || '',
    welcome_title: brand.exhibitor_portal_landing?.welcome_title || DEFAULT_WELCOME_TITLE,
    brand_line: brand.exhibitor_portal_landing?.brand_line || [],
});

const BrandLineInput = ({ value, onChange }) => {
    const [input, setInput] = useState('');

    const addTag = (raw) => {
        const tag = raw.trim();
        if (!tag || value.includes(tag)) return;
        onChange([...value, tag]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
            setInput('');
        } else if (e.key === 'Backspace' && !input && value.length) {
            onChange(value.slice(0, -1));
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[42px] p-2 bg-bg-secondary border border-border rounded-xl">
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-lg border border-accent/20"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => onChange(value.filter((t) => t !== tag))}
                            className="hover:text-danger transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => { if (input.trim()) { addTag(input); setInput(''); } }}
                    placeholder={value.length ? 'Add brand…' : 'Type and press Enter'}
                    className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none"
                />
            </div>
            <p className="text-[10px] text-text-tertiary">Press Enter or comma to add. Shown on the public portal homepage.</p>
        </div>
    );
};

const FILTER_MODES = {
    all: { label: 'All brands', placeholder: 'Search by title, host, or website…' },
    portal_host: { label: 'Portal host', placeholder: 'exhibitors.wtemiami.com' },
    website: { label: 'Website', placeholder: 'wtemiami.com' },
};

const DetailRow = ({ label, value, mono = false, children }) => (
    <div className="py-3 border-b border-border last:border-0">
        <dt className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">{label}</dt>
        <dd className={`text-sm text-text-primary ${mono ? 'font-mono' : 'font-medium'}`}>
            {children ?? (value || <span className="text-text-tertiary italic">Not set</span>)}
        </dd>
    </div>
);

const BrandDetailPanel = ({ brand, onEdit, onClose }) => {
    if (!brand) return null;

    const landing = brand.exhibitor_portal_landing || {};
    const brandLine = landing.brand_line || [];

    return (
        <div className="bg-bg-primary border border-border rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-border bg-bg-secondary/30 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                        <Tag size={22} />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold text-text-primary truncate">{brand.title}</h2>
                        {brand.description && (
                            <p className="text-sm text-text-secondary mt-1 leading-relaxed">{brand.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => onEdit(brand)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/10 rounded-lg transition-all"
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all"
                        title="Close detail"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
                <div className="p-5">
                    <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Hash size={14} />
                        Brand details
                    </h3>
                    <dl>
                        <DetailRow label="ID" value={String(brand.id)} mono />
                        <DetailRow label="Title" value={brand.title} />
                        <DetailRow label="Description" value={brand.description} />
                        <DetailRow label="Website">
                            {brand.website ? (
                                <a
                                    href={`https://${brand.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-accent hover:underline"
                                >
                                    <Globe size={14} />
                                    {brand.website}
                                    <ExternalLink size={12} />
                                </a>
                            ) : null}
                        </DetailRow>
                        <DetailRow label="Exhibitor portal host" value={brand.exhibitor_portal_host} mono />
                    </dl>
                </div>

                <div className="p-5 space-y-4">
                    <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-2">
                        <LayoutTemplate size={14} />
                        Portal landing
                    </h3>
                    <DetailRow label="Welcome title" value={landing.welcome_title || DEFAULT_WELCOME_TITLE} />
                    <div>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-2">Brand line</p>
                        {brandLine.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {brandLine.map((name) => (
                                    <span
                                        key={name}
                                        className="px-3 py-1.5 bg-bg-secondary border border-border rounded-full text-xs font-semibold text-text-primary"
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-text-tertiary italic">No brands in line</p>
                        )}
                    </div>
                    <LandingPreview
                        welcomeTitle={landing.welcome_title}
                        brandLine={brandLine}
                    />
                </div>
            </div>
        </div>
    );
};

const LandingPreview = ({ welcomeTitle, brandLine }) => (
    <div className="p-5 bg-bg-secondary/50 border border-border rounded-xl space-y-3">
        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Portal preview</p>
        <h4 className="text-lg font-bold text-text-primary">{welcomeTitle || DEFAULT_WELCOME_TITLE}</h4>
        {brandLine.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
                {brandLine.map((name, i) => (
                    <React.Fragment key={name}>
                        {i > 0 && <span className="text-text-tertiary text-sm">|</span>}
                        <span className="text-sm font-medium text-text-secondary">{name}</span>
                    </React.Fragment>
                ))}
            </div>
        ) : (
            <p className="text-sm text-text-tertiary italic">No brand line configured</p>
        )}
    </div>
);

const BrandModal = ({ isOpen, onClose, brand, onSave, isSaving }) => {
    const [form, setForm] = useState(emptyForm());
    const isEdit = !!brand;

    useEffect(() => {
        if (isOpen) {
            setForm(brand ? brandToForm(brand) : emptyForm());
        }
    }, [brand, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            title: form.title.trim(),
            exhibitor_portal_host: form.exhibitor_portal_host.trim(),
            exhibitor_portal_landing: {
                welcome_title: form.welcome_title.trim() || DEFAULT_WELCOME_TITLE,
                brand_line: form.brand_line,
            },
        };
        if (form.description.trim()) payload.description = form.description.trim();
        if (form.website.trim()) payload.website = form.website.trim();
        onSave(payload, isEdit ? brand.id : null);
    };

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
            <div className="bg-bg-primary w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-border animate-slide-up">
                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary/30 sticky top-0 z-10">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">{isEdit ? 'Edit Brand' : 'Add Brand'}</h3>
                        <p className="text-xs text-text-tertiary mt-1">Brand metadata and exhibitor portal landing copy</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Title *</label>
                            <input
                                type="text"
                                required
                                placeholder="WTE Miami"
                                className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Description</label>
                            <textarea
                                placeholder="Optional long description"
                                className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent min-h-[80px] resize-none"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Website</label>
                            <input
                                type="text"
                                placeholder="wtemiami.com or https://…"
                                className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                                value={form.website}
                                onChange={(e) => setForm({ ...form, website: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Exhibitor Portal Host *</label>
                            <input
                                type="text"
                                required
                                placeholder="exhibitors.wtemiami.com"
                                className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                                value={form.exhibitor_portal_host}
                                onChange={(e) => setForm({ ...form, exhibitor_portal_host: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="border-t border-border pt-5 space-y-4">
                        <h4 className="text-sm font-bold text-text-primary">Exhibitor Portal Landing</h4>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Welcome Title</label>
                            <input
                                type="text"
                                placeholder={DEFAULT_WELCOME_TITLE}
                                className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                                value={form.welcome_title}
                                onChange={(e) => setForm({ ...form, welcome_title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Brand Line</label>
                            <BrandLineInput
                                value={form.brand_line}
                                onChange={(brand_line) => setForm({ ...form, brand_line })}
                            />
                        </div>
                        <LandingPreview welcomeTitle={form.welcome_title} brandLine={form.brand_line} />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-bg-tertiary text-text-primary rounded-xl font-bold text-sm hover:bg-border transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 py-3 bg-accent text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isEdit ? 'Update Brand' : 'Create Brand'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BrandManage = () => {
    const { token } = useAuth();
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [filterMode, setFilterMode] = useState('all');
    const [filterQuery, setFilterQuery] = useState('');
    const [detailBrand, setDetailBrand] = useState(null);
    const [isFetchingSingle, setIsFetchingSingle] = useState(false);
    const [filterError, setFilterError] = useState(null);

    const fetchBrands = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await brandService.listBrands(token);
            setBrands(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load brands.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchBrands();
    }, [token]);

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleSave = async (payload, brandId) => {
        setIsSaving(true);
        setError(null);
        try {
            const updated = brandId
                ? await brandService.updateBrand(token, brandId, payload)
                : await brandService.createBrand(token, payload);

            setBrands((prev) => {
                if (brandId) {
                    return prev.map((b) => (b.id === brandId ? updated : b));
                }
                return [...prev, updated];
            });
            if (brandId && detailBrand?.id === brandId) {
                setDetailBrand(updated);
            }
            showSuccess(brandId ? 'Brand updated successfully.' : 'Brand created successfully.');
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to save brand.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleApplyFilter = async () => {
        setFilterError(null);

        if (filterMode === 'all') {
            const query = filterQuery.trim().toLowerCase();
            if (!query) {
                setDetailBrand(null);
                return;
            }
            const match = brands.find((b) =>
                b.title?.toLowerCase().includes(query)
                || b.exhibitor_portal_host?.toLowerCase().includes(query)
                || b.website?.toLowerCase().includes(query)
            );
            if (match) {
                setDetailBrand(match);
            } else {
                setDetailBrand(null);
                setFilterError('No matching brand in the loaded list.');
            }
            return;
        }

        const query = filterQuery.trim();
        if (!query) {
            setFilterError(`Enter a ${FILTER_MODES[filterMode].label.toLowerCase()} to fetch.`);
            return;
        }

        setIsFetchingSingle(true);
        try {
            const filters = filterMode === 'portal_host'
                ? { exhibitor_portal_host: query }
                : { website: query };
            const brand = await brandService.getBrand(filters);
            setDetailBrand(brand);
            setBrands((prev) => {
                const exists = prev.some((b) => b.id === brand.id);
                return exists ? prev.map((b) => (b.id === brand.id ? brand : b)) : prev;
            });
        } catch (err) {
            console.error(err);
            setDetailBrand(null);
            setFilterError(err.status === 404 ? 'Brand not found.' : (err.message || 'Failed to fetch brand.'));
        } finally {
            setIsFetchingSingle(false);
        }
    };

    const handleFilterKeyDown = (e) => {
        if (e.key === 'Enter') handleApplyFilter();
    };

    const visibleBrands = filterMode === 'all' && filterQuery.trim()
        ? brands.filter((b) => {
            const q = filterQuery.trim().toLowerCase();
            return b.title?.toLowerCase().includes(q)
                || b.exhibitor_portal_host?.toLowerCase().includes(q)
                || b.website?.toLowerCase().includes(q);
        })
        : brands;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Brand Manage</h1>
                    <p className="text-text-secondary text-sm">Manage brands and exhibitor portal landing pages</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchBrands}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-bg-primary border border-border rounded-lg text-sm font-semibold hover:bg-bg-secondary transition-all disabled:opacity-50 shadow-sm"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => { setSelectedBrand(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-accent/20"
                    >
                        <Plus size={16} />
                        Add Brand
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-center gap-3 animate-fade-in">
                    <XCircle size={18} />
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError(null)} className="p-1 hover:bg-danger/20 rounded">
                        <X size={14} />
                    </button>
                </div>
            )}
            {successMessage && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 size={18} />
                    {successMessage}
                </div>
            )}

            <div className="bg-bg-primary border border-border rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Filter size={16} className="text-accent" />
                    Filter brand
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={filterMode}
                        onChange={(e) => {
                            setFilterMode(e.target.value);
                            setFilterQuery('');
                            setFilterError(null);
                            if (e.target.value !== 'all') setDetailBrand(null);
                        }}
                        className="sm:w-44 p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        {Object.entries(FILTER_MODES).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            onKeyDown={handleFilterKeyDown}
                            placeholder={FILTER_MODES[filterMode].placeholder}
                            className="w-full pl-10 pr-3 py-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <button
                        onClick={handleApplyFilter}
                        disabled={isFetchingSingle}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-md shadow-accent/20"
                    >
                        {isFetchingSingle ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        {filterMode === 'all' ? 'Find' : 'Fetch'}
                    </button>
                    {(filterQuery || detailBrand) && (
                        <button
                            onClick={() => {
                                setFilterQuery('');
                                setFilterError(null);
                                setDetailBrand(null);
                            }}
                            className="px-4 py-3 bg-bg-tertiary text-text-primary rounded-xl text-sm font-semibold hover:bg-border transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
                {filterMode !== 'all' && (
                    <p className="text-xs text-text-tertiary flex items-center gap-1.5">
                        <Server size={12} />
                        Fetches a single brand via GET /brands/?{filterMode === 'portal_host' ? 'exhibitor_portal_host' : 'website'}=
                    </p>
                )}
                {filterError && (
                    <p className="text-xs text-danger flex items-center gap-1.5">
                        <XCircle size={14} />
                        {filterError}
                    </p>
                )}
            </div>

            {detailBrand && (
                <BrandDetailPanel
                    brand={detailBrand}
                    onEdit={(brand) => { setSelectedBrand(brand); setIsModalOpen(true); }}
                    onClose={() => setDetailBrand(null)}
                />
            )}

            <div className="bg-bg-primary border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-secondary/50 border-b border-border">
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Brand</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Portal Host</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Website</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Landing</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-48" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-28" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-64" /></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-bg-tertiary rounded w-8 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : visibleBrands.length > 0 ? (
                                visibleBrands.map((brand) => {
                                    const landing = brand.exhibitor_portal_landing || {};
                                    const brandLine = landing.brand_line || [];
                                    const isSelected = detailBrand?.id === brand.id;
                                    return (
                                        <tr
                                            key={brand.id}
                                            onClick={() => setDetailBrand(brand)}
                                            className={`hover:bg-bg-secondary/30 transition-colors group cursor-pointer ${isSelected ? 'bg-accent/5 ring-1 ring-inset ring-accent/20' : ''}`}
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Tag size={16} className="text-accent shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-bold text-text-primary">{brand.title}</p>
                                                        {brand.description && (
                                                            <p className="text-xs text-text-tertiary line-clamp-1 max-w-xs">{brand.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-mono text-text-secondary bg-bg-secondary px-2 py-1 rounded border border-border">
                                                    {brand.exhibitor_portal_host}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {brand.website ? (
                                                    <a
                                                        href={`https://${brand.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                                                    >
                                                        <Globe size={14} />
                                                        {brand.website}
                                                        <ExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <span className="text-text-tertiary text-sm italic">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-medium text-text-primary line-clamp-1">
                                                    {landing.welcome_title || DEFAULT_WELCOME_TITLE}
                                                </p>
                                                {brandLine.length > 0 && (
                                                    <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">
                                                        {brandLine.join(' | ')}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedBrand(brand); setIsModalOpen(true); }}
                                                    className="p-2 text-text-tertiary hover:text-accent hover:bg-accent/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="Edit brand"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : brands.length > 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-text-tertiary">
                                            <Search size={40} strokeWidth={1} />
                                            <p className="text-sm font-medium">No brands match your search.</p>
                                            <button
                                                onClick={() => { setFilterQuery(''); setFilterError(null); }}
                                                className="text-accent font-bold text-sm hover:underline"
                                            >
                                                Clear search
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-text-tertiary">
                                            <Tag size={48} strokeWidth={1} />
                                            <p className="text-sm font-medium">No brands configured yet.</p>
                                            <button
                                                onClick={() => { setSelectedBrand(null); setIsModalOpen(true); }}
                                                className="mt-2 text-accent font-bold text-sm hover:underline"
                                            >
                                                Add your first brand
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BrandModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                brand={selectedBrand}
                onSave={handleSave}
                isSaving={isSaving}
            />
        </div>
    );
};

export default BrandManage;
