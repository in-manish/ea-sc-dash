import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { whatsappService } from '../services/whatsappService';
import { Loader2, Plus, RefreshCw, MessageSquare, ArrowLeft, Eye, Check } from 'lucide-react';

const WhatsAppConfig = () => {
    const { token } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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

        // Preserve existing values, add new ones
        setFormData(prev => {
            const newVars = { ...prev.content_variables };
            uniqueMatches.forEach(v => {
                if (!newVars[v]) newVars[v] = '';
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

    const handleVariableChange = (variable, value) => {
        setFormData(prev => ({
            ...prev,
            content_variables: {
                ...prev.content_variables,
                [variable]: value
            }
        }));
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
                `<span class="font-medium text-blue-600">${value}</span>` :
                `<span class="bg-gray-100 text-gray-500 px-1 rounded text-xs">{{${key}}}</span>`;

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
                ...formData,
                content_variables: formData.content_variables
            };

            if (formData.provider === 'TWILIO') {
                const complexVars = {};
                Object.entries(formData.content_variables).forEach(([k, v]) => {
                    complexVars[k] = { type: 'text', value: v };
                });
                payload.content_variables = complexVars;
            }

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
                    vars[k] = v.value;
                } else {
                    vars[k] = v;
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
                if (typeof v === 'object' && v.value) {
                    vars[k] = v.value;
                } else {
                    vars[k] = v;
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
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <MessageSquare size={20} className="text-blue-600" />
                        {view === 'create' ? (editingId ? 'Edit Template' : 'Create New Template') : 'WhatsApp Configuration'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage templates and providers</p>
                </div>
                {view === 'list' && (
                    <button
                        onClick={() => { resetForm(); setView('create'); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Plus size={16} />
                        New Template
                    </button>
                )}
                {view !== 'list' && (
                    <div className="flex gap-2">
                        {view === 'preview' && (
                            <button
                                onClick={() => handleEditTemplate(previewTemplate)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                            >
                                <RefreshCw size={16} />
                                Edit Template
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setView('list');
                                setPreviewTemplate(null);
                                resetForm();
                            }}
                            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors border border-gray-200"
                        >
                            <ArrowLeft size={16} />
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
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map(t => (
                                <div key={t.id} onClick={() => handleViewTemplate(t)} className="cursor-pointer group relative bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all hover:border-blue-200 flex flex-col overflow-hidden">
                                    <div className="p-4 border-b border-gray-50 flex flex-col gap-3 bg-gray-50/50">
                                        <div className="flex justify-between items-start w-full">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 leading-tight text-base" title={t.template_name}>
                                                {t.template_name}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${t.provider === 'TWILIO' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {t.provider === 'TWILIO' ? 'Twilio' : 'MSG91'}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 uppercase">
                                                {t.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 bg-[#E5DDD5]/10">
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 relative text-sm text-gray-800 text-left">
                                            {/* Triangle for bubble effect */}
                                            <div className="absolute top-2 -left-1.5 w-3 h-3 bg-white transform rotate-45 border-l border-b border-gray-100"></div>

                                            <div className="line-clamp-4 relative z-10">
                                                {generatePreview(t.msg_text || '', t.content_variables || {})}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-4 py-2 text-[10px] text-gray-400 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                                        <span>{Object.keys(t.content_variables || {}).length} variables</span>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditTemplate(t); }}
                                                className="hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <span className="group-hover:text-blue-500 flex items-center gap-1 transition-colors">
                                                View <ArrowLeft size={10} className="rotate-180" />
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                                    <select
                                        name="provider"
                                        value={formData.provider}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="TWILIO">Twilio</option>
                                        <option value="MSG91">MSG91</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="attendee">Attendee</option>
                                        <option value="company">Company</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                                <input
                                    type="text"
                                    name="template_name"
                                    value={formData.template_name}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.template_name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                    placeholder="e.g. Welcome Message"
                                    required
                                />
                                {errors.template_name && <p className="text-xs text-red-500 mt-1">{errors.template_name[0]}</p>}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message Text</label>
                                <textarea
                                    name="msg_text"
                                    value={formData.msg_text}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono bg-gray-50"
                                    placeholder={`Hello {{1}}, welcome to {{2}}!`}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Use {`{{variable}}`} to define dynamic content.</p>
                            </div>

                            {/* ... (keep variable mapping) ... */}
                            {detectedVariables.length > 0 && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-3">Map Variables</h4>
                                    <div className="space-y-3">
                                        {detectedVariables.map(v => (
                                            <div key={v} className="flex items-center gap-3">
                                                <span className="w-16 text-right text-xs font-mono text-blue-600 bg-white px-2 py-1 rounded border border-blue-200">
                                                    {`{{${v}}}`}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={formData.content_variables[v] || ''}
                                                    onChange={(e) => handleVariableChange(v, e.target.value)}
                                                    placeholder="e.g. name, event.name"
                                                    className="flex-1 rounded-md border-gray-300 border px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {errors.content_variables && <p className="text-xs text-red-500 mt-2">{errors.content_variables[0]}</p>}
                                </div>
                            )}

                            {view === 'create' && (
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
                                    >
                                        {isLoading && <Loader2 className="animate-spin" size={18} />}
                                        {isLoading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Template' : 'Create Template')}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Preview Side */}
                    <div className="relative">
                        <div className="sticky top-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <Eye size={18} className="text-gray-500" />
                                Live Preview
                            </h3>
                            <div className="bg-[#E5DDD5] p-4 rounded-xl shadow-sm min-h-[400px] flex flex-col items-start border border-gray-200">
                                <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%] relative">
                                    {/* Triangle */}
                                    <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>

                                    <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {formData.msg_text ? generatePreview(formData.msg_text, formData.content_variables) : <span className="text-gray-400 italic">Message preview will appear here...</span>}
                                    </div>
                                    <div className="text-[10px] text-gray-400 text-right mt-1 select-none">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
