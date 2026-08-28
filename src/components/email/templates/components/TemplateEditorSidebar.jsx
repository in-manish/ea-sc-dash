import React from 'react';
import TemplateVariablePlaceholders from './TemplateVariablePlaceholders';
import TemplateSupportingVariables from './TemplateSupportingVariables';
import TemplateTypeField from './TemplateTypeField';
import InviteeTypePlaceholderForm from './InviteeTypePlaceholderForm';
import useInviteeLinkPlaceholders from '../hooks/useInviteeLinkPlaceholders';
import {
    extractPlaceholderNames,
    mergeSupportingVariables,
    pickSupportingVariables,
} from '../domain/contentVariables';

const TemplateEditorSidebar = ({
    isEditing,
    editFormData,
    handleEditChange,
    previewTemplate,
    highlightName,
    pinnedName,
    onHover,
    onLeave,
    onToggle,
    onInsertPlaceholder,
    supportingVariables,
    typeLocked = false,
    eventId,
}) => {
    const html = isEditing ? editFormData.email_content : previewTemplate?.email_content;
    const subject = isEditing ? editFormData.subject : previewTemplate?.subject;
    const usedNames = extractPlaceholderNames(html, subject);
    const inviteeLinks = useInviteeLinkPlaceholders(eventId);
    const catalog = mergeSupportingVariables(
        pickSupportingVariables(
            previewTemplate?.supporting_variables,
            editFormData?.supporting_variables,
            supportingVariables,
        ),
        inviteeLinks.items,
    );

    const addInviteePlaceholder = (_item, title) => {
        const created = inviteeLinks.addFromTitle(title);
        if (created && isEditing) onInsertPlaceholder?.(created.name);
    };
    return (
        <div className="w-[300px] border-r border-gray-100 bg-gray-50/50 p-6 flex flex-col gap-5 overflow-y-auto hidden lg:flex">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Template Name <span className="text-red-500">*</span></label>
                {isEditing ? (
                    <input
                        type="text"
                        name="email_name"
                        value={editFormData.email_name || ''}
                        onChange={handleEditChange}
                        required
                        className="w-full text-sm font-medium text-gray-900 bg-white p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:font-normal placeholder:text-gray-400"
                        placeholder="e.g. General Invite"
                    />
                ) : (
                    <div className="text-sm font-medium text-gray-800 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        {previewTemplate?.email_name || '-'}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject <span className="text-red-500">*</span></label>
                {isEditing ? (
                    <input
                        type="text"
                        name="subject"
                        value={editFormData.subject || ''}
                        onChange={handleEditChange}
                        required
                        className="w-full text-sm font-medium text-gray-900 bg-white p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:font-normal placeholder:text-gray-400"
                        placeholder="e.g. You are Invited!"
                    />
                ) : (
                    <div className="text-sm font-medium text-gray-800 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        {previewTemplate?.subject || '-'}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                {isEditing ? (
                    <textarea
                        name="description"
                        value={editFormData.description || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full text-sm font-medium text-gray-900 bg-white p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:font-normal placeholder:text-gray-400 resize-none"
                        placeholder="What is this template for?"
                    />
                ) : (
                    <div className="text-sm font-medium text-gray-800 bg-white p-3 rounded-xl shadow-sm border border-gray-100 min-h-[60px]">
                        {previewTemplate?.description || '-'}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4">
                <div className="min-w-0">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Type
                    </label>
                    <TemplateTypeField
                        isEditing={isEditing}
                        value={isEditing ? editFormData.template_type : previewTemplate?.template_type}
                        locked={typeLocked}
                        onChange={(value) =>
                            handleEditChange({ target: { name: 'template_type', value } })
                        }
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Status
                    </label>
                    <div className="flex items-center min-h-[38px]">
                        {isEditing ? (
                            <label className="relative inline-flex items-center cursor-pointer gap-3">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={editFormData.is_active || false}
                                    onChange={(e) =>
                                        handleEditChange({
                                            target: {
                                                name: 'is_active',
                                                value: e.target.checked,
                                            },
                                        })
                                    }
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
                                <span className="text-xs font-medium text-gray-700 shrink-0">
                                    {editFormData.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </label>
                        ) : (
                            <span
                                className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                    previewTemplate?.is_active
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {previewTemplate?.is_active ? 'Active' : 'Inactive'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                {isEditing ? (
                    <InviteeTypePlaceholderForm onAdd={addInviteePlaceholder} />
                ) : null}
                <TemplateSupportingVariables
                    variables={catalog}
                    usedNames={usedNames}
                    isEditing={isEditing}
                    highlightName={highlightName}
                    onHover={onHover}
                    onLeave={onLeave}
                    onToggle={onToggle}
                    onInsert={onInsertPlaceholder}
                />
                <TemplateVariablePlaceholders
                    html={html}
                    subject={subject}
                    highlightName={highlightName}
                    pinnedName={pinnedName}
                    onHover={onHover}
                    onLeave={onLeave}
                    onToggle={onToggle}
                />
            </div>
        </div>
    );
};

export default TemplateEditorSidebar;
