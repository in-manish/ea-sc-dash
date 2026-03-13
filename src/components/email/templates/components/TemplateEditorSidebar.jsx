import React from 'react';

const TemplateEditorSidebar = ({ isEditing, editFormData, handleEditChange, previewTemplate }) => {
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

            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="template_type"
                            value={editFormData.template_type || ''}
                            onChange={handleEditChange}
                            className="w-full text-xs font-medium text-gray-900 bg-white p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                            placeholder="e.g. custom"
                        />
                    ) : (
                        <div className="text-xs font-medium text-gray-800 bg-white p-2.5 rounded-lg border border-gray-100">
                            {previewTemplate?.template_type || '-'}
                        </div>
                    )}
                </div>
                <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                    <div className="flex items-center h-[38px]">
                        {isEditing ? (
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={editFormData.is_active || false}
                                    onChange={(e) => handleEditChange({ target: { name: 'is_active', value: e.target.checked } })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                <span className="ms-3 text-xs font-medium text-gray-700">{editFormData.is_active ? 'Active' : 'Inactive'}</span>
                            </label>
                        ) : (
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${previewTemplate?.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {previewTemplate?.is_active ? 'Active' : 'Inactive'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 text-left">
                <div className="text-xs text-gray-500 leading-relaxed font-medium text-left">
                    <span className="block text-gray-700 font-bold mb-1 text-left">Tip: Standalone Templates</span>
                    Use <code>{`{{name}}`}</code> syntax for personalization. Standard variables like <code>{`{{first_name}}`}</code> and <code>{`{{event_name}}`}</code> are supported.
                </div>
            </div>
        </div>
    );
};

export default TemplateEditorSidebar;
