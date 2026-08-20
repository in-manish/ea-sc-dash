import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import useWhatsAppTemplateList from '../hooks/useWhatsAppTemplateList';
import useWhatsAppTemplateEditor from '../hooks/useWhatsAppTemplateEditor';
import { TEMPLATE_SCOPE } from '../constants';
import TemplateList from './TemplateList';
import TemplateForm from './TemplateForm';
import TemplatePreview from './TemplatePreview';
import WhatsAppConfigHeader from './WhatsAppConfigHeader';

const viewCopy = (view, editor, isArchived) => {
    if (view === 'create') {
        return {
            title: editor.editingId ? 'Edit template' : 'New template',
            subtitle: editor.editingId
                ? 'Update copy, provider settings, and status'
                : 'Set status, provider details, and message content',
        };
    }
    if (view === 'preview') {
        return {
            title: editor.previewTemplate?.template_name || 'Template preview',
            subtitle: 'Review template content and status before editing',
        };
    }
    return {
        title: 'WhatsApp templates',
        subtitle: isArchived
            ? 'Archived templates are hidden from sending until restored'
            : 'Manage messaging templates, providers, and review status',
    };
};

const WhatsAppConfig = () => {
    const { token } = useAuth();
    const [view, setView] = useState('list');
    const list = useWhatsAppTemplateList(token, { enabled: view === 'list' });
    const editor = useWhatsAppTemplateEditor(token);
    const { title, subtitle } = viewCopy(view, editor, list.isArchived);

    const goToList = () => {
        editor.reset();
        setView('list');
    };

    const handleArchive = async (template) => {
        const ok = await list.archiveTemplate(template);
        if (ok) goToList();
    };

    const handleRestore = async (template) => {
        const ok = await list.restoreTemplate(template);
        if (ok) goToList();
    };

    const handleEdit = (template) => {
        editor.startEdit(template);
        setView('create');
    };

    const handleView = (template) => {
        editor.startPreview(template);
        setView('preview');
    };

    const handleCreate = () => {
        editor.reset();
        setView('create');
    };

    const handleSubmit = async (e) => {
        const ok = await editor.submit(e);
        if (!ok) return;
        list.setScope(TEMPLATE_SCOPE.ACTIVE);
        goToList();
    };

    return (
        <div className="p-6 sm:p-8 bg-bg-primary rounded-2xl shadow-sm border border-border">
            <WhatsAppConfigHeader
                title={title}
                subtitle={subtitle}
                view={view}
                previewTemplate={editor.previewTemplate}
                editingId={editor.editingId}
                isActive={editor.isActive}
                isBusy={list.busyId != null}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onBack={goToList}
                onArchive={handleArchive}
                onRestore={handleRestore}
            />

            {view === 'list' ? (
                <TemplateList
                    templates={list.templates}
                    isLoading={list.isLoading}
                    category={list.category}
                    statusFilter={list.statusFilter}
                    search={list.search}
                    scope={list.scope}
                    isArchived={list.isArchived}
                    busyId={list.busyId}
                    onCategoryChange={list.setCategory}
                    onStatusFilterChange={list.setStatusFilter}
                    onSearchChange={list.setSearch}
                    onScopeChange={list.setScope}
                    onView={handleView}
                    onEdit={handleEdit}
                    onCreate={handleCreate}
                    onArchive={handleArchive}
                    onRestore={handleRestore}
                />
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className={view === 'preview' ? 'hidden lg:block opacity-60 pointer-events-none' : ''}>
                        <h3 className="text-sm font-bold text-text-primary mb-4">Template details</h3>
                        <TemplateForm
                            formData={editor.formData}
                            errors={editor.errors}
                            isLoading={editor.isSaving}
                            isEditing={Boolean(editor.editingId)}
                            detectedVariables={editor.detectedVariables}
                            manualVariables={editor.manualVariables}
                            newVarName={editor.newVarName}
                            onNewVarNameChange={editor.setNewVarName}
                            onAddManualVariable={editor.handleAddManualVariable}
                            onRemoveManualVariable={editor.handleRemoveManualVariable}
                            onInputChange={editor.handleInputChange}
                            onVariableChange={editor.handleVariableChange}
                            onSubmit={handleSubmit}
                            readOnly={view === 'preview'}
                        />
                    </div>
                    <TemplatePreview
                        formData={editor.formData}
                        mode={view === 'preview' ? 'detail' : 'live'}
                        template={editor.previewTemplate}
                    />
                </div>
            )}

            {editor.isSaving && (
                <div className="sr-only" aria-live="polite">
                    <Loader2 className="animate-spin" />
                    Saving…
                </div>
            )}
        </div>
    );
};

export default WhatsAppConfig;
