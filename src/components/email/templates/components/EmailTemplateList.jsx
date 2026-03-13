import React from 'react';
import { Loader2, Mail, ArrowLeft, Trash2, Edit3 } from 'lucide-react';

const EmailTemplateList = ({ isLoading, templates, viewMode, handleViewTemplate, handleDelete, handleCreateNew, page, totalPages, setPage }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center p-8 text-gray-400">
                <Loader2 className="animate-spin" size={24} />
            </div>
        );
    }

    if (templates.length === 0) {
        return (
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
        );
    }

    return (
        <>
            {viewMode === 'grid' ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map(template => (
                        <div key={template.id} onClick={() => handleViewTemplate(template)} className="cursor-pointer group relative bg-bg-primary border border-border rounded-2xl hover:shadow-premium transition-all hover:border-accent/10 flex flex-col overflow-hidden text-left">
                            <div className="p-5 border-b border-border flex flex-col gap-3 bg-bg-secondary/40 text-left">
                                <div className="flex justify-between items-start w-full text-left">
                                    <h3 className="font-black text-text-primary group-hover:text-accent leading-tight text-base truncate pr-2 tracking-tight text-left" title={template.email_name}>
                                        {template.email_name || 'Unnamed Template'}
                                    </h3>
                                    <button
                                        onClick={(e) => handleDelete(e, template.id)}
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {template.subject && (
                                    <div className="text-[10px] font-bold text-accent uppercase tracking-wider -mt-1 truncate" title={template.subject}>
                                        {template.subject}
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>ID: {template.id}</span>
                                    <span className="text-gray-400">{new Date(template.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="p-4 flex-1 text-left">
                                <div className="text-xs text-gray-500 line-clamp-3 leading-relaxed text-left">
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
                        <div key={template.id} onClick={() => handleViewTemplate(template)} className="bg-bg-primary border border-border rounded-2xl hover:shadow-premium transition-all hover:border-accent/10 flex flex-col sm:flex-row items-stretch overflow-hidden min-h-[5.5rem] cursor-pointer group relative text-left">
                            <div className="w-full sm:w-1/4 p-5 border-b sm:border-b-0 sm:border-r border-border flex flex-col shrink-0 justify-center bg-bg-secondary/30 text-left">
                                <h3 className="font-black text-text-primary group-hover:text-accent leading-tight text-base truncate pr-2 tracking-tight text-left" title={template.email_name}>
                                    {template.email_name || 'Unnamed Template'}
                                </h3>
                                {template.subject && (
                                    <div className="text-[10px] font-black text-accent uppercase tracking-[0.1em] mt-1 truncate" title={template.subject}>
                                        {template.subject}
                                    </div>
                                )}
                                <div className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.15em] mt-1.5 flex items-center gap-2">
                                    <span>REF: {template.id}</span>
                                </div>
                            </div>

                            <div className="flex-1 px-4 py-3 sm:py-0 flex flex-col justify-center min-w-0 text-left">
                                <div className="text-sm text-gray-800 font-medium mb-1 text-left">Content Preview</div>
                                <div className="text-xs text-gray-500 line-clamp-2 text-left" title={template.email_content ? template.email_content.replace(/<[^>]+>/g, '') : 'No content'}>
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
    );
};

export default EmailTemplateList;
