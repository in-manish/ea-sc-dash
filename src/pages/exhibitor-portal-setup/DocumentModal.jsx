import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle2, Loader2, Save } from 'lucide-react';

const DocumentModal = ({ isOpen, onClose, onSave, editingDocument }) => {
    const [formData, setFormData] = useState({
        doc_name: '',
        is_active: true,
        doc_thumbnail: null,
        doc_file: null
    });
    const [previews, setPreviews] = useState({
        thumbnail: null,
        file: null
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editingDocument) {
            setFormData({
                doc_name: editingDocument.doc_name || '',
                is_active: editingDocument.is_active ?? true,
                doc_thumbnail: null,
                doc_file: null
            });
            setPreviews({
                thumbnail: editingDocument.doc_thumbnail || null,
                file: editingDocument.doc_file || null
            });
        } else {
            setFormData({
                doc_name: '',
                is_active: true,
                doc_thumbnail: null,
                doc_file: null
            });
            setPreviews({
                thumbnail: null,
                file: null
            });
        }
    }, [editingDocument, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({ ...prev, [field]: file }));

        if (field === 'doc_thumbnail' && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, thumbnail: reader.result }));
            };
            reader.readAsDataURL(file);
        } else if (field === 'doc_file') {
            setPreviews(prev => ({ ...prev, file: file.name }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = new FormData();
            data.append('doc_name', formData.doc_name);
            data.append('is_active', formData.is_active);
            if (formData.doc_thumbnail) data.append('doc_thumbnail', formData.doc_thumbnail);
            if (formData.doc_file) data.append('doc_file', formData.doc_file);

            await onSave(data, editingDocument?.id);
            onClose();
        } catch (error) {
            console.error('Error saving document:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
            <div className="bg-bg-primary w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border animate-slide-up">
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary/30">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">
                            {editingDocument ? 'Edit Document' : 'Add New Document'}
                        </h3>
                        <p className="text-xs text-text-tertiary mt-1">
                            {editingDocument ? 'Update the details for this document' : 'Upload a new document for exhibitors'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Document Name</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                            placeholder="e.g., Exhibitor Manual, Welcome Letter"
                            value={formData.doc_name}
                            onChange={(e) => setFormData({ ...formData, doc_name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Thumbnail Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Thumbnail Image</label>
                            <label className="group relative aspect-video border-2 border-dashed border-border rounded-xl bg-bg-secondary hover:bg-bg-tertiary flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden">
                                <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'doc_thumbnail')}
                                />
                                {previews.thumbnail ? (
                                    <>
                                        <img src={previews.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload size={24} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} className="text-text-tertiary group-hover:text-accent transition-colors" />
                                        <span className="text-[10px] font-bold text-text-tertiary uppercase">Upload Image</span>
                                    </>
                                )}
                            </label>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Document File</label>
                            <label className="group relative aspect-video border-2 border-dashed border-border rounded-xl bg-bg-secondary hover:bg-bg-tertiary flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden">
                                <input
                                    type="file"
                                    className="sr-only"
                                    onChange={(e) => handleFileChange(e, 'doc_file')}
                                />
                                {previews.file ? (
                                    <div className="flex flex-col items-center gap-1 p-4 text-center">
                                        <FileText size={24} className="text-accent" />
                                        <span className="text-[10px] font-bold text-text-primary line-clamp-2">{previews.file.split('/').pop()}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={20} className="text-text-tertiary group-hover:text-accent transition-colors" />
                                        <span className="text-[10px] font-bold text-text-tertiary uppercase">Upload File</span>
                                    </>
                                )}
                                {previews.file && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload size={24} className="text-white" />
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-bg-secondary/50 rounded-xl border border-border">
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-text-primary">Active Status</h4>
                            <p className="text-[11px] text-text-tertiary">Visibility of this document to exhibitors</p>
                        </div>
                        <label className="relative inline-block w-12 h-6 cursor-pointer">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                            <span className="block absolute inset-0 rounded-full transition-all duration-300 bg-slate-300 peer-checked:bg-success"></span>
                            <span className="absolute left-[3px] bottom-[3px] bg-white w-[18px] h-[18px] rounded-full transition-all duration-300 peer-checked:translate-x-[24px]"></span>
                        </label>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary flex-1 py-3 rounded-xl font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {editingDocument ? 'Update Document' : 'Create Document'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentModal;
