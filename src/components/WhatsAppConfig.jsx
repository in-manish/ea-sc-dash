import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { whatsappService } from '../services/whatsappService';
import { Loader2, Plus, RefreshCw, MessageSquare, ArrowLeft, Eye, Check } from 'lucide-react';

const WhatsAppConfig = () => {
    const { token } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list', 'create', 'preview'
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    // Form State
    const [formData, setFormData] = useState({
        template_name: '',
        category: 'attendee',
        description: '',
        provider: 'TWILIO', // TWILIO or MSG91
        msg_text: '',
        service_sid: '',
        content_sid: '',
        msg91_template_name: '',
        content_variables: {}
    });

    const [detectedVariables, setDetectedVariables] = useState([]);

    useEffect(() => {
        if (view === 'list') {
            fetchTemplates();
        }
    }, [view]);

    // Detect variables in message text
    useEffect(() => {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [...formData.msg_text.matchAll(regex)].map(m => m[1]);
        const uniqueMatches = [...new Set(matches)];
        setDetectedVariables(uniqueMatches);

        // Preserve existing values, add new ones as objects
        setFormData(prev => {
            const newVars = { ...prev.content_variables };
            uniqueMatches.forEach(v => {
                if (!newVars[v]) newVars[v] = { type: 'text', value: '' };
                // Migrate any legacy flat string variables to objects
                if (typeof newVars[v] === 'string') {
                    newVars[v] = { type: 'text', value: newVars[v] };
                }
            });
            return { ...prev, content_variables: newVars };
        });
    }, [formData.msg_text]);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            // Token from context
            const data = await whatsappService.getTemplates(token, 'attendee');
            if (data.success) {
                setTemplates(data.templates);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTemplates();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleVariableChange = (variable, key, val) => {
        setFormData(prev => {
            const currentVar = prev.content_variables[variable] || { type: 'text', value: '' };
            const updatedVar = typeof currentVar === 'string' ? { type: 'text', value: currentVar } : { ...currentVar };
            updatedVar[key] = val;
            
            return {
                ...prev,
                content_variables: {
                    ...prev.content_variables,
                    [variable]: updatedVar
                }
            };
        });
    };

    const generatePreview = (text, variables) => {
        if (!text) return '';
        let preview = text;
        const vars = variables || {};

        // Extract raw variable names from text
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [...preview.matchAll(regex)].map(m => m[1]);
        const uniqueMatches = [...new Set(matches)];

        uniqueMatches.forEach(key => {
            let value = '';
            if (vars[key]) {
                if (typeof vars[key] === 'object' && vars[key] !== null && 'value' in vars[key]) {
                    value = vars[key].value;
                } else {
                    value = vars[key];
                }
            }

            const replacement = value ?
                `<span class="font-bold text-accent">${value}</span>` :
                `<span class="bg-bg-tertiary text-text-tertiary px-1 rounded text-[10px] font-bold uppercase tracking-tighter">{{${key}}}</span>`;

            preview = preview.split(`{{${key}}}`).join(replacement);
        });

        preview = preview.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

        return preview.split('\n').map((line, i) => (
            <div key={i} className="min-h-[1.2em]" dangerouslySetInnerHTML={{ __html: line }}></div>
        ));
    };

    const resetForm = () => {
        setEditingId(null);
        setErrors({});
        setFormData({
            template_name: '',
            category: 'attendee',
            description: '',
            provider: 'TWILIO',
            msg_text: '',
            service_sid: '',
            content_sid: '',
            msg91_template_name: '',
            content_variables: {}
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            // Token from context
            const payload = {
                ...formData
            };

            const complexVars = {};
            // The API expects '1': {'type': 'text', 'value': 'foo'} for both TWILIO and MSG91
            Object.entries(formData.content_variables).forEach(([k, v]) => {
                // Handle both legacy string values and new object structure
                const type = v && v.type ? v.type : 'text';
                const value = v && v.value !== undefined ? v.value : (typeof v === 'string' ? v : '');
                
                // Ensure we only pass mapped values to avoid empty submission errors
                if (value && value.trim() !== '') {
                    complexVars[k] = { type, value };
                }
            });
            payload.content_variables = complexVars;

            let response;
            if (editingId) {
                response = await whatsappService.updateTemplate(token, editingId, payload);
            } else {
                response = await whatsappService.createTemplate(token, payload);
            }

            if (response.success || response.id) {
                alert(`Template ${editingId ? 'updated' : 'created'} successfully!`);
                setView('list');
                resetForm();
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                } else {
                    alert(response.message || `Failed to ${editingId ? 'update' : 'create'} template`);
                }
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditTemplate = (template) => {
        setEditingId(template.id);
        setErrors({});

        let vars = {};
        if (template.content_variables) {
            Object.entries(template.content_variables).forEach(([k, v]) => {
                if (typeof v === 'object' && v !== null && 'value' in v) {
                    vars[k] = { type: v.type || 'text', value: v.value };
                } else {
                    vars[k] = { type: 'text', value: v };
                }
            });
        }

        setFormData({
            template_name: template.template_name || '',
            category: template.category || 'attendee',
            description: template.description || '',
            provider: template.provider || 'TWILIO',
            msg_text: template.msg_text || '',
            service_sid: template.service_sid || '',
            content_sid: template.content_sid || '',
            msg91_template_name: template.msg91_template_name || '',
            content_variables: vars
        });
        setView('create');
    };

    const handleViewTemplate = (template) => {
        setPreviewTemplate(template);
        let vars = {};
        if (template.content_variables) {
            Object.entries(template.content_variables).forEach(([k, v]) => {
                if (typeof v === 'object' && v !== null && 'value' in v) {
                    vars[k] = { type: v.type || 'text', value: v.value };
                } else {
                    vars[k] = { type: 'text', value: v };
                }
            });
        }

        setFormData(prev => ({
            ...prev,
            msg_text: template.msg_text,
            content_variables: vars
        }));
        setView('preview');
    };

    return (
        <div className="p-8 bg-bg-primary rounded-2xl shadow-premium border border-border">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3 tracking-tight">
                        <MessageSquare size={24} className="text-accent" />
                        {view === 'create' ? (editingId ? 'Edit Template' : 'Create New Template') : 'WhatsApp Configuration'}
                    </h2>
                    <p className="text-sm text-text-tertiary mt-1">Manage automated messaging templates and providers</p>
                </div>
                <div className="flex items-center gap-4">
                    {view === 'list' && (
                        <button
                            onClick={() => { resetForm(); setView('create'); }}
                            className="btn btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-accent/20 font-black uppercase tracking-widest text-[10px]"
                        >
                            <Plus size={18} />
                            New Template
                        </button>
                    )}
                </div>
                {view !== 'list' && (
                    <div className="flex gap-3">
                        {view === 'preview' && (
                            <button
                                onClick={() => handleEditTemplate(previewTemplate)}
                                className="btn btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-accent/20"
                            >
                                <RefreshCw size={18} />
                                Edit Template
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setView('list');
                                setPreviewTemplate(null);
                                resetForm();
                            }}
                            className="btn btn-secondary px-6 py-2.5 rounded-xl flex items-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Back to List
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            {view === 'list' ? (
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center p-8 text-gray-400">
                            <Loader2 className="animate-spin" size={24} />
                        </div>
                    ) : templates.length === 0 ? (
                        <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-gray-500">No templates found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map(t => (
                                <div key={t.id} onClick={() => handleViewTemplate(t)} className="cursor-pointer group relative bg-bg-primary rounded-[2.5rem] shadow-premium transition-all duration-500 hover:-translate-y-2 border border-border hover:border-accent/10 overflow-hidden flex flex-col">
                                    <div className="p-7 border-b border-border bg-bg-secondary/30">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border shadow-sm ${t.provider === 'TWILIO' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-accent text-white border-accent'}`}>
                                                {t.provider === 'TWILIO' ? 'Twilio' : 'MSG91'}
                                            </span>
                                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{t.category}</span>
                                        </div>
                                        <h3 className="font-black text-text-primary text-lg tracking-tight group-hover:text-accent transition-colors truncate">
                                            {t.template_name}
                                        </h3>
                                    </div>

                                    <div className="p-7 flex-1 relative bg-bg-tertiary/50 mesh-bg !bg-none min-h-[160px] flex items-center justify-center">
                                        <div className="bg-white p-5 rounded-2xl shadow-premium border border-border relative text-[13px] text-text-primary w-full max-w-[280px] animate-float">
                                            {/* Triangle for bubble effect */}
                                            <div className="absolute top-4 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>

                                            <div className="line-clamp-4 relative z-10 font-medium leading-relaxed">
                                                {t.msg_text ? generatePreview(t.msg_text, t.content_variables || {}) : <span className="opacity-40 italic">No message content...</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-7 py-4 bg-bg-secondary/40 flex justify-between items-center border-t border-border">
                                        <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{Object.keys(t.content_variables || {}).length} Fields</span>
                                        <div className="flex gap-6">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditTemplate(t); }}
                                                className="text-text-tertiary hover:text-accent text-[10px] font-black uppercase tracking-widest transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <span className="text-accent group-hover:scale-110 transition-transform font-black text-[10px] uppercase tracking-widest flex items-center gap-1 cursor-pointer">
                                                View <ArrowLeft size={14} className="rotate-180" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form Side */}
                    <div className={`${view === 'preview' ? 'hidden lg:block opacity-50 pointer-events-none' : ''}`}>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Template Details</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-text-tertiary mb-2 uppercase tracking-widest">Provider</label>
                                    <select
                                        name="provider"
                                        value={formData.provider}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border-border border-2 px-4 py-2.5 text-sm bg-bg-secondary focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold text-text-primary transition-all"
                                    >
                                        <option value="TWILIO">Twilio</option>
                                        <option value="MSG91">MSG91</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-text-tertiary mb-2 uppercase tracking-widest">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border-border border-2 px-4 py-2.5 text-sm bg-bg-secondary focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold text-text-primary transition-all"
                                    >
                                        <option value="attendee">Attendee</option>
                                        <option value="company">Company</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-text-tertiary mb-2 uppercase tracking-widest">Template Name</label>
                                <input
                                    type="text"
                                    name="template_name"
                                    value={formData.template_name}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none focus:ring-4 transition-all font-bold text-text-primary ${errors.template_name ? 'border-danger focus:ring-danger/10 focus:border-danger' : 'border-border bg-bg-secondary focus:ring-accent/10 focus:border-accent'}`}
                                    placeholder="e.g. Welcome Message"
                                    required
                                />
                                {errors.template_name && <p className="text-xs text-danger mt-1.5 font-bold">{errors.template_name[0]}</p>}
                            </div>

                            {/* ... (keep existing provider fields, add error display if needed) ... */}

                            {formData.provider === 'TWILIO' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Service SID</label>
                                        <input
                                            type="text"
                                            name="service_sid"
                                            value={formData.service_sid}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content SID</label>
                                        <input
                                            type="text"
                                            name="content_sid"
                                            value={formData.content_sid}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.provider === 'MSG91' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">MSG91 Template Slug</label>
                                    <input
                                        type="text"
                                        name="msg91_template_name"
                                        value={formData.msg91_template_name}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-bold text-text-tertiary mb-2 uppercase tracking-widest">Message Text</label>
                                <textarea
                                    name="msg_text"
                                    value={formData.msg_text}
                                    onChange={handleInputChange}
                                    rows={8}
                                    className="w-full rounded-xl border-border border-2 px-4 py-3 text-sm focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-mono bg-bg-tertiary/50 text-text-primary transition-all"
                                    placeholder={`Hello {{1}}, welcome to {{2}}!`}
                                    required
                                />
                                <p className="text-[11px] text-text-tertiary mt-2 font-bold uppercase tracking-wider">Use {`{{variable}}`} to define dynamic content.</p>
                            </div>

                            {/* ... (keep variable mapping) ... */}
                            {detectedVariables.length > 0 && (
                                <div className="bg-bg-secondary/50 p-6 rounded-2xl border-2 border-border">
                                    <h4 className="text-[11px] font-bold text-text-primary mb-4 uppercase tracking-[0.2em]">Map Variables</h4>
                                    <div className="space-y-4">
                                        {detectedVariables.map(v => {
                                            const currentVar = formData.content_variables[v] || { type: 'text', value: '' };
                                            const vartype = typeof currentVar === 'string' ? 'text' : (currentVar.type || 'text');
                                            const varval = typeof currentVar === 'string' ? currentVar : (currentVar.value || '');
                                            
                                            return (
                                                <div key={v} className="flex items-center gap-3">
                                                    <span className="w-16 flex-shrink-0 text-center text-[10px] font-bold text-accent bg-bg-primary px-2 py-1.5 rounded-lg border border-border shadow-sm">
                                                        {`{{${v}}}`}
                                                    </span>
                                                    {formData.provider === 'MSG91' && (
                                                        <select
                                                            value={vartype}
                                                            onChange={(e) => handleVariableChange(v, 'type', e.target.value)}
                                                            className="w-[110px] flex-shrink-0 rounded-xl border-border border-2 px-3 py-2 text-xs bg-bg-primary outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all font-bold text-text-primary"
                                                        >
                                                            <option value="text">text</option>
                                                            <option value="document">document</option>
                                                            <option value="image">image</option>
                                                            <option value="video">video</option>
                                                            <option value="currency">currency</option>
                                                            <option value="datetime">datetime</option>
                                                        </select>
                                                    )}
                                                    <input
                                                        type="text"
                                                        value={varval}
                                                        onChange={(e) => handleVariableChange(v, 'value', e.target.value)}
                                                        placeholder="e.g. name, badge_url"
                                                        className="flex-1 rounded-xl border-border border-2 px-4 py-2 text-sm bg-bg-primary outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all font-bold text-text-primary min-w-[150px]"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {errors.content_variables && <p className="text-xs text-danger mt-3 font-bold">{errors.content_variables[0]}</p>}
                                </div>
                            )}

                            {view === 'create' && (
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn btn-primary w-full py-4 text-base rounded-2xl shadow-xl shadow-accent/20 flex justify-center items-center gap-3 font-black uppercase tracking-widest"
                                    >
                                        {isLoading && <Loader2 className="animate-spin" size={20} />}
                                        {isLoading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Template' : 'Create Template')}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Preview Side */}
                    <div className="relative">
                        <div className="sticky top-6">
                            <h3 className="text-[11px] font-bold text-text-tertiary mb-6 flex items-center gap-2 uppercase tracking-[0.3em]">
                                <Eye size={18} className="text-accent" />
                                Interactive Preview
                            </h3>
                            <div className="p-10 rounded-[3rem] shadow-premium min-h-[550px] flex flex-col items-start border border-border/50 bg-bg-tertiary/30 mesh-bg relative overflow-hidden group/canvas">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none"></div>
                                <div className="absolute inset-x-0 bottom-0 bg-accent p-5 text-[10px] text-center font-black text-white uppercase tracking-[0.3em] w-full z-20 border-t border-white/10">Interactive Preview Shell</div>

                                <div className="bg-white p-8 rounded-[2rem] shadow-premium max-w-[90%] relative border border-border animate-float z-10">
                                    {/* Triangle */}
                                    <div className="absolute top-6 -left-2.5 w-0 h-0 border-t-[12px] border-t-white border-l-[12px] border-l-transparent"></div>

                                    <div className="text-[15px] text-text-primary whitespace-pre-wrap leading-relaxed font-medium">
                                        {formData.msg_text ? generatePreview(formData.msg_text, formData.content_variables) : <span className="text-text-tertiary italic font-bold opacity-40">System ready. Waiting for template input...</span>}
                                    </div>
                                    <div className="flex items-center justify-end gap-2 mt-5 text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-60">
                                        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <div className="w-1 h-1 rounded-full bg-text-tertiary"></div>
                                        <Check size={12} className="text-success" />
                                        <span>Delivered</span>
                                    </div>
                                </div>
                            </div>

                            {view === 'preview' && (
                                <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                                    This is a read-only preview of an existing template.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppConfig;
