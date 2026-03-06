import React from 'react';
import { Edit3, Eye, Loader2, Save, X } from 'lucide-react';
import TemplateEditorSidebar from './TemplateEditorSidebar';
import DeviceToggle from '../../shared/DeviceToggle';
import TemplatePreviewCanvas from './TemplatePreviewCanvas';

const EmailTemplateEditorModal = ({
    previewTemplate,
    setPreviewTemplate,
    isEditing,
    setIsEditing,
    editFormData,
    setEditFormData,
    handleEditChange,
    handleSave,
    isSaving,
    previewDevice,
    setPreviewDevice,
    deviceDimensions
}) => {
    if (!previewTemplate) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1600px] h-[95vh] max-h-[950px] flex flex-col overflow-hidden">

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {isEditing ? <Edit3 size={18} className="text-amber-600" /> : <Eye size={18} className="text-accent" />}
                        {isEditing ? (previewTemplate.isNew ? 'New Email Construction' : 'Modifying Core Template') : 'Template Overview'}
                    </h3>
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm border border-blue-200"
                            >
                                <Edit3 size={16} />
                                <span className="hidden sm:inline">Edit Template</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        if (previewTemplate.isNew) setPreviewTemplate(null);
                                        else {
                                            setIsEditing(false);
                                            setEditFormData({ ...previewTemplate });
                                        }
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    <span>{previewTemplate.isNew ? 'Deploy Template' : 'Synchronize Changes'}</span>
                                </button>
                            </>
                        )}
                        <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1"></div>
                        <button
                            onClick={() => setPreviewTemplate(null)}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                        >
                            <X size={20} />
                            <span className="hidden lg:inline">Close</span>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex flex-1 overflow-hidden">
                    <TemplateEditorSidebar
                        isEditing={isEditing}
                        editFormData={editFormData}
                        handleEditChange={handleEditChange}
                        previewTemplate={previewTemplate}
                    />

                    <div className="flex-1 flex flex-col bg-[#f0f2f5] min-w-0">
                        <DeviceToggle
                            previewDevice={previewDevice}
                            setPreviewDevice={setPreviewDevice}
                            deviceDimensions={deviceDimensions}
                        />

                        <TemplatePreviewCanvas
                            previewTemplate={previewTemplate}
                            isEditing={isEditing}
                            previewDevice={previewDevice}
                            deviceDimensions={deviceDimensions}
                            editFormData={editFormData}
                            setEditFormData={setEditFormData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplateEditorModal;
