import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { whatsappService } from '../../../services/whatsappService';
import { Loader2, Plus, ArrowLeft, Pencil, MessageSquare } from 'lucide-react';
import {
    DEFAULT_FORM_DATA,
    STATUS_FILTER_ALL,
    TEMPLATE_STATUS,
} from '../constants';
import {
    buildContentVariablesPayload,
    detectVariablesInText,
    normalizeContentVariables,
} from '../domain/templateHelpers';
import TemplateList from './TemplateList';
import TemplateForm from './TemplateForm';
import TemplatePreview from './TemplatePreview';

const WhatsAppConfig = () => {
    const { token } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('list'); // list | create | preview
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [category, setCategory] = useState('attendee');
    const [statusFilter, setStatusFilter] = useState(STATUS_FILTER_ALL);
    const [search, setSearch] = useState('');

    const [formData, setFormData] = useState({ ...DEFAULT_FORM_DATA });
    const [detectedVariables, setDetectedVariables] = useState([]);
    const [manualVariables, setManualVariables] = useState([]);
    const [newVarName, setNewVarName] = useState('');

    const fetchTemplates = useCallback(async (cat = category) => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await whatsappService.getTemplates(token, cat);
            if (data.success) {
                setTemplates(data.templates || []);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token, category]);

    useEffect(() => {
        if (token && view === 'list') {
            fetchTemplates(category);
        }
    }, [token, view, category, fetchTemplates]);

    useEffect(() => {
        const uniqueMatches = detectVariablesInText(formData.msg_text);
        setDetectedVariables(uniqueMatches);

        setFormData((prev) => {
            const newVars = { ...prev.content_variables };
            [...uniqueMatches, ...manualVariables].forEach((v) => {
                if (!newVars[v]) newVars[v] = { type: 'text', value: '' };
                if (typeof newVars[v] === 'string') {
                    newVars[v] = { type: 'text', value: newVars[v] };
                }
            });
            return { ...prev, content_variables: newVars };
        });
    }, [formData.msg_text, manualVariables]);

    const resetForm = () => {
        setEditingId(null);
        setErrors({});
        setManualVariables([]);
        setNewVarName('');
        setFormData({ ...DEFAULT_FORM_DATA });
    };

    const goToList = () => {
        setView('list');
        setPreviewTemplate(null);
        resetForm();
    };

    const handleAddManualVariable = () => {
        const name = newVarName.trim();
        if (!name || detectedVariables.includes(name) || manualVariables.includes(name)) return;
        setManualVariables((prev) => [...prev, name]);
        setNewVarName('');
    };

    const handleRemoveManualVariable = (varName) => {
        setManualVariables((prev) => prev.filter((v) => v !== varName));
        setFormData((prev) => {
            const newVars = { ...prev.content_variables };
            delete newVars[varName];
            return { ...prev, content_variables: newVars };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleVariableChange = (variable, key, val) => {
        setFormData((prev) => {
            const currentVar = prev.content_variables[variable] || { type: 'text', value: '' };
            const updatedVar = typeof currentVar === 'string'
                ? { type: 'text', value: currentVar }
                : { ...currentVar };
            updatedVar[key] = val;

            return {
                ...prev,
                content_variables: {
                    ...prev.content_variables,
                    [variable]: updatedVar,
                },
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const payload = {
                ...formData,
                status: formData.status || TEMPLATE_STATUS.PENDING,
                content_variables: buildContentVariablesPayload(formData.content_variables),
            };

            let response;
            if (editingId) {
                response = await whatsappService.updateTemplate(token, editingId, payload);
            } else {
                response = await whatsappService.createTemplate(token, payload);
            }

            if (response.success || response.id) {
                alert(`Template ${editingId ? 'updated' : 'created'} successfully!`);
                goToList();
            } else if (response.errors) {
                setErrors(response.errors);
            } else {
                alert(response.message || `Failed to ${editingId ? 'update' : 'create'} template`);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const populateFormFromTemplate = (template) => {
        const vars = normalizeContentVariables(template.content_variables);
        const detected = detectVariablesInText(template.msg_text || '');
        const manualVarsFound = Object.keys(vars).filter((k) => !detected.includes(k));

        setManualVariables(manualVarsFound);
        setFormData({
            template_name: template.template_name || '',
            category: template.category || 'attendee',
            description: template.description || '',
            status: (template.status || TEMPLATE_STATUS.PENDING).toLowerCase(),
            provider: template.provider || 'TWILIO',
            msg_text: template.msg_text || '',
            service_sid: template.service_sid || '',
            content_sid: template.content_sid || '',
            msg91_template_name: template.msg91_template_name || '',
            content_variables: vars,
        });
    };

    const handleEditTemplate = (template) => {
        setEditingId(template.id);
        setErrors({});
        setManualVariables([]);
        populateFormFromTemplate(template);
        setView('create');
    };

    const handleViewTemplate = (template) => {
        setPreviewTemplate(template);
        populateFormFromTemplate(template);
        setView('preview');
    };

    const handleCreate = () => {
        resetForm();
        setView('create');
    };

    const title =
        view === 'create'
            ? (editingId ? 'Edit template' : 'New template')
            : view === 'preview'
                ? (previewTemplate?.template_name || 'Template preview')
                : 'WhatsApp templates';

    const subtitle =
        view === 'list'
            ? 'Manage messaging templates, providers, and review status'
            : view === 'preview'
                ? 'Review template content and status before editing'
                : editingId
                    ? 'Update copy, provider settings, and status'
                    : 'Set status, provider details, and message content';

    return (
        <div className="p-6 sm:p-8 bg-bg-primary rounded-2xl shadow-sm border border-border">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
                <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2.5 tracking-tight">
                        <MessageSquare size={22} className="text-accent shrink-0" />
                        <span className="truncate">{title}</span>
                    </h2>
                    <p className="text-sm text-text-tertiary mt-1">{subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                    {view === 'list' && (
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="btn btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-accent/15 font-bold uppercase tracking-wider text-[10px]"
                        >
                            <Plus size={16} />
                            New template
                        </button>
                    )}
                    {view === 'preview' && previewTemplate && (
                        <button
                            type="button"
                            onClick={() => handleEditTemplate(previewTemplate)}
                            className="btn btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-accent/15 font-bold uppercase tracking-wider text-[10px]"
                        >
                            <Pencil size={16} />
                            Edit template
                        </button>
                    )}
                    {view !== 'list' && (
                        <button
                            type="button"
                            onClick={goToList}
                            className="btn btn-secondary px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    )}
                </div>
            </div>

            {view === 'list' ? (
                <TemplateList
                    templates={templates}
                    isLoading={isLoading}
                    category={category}
                    statusFilter={statusFilter}
                    search={search}
                    onCategoryChange={setCategory}
                    onStatusFilterChange={setStatusFilter}
                    onSearchChange={setSearch}
                    onView={handleViewTemplate}
                    onEdit={handleEditTemplate}
                    onCreate={handleCreate}
                />
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className={view === 'preview' ? 'hidden lg:block opacity-60 pointer-events-none' : ''}>
                        <h3 className="text-sm font-bold text-text-primary mb-4">Template details</h3>
                        <TemplateForm
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            isEditing={Boolean(editingId)}
                            detectedVariables={detectedVariables}
                            manualVariables={manualVariables}
                            newVarName={newVarName}
                            onNewVarNameChange={setNewVarName}
                            onAddManualVariable={handleAddManualVariable}
                            onRemoveManualVariable={handleRemoveManualVariable}
                            onInputChange={handleInputChange}
                            onVariableChange={handleVariableChange}
                            onSubmit={handleSubmit}
                            readOnly={view === 'preview'}
                        />
                    </div>
                    <TemplatePreview
                        formData={formData}
                        mode={view === 'preview' ? 'detail' : 'live'}
                        template={previewTemplate}
                    />
                </div>
            )}

            {isLoading && view !== 'list' && (
                <div className="sr-only" aria-live="polite">
                    <Loader2 className="animate-spin" />
                    Saving…
                </div>
            )}
        </div>
    );
};

export default WhatsAppConfig;
