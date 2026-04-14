import React from 'react';
import { Loader2, Mail, ArrowLeft, Trash2, Edit3 } from 'lucide-react';

const CategoryEmailList = ({ isLoading, emails, viewMode, handleViewEmail, handleDelete, handleCreateNew }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center p-8 text-gray-400">
                <Loader2 className="animate-spin" size={24} />
            </div>
        );
    }

    if (emails.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail size={24} className="text-gray-400" />
                </div>
                <h4 className="text-base font-medium text-gray-900 mb-1">No drafts found</h4>
                <p className="text-sm text-gray-500 mb-4">Create your first category email draft to get started.</p>
                <button onClick={handleCreateNew} className="text-accent font-black text-xs uppercase tracking-widest hover:underline mt-2">
                    + Initialize New Draft
                </button>
            </div>
        );
    }

    return viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-hidden">
            {emails.map(email => (
                <div key={email.id} onClick={() => handleViewEmail(email)} className="cursor-pointer group relative bg-bg-primary border border-border rounded-2xl hover:shadow-premium transition-all hover:border-accent/10 flex flex-col overflow-hidden text-left">
                    <div className="p-5 border-b border-border flex flex-col gap-3 bg-bg-secondary/40">
                        <div className="flex justify-between items-start w-full text-left">
                            <h3 className="font-black text-text-primary group-hover:text-accent leading-tight text-base truncate pr-2 tracking-tight text-left" title={email.email_name}>
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
                            <span className="px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase bg-accent text-white border border-accent shadow-sm">
                                {email.category_name || 'General Category'}
                            </span>
                            {email.id && <span className="text-[10px] font-mono text-text-tertiary opacity-40 bg-bg-secondary px-2 py-1 rounded-lg border border-border">#{email.id}</span>}
                        </div>
                    </div>

                    <div className="p-4 flex-1">
                        <div className="text-sm text-gray-800 text-left font-medium mb-1.5 line-clamp-1" title={email.subject}>
                            <span className="text-gray-400 font-normal mr-1">Subj:</span>
                            {email.subject || '(No Subject)'}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed text-left break-all overflow-hidden">
                            {email.email ? email.email.replace(/<[^>]+>/g, '') : 'No content'}
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
        <div className="flex flex-col gap-3 overflow-hidden">
            {emails.map(email => (
                <div key={email.id} onClick={() => handleViewEmail(email)} className="bg-bg-primary border border-border rounded-2xl hover:shadow-premium transition-all hover:border-accent/10 flex flex-col sm:flex-row items-stretch overflow-hidden min-h-[5.5rem] cursor-pointer group relative text-left">
                    <div className="w-full sm:w-1/4 p-5 border-b sm:border-b-0 sm:border-r border-border flex flex-col shrink-0 justify-center bg-bg-secondary/30">
                        <h3 className="font-black text-text-primary group-hover:text-accent leading-tight text-base truncate pr-2 tracking-tight text-left" title={email.email_name}>
                            {email.email_name || 'Unnamed Email'}
                        </h3>
                        <div className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.15em] mt-2 flex items-center gap-2">
                            DRAFT IDENTIFIER {email.id && <span className="text-accent/50 opacity-60">#{email.id}</span>}
                        </div>
                    </div>

                    <div className="sm:w-40 px-5 py-3 sm:py-0 shrink-0 flex items-center sm:justify-center border-b sm:border-b-0 sm:border-r border-border">
                        <div className="w-full flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                            <span className="text-[10px] sm:hidden text-text-tertiary uppercase font-black">Category</span>
                            <span className="px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase bg-bg-tertiary text-text-secondary border border-border truncate sm:w-full text-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all" title={email.category_name}>
                                {email.category_name || 'General'}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 px-4 py-3 sm:py-0 flex flex-col justify-center min-w-0 text-left">
                        <div className="text-sm text-gray-800 font-medium truncate text-left" title={email.subject}>
                            <span className="text-gray-400 font-normal mr-1">Subj:</span>
                            {email.subject || '(No Subject)'}
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-1 text-left overflow-hidden max-w-full">
                            {email.email ? email.email.replace(/<[^>]+>/g, '') : 'No content'}
                        </div>
                    </div>

                    <div className="px-5 py-3 sm:py-0 shrink-0 flex items-center justify-end gap-3 border-t sm:border-t-0 sm:border-l border-border bg-bg-secondary/40 sm:bg-transparent">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleViewEmail(email); }}
                            className="text-text-secondary hover:text-accent hover:bg-bg-primary px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-border hover:border-accent/30 bg-bg-primary shadow-sm"
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
    );
};

export default CategoryEmailList;
