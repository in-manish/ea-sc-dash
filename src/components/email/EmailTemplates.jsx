import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { emailService } from '../../services/emailService';
import { Loader2, Mail, ArrowLeft, Eye, Smartphone, Tablet, Monitor, X, Edit3, Save, Plus, Trash2, List, Grid } from 'lucide-react';
import JoditEditor from 'jodit-react';

const deviceDimensions = {
    mobile: { width: '375px', icon: Smartphone, label: 'Mobile' },
    tablet: { width: '768px', icon: Tablet, label: 'Tablet' },
    laptop13: { width: '1280px', icon: Monitor, label: '13" Laptop' },
    laptop14: { width: '1440px', icon: Monitor, label: '14" Laptop' },
    laptop16: { width: '1600px', icon: Monitor, label: '16" Laptop' },
};

const EmailTemplates = ({ viewMode = 'list', onAddSignal = 0 }) => {
    const { token } = useAuth(); // Templates are not event specific based on the API

    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination (simple implementation for now)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal State
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [previewDevice, setPreviewDevice] = useState('laptop14');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const data = await emailService.getTemplates(token, page, 20); // pass size as 20
            setTemplates(data.results || []);
            setTotalPages(Math.ceil((data.count || 0) / 20));
        } catch (error) {
            console.error('Error fetching email templates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTemplates();
        }
    }, [token, page]);

    // Handle lifted create signal
    useEffect(() => {
        if (onAddSignal > 0) {
            handleCreateNew();
        }
    }, [onAddSignal]);

    const handleViewTemplate = (template) => {
        setPreviewTemplate(template);
        setEditFormData({
            ...template,
            email_content: template.email_content || ''
        });
        setIsEditing(false);
    };

    const handleCreateNew = () => {
        const newTemplate = {
            isNew: true,
            email_name: '',
            email_content: '<h1>New Email Template</h1><p>Edit your content here...</p>'
        };
        setPreviewTemplate(newTemplate);
        setEditFormData(newTemplate);
        setIsEditing(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        // Basic Validation
        if (!editFormData.email_name || !editFormData.email_content) {
            alert("Please fill in all required fields (Name, Content).");
            return;
        }

        setIsSaving(true);
        try {
            // Need to map the data correctly for API
            const payload = {
                email_name: editFormData.email_name,
                email_content: editFormData.email_content
            };

            if (previewTemplate.isNew) {
                await emailService.createTemplate(token, payload);
            } else {
                await emailService.updateTemplate(previewTemplate.id, token, payload);
            }
            await fetchTemplates();
            setPreviewTemplate(null);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving email template:', error);
            alert('Failed to save email template. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this email template?")) return;

        try {
            await emailService.deleteTemplate(id, token);
            await fetchTemplates();
        } catch (err) {
            console.error('Error deleting template', err);
            alert("Failed to delete template.");
        }
    }

    return (
        <div className="relative min-h-[400px]">

            {/* List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-8 text-gray-400">
                        <Loader2 className="animate-spin" size={24} />
                    </div>
                ) : templates.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Mail size={24} className="text-gray-400" />
                        </div>
                        <h4 className="text-base font-medium text-gray-900 mb-1">No templates found</h4>
                        <p className="text-sm text-gray-500 mb-4">Create your first reusable email template to get started.</p>
                        <button onClick={handleCreateNew} className="text-accent font-black text-xs uppercase tracking-widest hover:underline mt-2">
                            + Start New Template
                        </button>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {templates.map(template => (
                                    <div key={template.id} onClick={() => handleViewTemplate(template)} className="cursor-pointer group relative bg-bg-primary border border-border rounded-2xl hover:shadow-premium transition-all hover:border-accent/10 flex flex-col overflow-hidden">
                                        <div className="p-5 border-b border-border flex flex-col gap-3 bg-bg-secondary/40">
                                            <div className="flex justify-between items-start w-full">
                                                <h3 className="font-black text-text-primary group-hover:text-accent leading-tight text-base truncate pr-2 tracking-tight" title={template.email_name}>
                                                    {template.email_name || 'Unnamed Template'}
                                                </h3>
                                                <button
                                                    onClick={(e) => handleDelete(e, template.id)}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>ID: {template.id}</span>
                                                <span className="text-gray-400">{new Date(template.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 flex-1">
                                            <div className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                                                {template.email_content ? template.email_content.replace(/<[^>]+>/g, '') : 'No content'}
                                            </div>
                                        </div>

                                        <div className="px-4 py-2.5 text-xs font-medium text-gray-500 bg-gray-50 flex justify-end items-center border-t border-gray-100">
                                            <span className="group-hover:text-accent flex items-center gap-1.5 transition-colors font-black uppercase tracking-widest text-[9px]">
                                                View & Edit <ArrowLeft size={12} className="rotate-180" />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {templates.map(template => (
                                    <div key={template.id} onClick={() => handleViewTemplate(template)} className="bg-bg-primary border border-border rounded-2xl hover:shadow-premium transition-all hover:border-accent/10 flex flex-col sm:flex-row items-stretch overflow-hidden min-h-[5.5rem] cursor-pointer group relative">

                                        <div className="w-full sm:w-1/4 p-5 border-b sm:border-b-0 sm:border-r border-border flex flex-col shrink-0 justify-center bg-bg-secondary/30">
                                            <h3 className="font-black text-text-primary group-hover:text-accent leading-tight text-base truncate pr-2 tracking-tight" title={template.email_name}>
                                                {template.email_name || 'Unnamed Template'}
                                            </h3>
                                            <div className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.15em] mt-2 flex items-center gap-2">
                                                <span>REF: {template.id}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 px-4 py-3 sm:py-0 flex flex-col justify-center min-w-0">
                                            <div className="text-sm text-gray-800 font-medium mb-1">Content Preview</div>
                                            <div className="text-xs text-gray-500 line-clamp-2" title={template.email_content ? template.email_content.replace(/<[^>]+>/g, '') : 'No content'}>
                                                {template.email_content ? template.email_content.replace(/<[^>]+>/g, '') : 'No content'}
                                            </div>
                                        </div>

                                        <div className="sm:w-32 px-4 py-2 sm:py-0 border-t sm:border-t-0 sm:border-l border-gray-50 shrink-0 flex items-center justify-between sm:justify-center text-xs font-medium text-gray-500 bg-gray-50/30 sm:bg-transparent">
                                            <span className="sm:hidden text-[10px] uppercase font-bold text-gray-400">Created</span>
                                            {new Date(template.created_at).toLocaleDateString()}
                                        </div>

                                        <div className="px-5 py-3 sm:py-0 shrink-0 flex items-center justify-end gap-3 border-t sm:border-t-0 sm:border-l border-border bg-bg-secondary/40 sm:bg-transparent">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleViewTemplate(template); }}
                                                className="text-text-secondary hover:text-accent hover:bg-bg-primary px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-border hover:border-accent/30 bg-bg-primary shadow-sm"
                                            >
                                                <Edit3 size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, template.id)}
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                title="Delete Template"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Pagination controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-6">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded text-sm disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded text-sm disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal Preview / Editor */}
            {previewTemplate && (
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
                            {/* Left Sidebar: Details */}
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
                                            className="w-full text-sm font-medium text-gray-900 bg-white p-3 rounded-xl shadow-[0_0_0_2px_rgba(59,130,246,0.1)] border border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                                            placeholder="e.g. General Invite"
                                        />
                                    ) : (
                                        <div className="text-sm font-medium text-gray-800 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                            {previewTemplate?.email_name || '-'}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-200">
                                    <div className="text-xs text-gray-500 leading-relaxed font-medium">
                                        <span className="block text-gray-700 font-bold mb-1">Tip: Standalone Templates</span>
                                        These templates don't have predefined subjects or target categories. They are used for arbitrary mailings. Use <code>{`{{name}}`}</code> syntax for personalization.
                                    </div>
                                </div>
                            </div>

                            {/* Right Content: Visual Preview */}
                            <div className="flex-1 flex flex-col bg-[#f0f2f5] min-w-0">
                                {/* Device Toggle Toolbar */}
                                <div className="p-4 border-b border-gray-200 bg-white flex justify-center sticky top-0 z-10 shadow-sm">
                                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                                        {Object.entries(deviceDimensions).map(([key, config]) => {
                                            const Icon = config.icon;
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => setPreviewDevice(key)}
                                                    title={config.label}
                                                    className={`px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${previewDevice === key ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                                                >
                                                    <Icon size={18} />
                                                    <span className="hidden md:inline">{config.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Preview Pan Canvas */}
                                <div className="flex-1 overflow-auto bg-[#fafafa] p-4 sm:p-8 flex justify-center items-start border-l border-gray-200 shadow-inner">
                                    {previewTemplate?.email_content || isEditing ? (
                                        <div
                                            className="bg-white rounded-xl shadow-lg ring-1 ring-gray-900/5 flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0"
                                            style={{
                                                width: deviceDimensions[previewDevice].width,
                                                maxWidth: '100%',
                                                minHeight: '600px',
                                                margin: '0 auto',
                                            }}
                                        >
                                            {/* Gmail-style Header & Sender info (Hidden in Edit Mode) */}
                                            {!isEditing && (
                                                <>
                                                    <div className="bg-white px-6 py-5 border-b border-gray-100 flex gap-4 justify-between items-start lg:items-center flex-col lg:flex-row">
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-[1.35rem] font-medium text-gray-900">
                                                                (Dynamic Subject)
                                                            </div>
                                                            <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0">Template Info</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Actual Email HTML OR Editor */}
                                            <div className="flex-1 w-full bg-white relative border-t border-gray-100 min-h-[500px] flex flex-col">
                                                {isEditing ? (
                                                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                                                        <JoditEditor
                                                            value={editFormData.email_content || ''}
                                                            config={{
                                                                readonly: false,
                                                                height: '100%',
                                                                minHeight: 500,
                                                                toolbarAdaptive: false,
                                                                buttons: "source,|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,video,table,link,|,align,undo,redo,\n,hr,eraser,copyformat,|,symbol,print,about",
                                                                buttonsMD: "source,|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,video,table,link,|,align,undo,redo,\n,hr,eraser,copyformat,|,symbol,print,about",
                                                                buttonsSM: "source,|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,video,table,link,|,align,undo,redo,\n,hr,eraser,copyformat,|,symbol,print,about",
                                                                buttonsXS: "source,|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,video,table,link,|,align,undo,redo,\n,hr,eraser,copyformat,|,symbol,print,about",
                                                                style: {
                                                                    fontFamily: 'Inter, system-ui, sans-serif'
                                                                }
                                                            }}
                                                            onBlur={newContent => setEditFormData(prev => ({ ...prev, email_content: newContent }))}
                                                            onChange={() => { }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <iframe
                                                        title="Email Preview"
                                                        srcDoc={previewTemplate.email_content}
                                                        className="w-full border-none transition-all duration-300"
                                                        sandbox="allow-same-origin allow-popups"
                                                        style={{ minHeight: '500px' }}
                                                        onLoad={(e) => {
                                                            try {
                                                                const height = e.target.contentWindow.document.documentElement.scrollHeight;
                                                                e.target.style.height = `${Math.max(500, height)}px`;
                                                            } catch (err) {
                                                                console.warn('Could not auto-resize iframe:', err);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-12 text-gray-400 h-full w-full">
                                            <Mail size={48} className="mb-4 text-gray-300" />
                                            <span className="italic">No email content available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailTemplates;
