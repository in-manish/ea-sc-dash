import React, { useState } from 'react';
import { eventService } from '../../services/eventService';
import { Loader2, X, Upload, AlertCircle, CheckCircle2, FileSpreadsheet } from 'lucide-react';

const CompanyUploadModal = ({ eventId, token, onClose, onUploaded }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a CSV file to upload.');
            return;
        }
        setUploading(true);
        setError(null);
        setSuccess(null);
        try {
            const result = await eventService.uploadCompaniesCsv(eventId, token, file);
            setSuccess(result?.msg || 'File uploaded successfully. Check the upload status for progress.');
            setFile(null);
            setTimeout(() => {
                if (onUploaded) onUploaded();
                onClose();
            }, 1000);
        } catch (err) {
            setError(err.message || 'Failed to upload companies CSV.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1300] animate-fade-in" onClick={onClose}>
            <div
                className="bg-bg-primary rounded-lg border border-border shadow-xl w-[94%] max-w-[560px] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border flex items-start justify-between bg-bg-secondary">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1 flex items-center gap-2">
                            <FileSpreadsheet size={20} className="text-accent" />
                            Bulk Company Upload
                        </h2>
                        <p className="text-sm text-text-secondary">Create or update multiple companies via CSV.</p>
                    </div>
                    <button type="button" className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {error && (
                        <div className="p-4 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-start gap-3 text-status-danger text-sm">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="p-4 bg-status-success/5 border border-status-success/10 rounded-lg flex items-center gap-3 text-status-success text-sm">
                            <CheckCircle2 size={16} />
                            {success}
                        </div>
                    )}

                    <div className="p-5 bg-bg-secondary rounded-lg border border-border space-y-4">
                        <div className="flex items-start gap-3">
                            <FileSpreadsheet size={20} className="text-accent shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-text-primary">CSV file</p>
                                <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
                                    Upload a CSV to create new companies or update existing ones. Processing runs in the
                                    background — track progress under the <span className="font-medium">Upload Status</span> tab.
                                </p>
                            </div>
                        </div>

                        <label className="text-sm font-semibold text-text-primary block">Select CSV file</label>
                        <input
                            type="file"
                            accept=".csv,text/csv"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full p-2 text-sm border border-border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
                        />
                        {file && (
                            <p className="text-xs text-text-tertiary">
                                Selected: <span className="font-medium text-text-secondary">{file.name}</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-border flex justify-end gap-3 bg-bg-secondary">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={uploading}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className="btn btn-primary gap-2"
                    >
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {uploading ? 'Uploading…' : 'Upload CSV'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyUploadModal;
