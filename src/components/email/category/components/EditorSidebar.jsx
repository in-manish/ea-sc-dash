import React from 'react';

const EditorSidebar = ({ isEditing, editFormData, handleEditChange, previewEmail }) => {
    return (
        <div className="w-[300px] border-r border-gray-100 bg-gray-50/50 p-6 flex flex-col gap-5 overflow-y-auto hidden lg:flex">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category Name <span className="text-red-500">*</span></label>
                {isEditing ? (
                    <input
                        type="text"
                        name="category_name"
                        value={editFormData.category_name || ''}
                        onChange={handleEditChange}
                        required
                        className="w-full text-sm font-medium text-gray-900 bg-white p-3 rounded-xl shadow-[0_0_0_2px_rgba(59,130,246,0.1)] border border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        placeholder="e.g. Visitor, Exhibitor"
                    />
                ) : (
                    <div className="text-sm font-medium text-gray-800 bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        {previewEmail?.category_name || '-'}
                    </div>
                )}
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Name <span className="text-red-500">*</span></label>
                {isEditing ? (
                    <input
                        type="text"
                        name="email_name"
                        value={editFormData.email_name || ''}
                        onChange={handleEditChange}
                        required
                        className="w-full text-sm font-medium text-gray-900 bg-white p-3 rounded-xl shadow-[0_0_0_2px_rgba(59,130,246,0.1)] border border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        placeholder="e.g. Welcome Email"
                    />
                ) : (
                    <div className="text-sm font-medium text-gray-800 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        {previewEmail?.email_name || '-'}
                    </div>
                )}
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject <span className="text-red-500">*</span></label>
                {isEditing ? (
                    <textarea
                        name="subject"
                        value={editFormData.subject || ''}
                        onChange={handleEditChange}
                        required
                        rows={3}
                        className="w-full resize-none text-sm font-medium text-gray-900 bg-white p-3 rounded-xl shadow-[0_0_0_2px_rgba(59,130,246,0.1)] border border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        placeholder="Enter email subject line..."
                    />
                ) : (
                    <div className="text-sm font-medium text-gray-800 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        {previewEmail?.subject || '-'}
                    </div>
                )}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="text-xs text-gray-500 leading-relaxed font-medium">
                    <span className="block text-gray-700 font-bold mb-1">Tip: Variable Injection</span>
                    Use <code>{`{{name}}`}</code> or other defined variables in your subject or email content to personalize it.
                </div>
            </div>
        </div>
    );
};

export default EditorSidebar;
