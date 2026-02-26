import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { emailService } from '../../services/emailService';
import { Loader2, Mail, ArrowLeft, Eye, Smartphone, Tablet, Monitor, X, Edit3, Save, Plus, Trash2, List, Grid } from 'lucide-react';
import { useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';

const deviceDimensions = {
    mobile: { width: '375px', icon: Smartphone, label: 'Mobile' },
    tablet: { width: '768px', icon: Tablet, label: 'Tablet' },
    laptop13: { width: '1280px', icon: Monitor, label: '13" Laptop' },
    laptop14: { width: '1440px', icon: Monitor, label: '14" Laptop' },
    laptop16: { width: '1600px', icon: Monitor, label: '16" Laptop' },
};

const EmailCategoryTypes = () => {
    const { token, selectedEvent } = useAuth();
    const { id } = useParams();
    const eventId = id || selectedEvent?.id;

    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list');

    // Modal State
    const [previewEmail, setPreviewEmail] = useState(null);
    const [previewDevice, setPreviewDevice] = useState('laptop14');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const fetchEmails = async () => {
        if (!eventId) return;
        setIsLoading(true);
        try {
            const data = await emailService.getCategoryEmails(eventId, token);
            setEmails(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Error fetching category emails:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && eventId) {
            fetchEmails();
        }
    }, [token, eventId]);

    const handleViewEmail = (email) => {
        setPreviewEmail(email);
        setEditFormData({
            ...email,
            email: email.email || ''
        });
        setIsEditing(false);
    };

    const handleCreateNew = () => {
        const newTemplate = {
            isNew: true,
            category_name: '',
            email_name: '',
            subject: '',
            email: '<h1>New Email Tempalte</h1><p>Edit your content here...</p>'
        };
        setPreviewEmail(newTemplate);
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
        if (!eventId) return;

        // Basic Validation
        if (!editFormData.category_name || !editFormData.email_name || !editFormData.subject || !editFormData.email) {
            alert("Please fill in all required fields (Category, Name, Subject, Content).");
            return;
        }

        setIsSaving(true);
        try {
            if (previewEmail.isNew) {
                await emailService.createCategoryEmail(eventId, token, editFormData);
            } else {
                await emailService.updateCategoryEmail(eventId, previewEmail.id, token, editFormData);
            }
            await fetchEmails();
            setPreviewEmail(null);
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
        if (!window.confirm("Are you sure you want to delete this category email?")) return;

        try {
            await emailService.deleteCategoryEmail(eventId, id, token);
            await fetchEmails();
        } catch (err) {
            console.error('Error deleting email', err);
            alert("Failed to delete email.");
        }
    }

    return (
        <div className="animate-fade-in relative min-h-[400px]">
            {/* Header / Actions */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Category Type Emails</h3>
                    <p className="text-sm text-gray-500">Target emails based on attendee categories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                            title="List View"
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                            title="Grid View"
                        >
                            <Grid size={16} />
                        </button>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={16} />
                        Create Draft
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-8 text-gray-400">
                        <Loader2 className="animate-spin" size={24} />
                    </div>
                ) : emails.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Mail size={24} className="text-gray-400" />
                        </div>
                        <h4 className="text-base font-medium text-gray-900 mb-1">No drafts found</h4>
                        <p className="text-sm text-gray-500 mb-4">Create your first category email draft to get started.</p>
                        <button onClick={handleCreateNew} className="text-blue-600 font-medium text-sm hover:underline">
                            + Create Draft
                        </button>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                                {emails.map(email => (
                                    <div key={email.id} onClick={() => handleViewEmail(email)} className="cursor-pointer group relative bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all hover:border-blue-300 flex flex-col overflow-hidden">
                                        <div className="p-4 border-b border-gray-50 flex flex-col gap-3">
                                            <div className="flex justify-between items-start w-full">
                                                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 leading-tight text-base truncate pr-2" title={email.email_name}>
                                                    {email.email_name || 'Unnamed Email'}
                                                </h3>
                                                <button
                                                    onClick={(e) => handleDelete(e, email.id)}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-600 border border-blue-100">
                                                    {email.category_name || 'Category'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 flex-1">
                                            <div className="text-sm text-gray-800 text-left font-medium mb-1.5 line-clamp-1" title={email.subject}>
                                                <span className="text-gray-400 font-normal mr-1">Subj:</span>
                                                {email.subject || '(No Subject)'}
                                            </div>
                                            <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {email.email ? email.email.replace(/<[^>]+>/g, '') : 'No content'}
                                            </div>
                                        </div>

                                        <div className="px-4 py-2.5 text-xs font-medium text-gray-500 bg-gray-50 flex justify-end items-center border-t border-gray-100">
                                            <span className="group-hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                                                View & Edit <ArrowLeft size={12} className="rotate-180" />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 animate-fade-in">
                                {emails.map(email => (
                                    <div key={email.id} onClick={() => handleViewEmail(email)} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all hover:border-blue-300 flex flex-col sm:flex-row items-stretch overflow-hidden min-h-[5rem] cursor-pointer group relative">

                                        <div className="w-full sm:w-1/4 p-4 border-b sm:border-b-0 sm:border-r border-gray-50 flex flex-col shrink-0 justify-center bg-gray-50/30">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 leading-tight text-base truncate pr-2" title={email.email_name}>
                                                {email.email_name || 'Unnamed Email'}
                                            </h3>
                                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1.5">Draft Internal Name</div>
                                        </div>

                                        <div className="sm:w-40 px-4 py-3 sm:py-0 shrink-0 flex items-center sm:justify-center border-b sm:border-b-0 sm:border-r border-gray-50">
                                            <div className="w-full flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                                                <span className="text-[10px] sm:hidden text-gray-400 uppercase font-bold">Category</span>
                                                <span className="px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-600 border border-blue-100 truncate sm:w-full text-center" title={email.category_name}>
                                                    {email.category_name || 'Category'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 px-4 py-3 sm:py-0 flex flex-col justify-center min-w-0">
                                            <div className="text-sm text-gray-800 font-medium truncate" title={email.subject}>
                                                <span className="text-gray-400 font-normal mr-1">Subj:</span>
                                                {email.subject || '(No Subject)'}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate mt-1">
                                                {email.email ? email.email.replace(/<[^>]+>/g, '') : 'No content'}
                                            </div>
                                        </div>

                                        <div className="px-4 py-3 sm:py-0 shrink-0 flex items-center justify-end gap-2 border-t sm:border-t-0 sm:border-l border-gray-50 bg-gray-50/50 sm:bg-transparent">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleViewEmail(email); }}
                                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium border border-gray-200 hover:border-blue-200 bg-white shadow-sm"
                                            >
                                                <Edit3 size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, email.id)}
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                title="Delete Draft"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal Preview / Editor */}
            {previewEmail && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1600px] h-[95vh] max-h-[950px] flex flex-col overflow-hidden">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                {isEditing ? <Edit3 size={18} className="text-amber-600" /> : <Eye size={18} className="text-blue-600" />}
                                {isEditing ? (previewEmail.isNew ? 'Create New Category Email' : 'Editing Category Email') : 'Preview Category Email'}
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
                                                if (previewEmail.isNew) setPreviewEmail(null);
                                                else {
                                                    setIsEditing(false);
                                                    setEditFormData({ ...previewEmail });
                                                }
                                            }}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium text-sm shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            <span className="hidden sm:inline">Save Changes</span>
                                        </button>
                                    </>
                                )}
                                <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1"></div>
                                <button
                                    onClick={() => setPreviewEmail(null)}
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
                                    {previewEmail?.email || isEditing ? (
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
                                                                {previewEmail?.subject || '(No Subject)'}
                                                            </div>
                                                            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0">Inbox</span>
                                                        </div>
                                                    </div>

                                                    <div className="px-6 py-5 flex justify-between items-start lg:items-center">
                                                        <div className="flex gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-lg flex-shrink-0 shadow-sm">
                                                                E
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-gray-900 flex flex-wrap items-center gap-1.5">
                                                                    Event Organizer <span className="text-xs font-normal text-gray-500">&lt;noreply@event.com&gt;</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-0.5">to me</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-medium mt-2 lg:mt-0 flex-shrink-0">
                                                            {new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Actual Email HTML OR Editor */}
                                            <div className="flex-1 w-full bg-white relative border-t border-gray-100 min-h-[500px] flex flex-col">
                                                {isEditing ? (
                                                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                                                        <JoditEditor
                                                            value={editFormData.email || ''}
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
                                                            onBlur={newContent => setEditFormData(prev => ({ ...prev, email: newContent }))}
                                                            onChange={() => { }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <iframe
                                                        title="Email Preview"
                                                        srcDoc={previewEmail.email}
                                                        className="w-full border-none transition-all duration-300"
                                                        sandbox="allow-same-origin allow-popups"
                                                        style={{ minHeight: '500px' }}
                                                        onLoad={(e) => {
                                                            try {
                                                                // Basic iframe height auto-resize
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

export default EmailCategoryTypes;
