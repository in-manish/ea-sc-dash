import React from 'react';
import { Edit2, Trash2, FileText, CheckCircle2, XCircle, Download, ExternalLink } from 'lucide-react';

const DocumentCard = ({ document, onEdit, onDelete }) => {
    return (
        <div className="bg-bg-primary border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group">
            {/* Thumbnail Area */}
            <div className="aspect-video bg-bg-secondary relative overflow-hidden flex items-center justify-center">
                {document.doc_thumbnail ? (
                    <img
                        src={document.doc_thumbnail}
                        alt={document.doc_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-text-tertiary">
                        <FileText size={40} className="opacity-20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Thumbnail</span>
                    </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md border ${document.is_active
                        ? 'bg-green-500/10 text-success border-success/20'
                        : 'bg-red-500/10 text-danger border-danger/20'
                    }`}>
                    {document.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {document.is_active ? 'Active' : 'Inactive'}
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => onEdit(document)}
                        className="p-2.5 bg-white text-text-primary rounded-xl hover:bg-accent hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
                        title="Edit Document"
                    >
                        <Edit2 size={18} />
                    </button>
                    {document.doc_file && (
                        <a
                            href={document.doc_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-white text-text-primary rounded-xl hover:bg-accent hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75"
                            title="Download File"
                        >
                            <Download size={18} />
                        </a>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-text-primary text-[15px] line-clamp-1 flex-1" title={document.doc_name}>
                        {document.doc_name}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-1">
                    <div className="text-[11px] text-text-tertiary flex flex-col">
                        <span>Added on: {new Date(document.created_at).toLocaleDateString()}</span>
                    </div>

                    <button
                        onClick={() => onDelete(document.id)}
                        className="p-1.5 text-text-tertiary hover:text-danger hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
