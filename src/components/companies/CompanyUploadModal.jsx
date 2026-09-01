import React, { useState } from 'react';
import { eventService } from '../../services/eventService';
import {
    Loader2, X, Upload, AlertCircle, CheckCircle2, FileSpreadsheet,
    ShieldCheck, Download, AlertTriangle, XCircle,
} from 'lucide-react';

const PREVIEW_LIMIT = 8;

const CompanyUploadModal = ({ eventId, token, onClose, onUploaded }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [downloadingReport, setDownloadingReport] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validation, setValidation] = useState(null);
    const [validatedFileKey, setValidatedFileKey] = useState(null);

    const fileKey = file ? `${file.name}-${file.size}-${file.lastModified}` : null;
    const isValidForFile = validation && validatedFileKey === fileKey;
    const hasBlockingErrors = isValidForFile && validation.summary.rows_with_errors > 0;

    const handleFileChange = (e) => {
        setFile(e.target.files?.[0] || null);
        setValidation(null);
        setValidatedFileKey(null);
        setError(null);
        setSuccess(null);
    };

    const handleValidate = async () => {
        if (!file) return;
        setValidating(true);
        setError(null);
        try {
            const result = await eventService.validateCompaniesCsv(eventId, token, file);
            setValidation(result);
            setValidatedFileKey(fileKey);
        } catch (err) {
            setError(err.message || 'Failed to validate companies CSV.');
        } finally {
            setValidating(false);
        }
    };

    const handleDownloadReport = async () => {
        if (!file) return;
        setDownloadingReport(true);
        setError(null);
        try {
            await eventService.downloadCompanyUploadValidationReport(eventId, token, file);
        } catch (err) {
            setError(err.message || 'Failed to download validation report.');
        } finally {
            setDownloadingReport(false);
        }
    };

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
            setValidation(null);
            setValidatedFileKey(null);
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

    const summary = isValidForFile ? validation.summary : null;
    const rowIssues = isValidForFile ? validation.rows.filter((r) => r.status !== 'valid') : [];
    const headerIssues = summary?.header_issues;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1300] animate-fade-in" onClick={onClose}>
            <div
                className="bg-bg-primary rounded-lg border border-border shadow-xl w-[94%] max-w-[680px] max-h-[90vh] flex flex-col overflow-hidden"
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

                <div className="p-6 space-y-5 overflow-y-auto">
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
                            onChange={handleFileChange}
                            className="w-full p-2 text-sm border border-border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
                        />
                        {file && (
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs text-text-tertiary">
                                    Selected: <span className="font-medium text-text-secondary">{file.name}</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={handleValidate}
                                    disabled={validating}
                                    className="btn btn-secondary btn-sm gap-2"
                                >
                                    {validating ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                                    {validating ? 'Validating…' : 'Validate CSV'}
                                </button>
                            </div>
                        )}
                    </div>

                    {summary && (
                        <div className="p-5 bg-bg-primary rounded-lg border border-border space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                                    <ShieldCheck size={15} className="text-accent" /> Validation results
                                </p>
                                <button
                                    type="button"
                                    onClick={handleDownloadReport}
                                    disabled={downloadingReport}
                                    className="btn btn-secondary btn-sm gap-1.5"
                                >
                                    {downloadingReport ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                                    Download report
                                </button>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap text-xs">
                                <span className="inline-flex items-center py-0.5 px-2 rounded-full bg-bg-secondary text-text-secondary font-medium border border-border">
                                    Total {summary.total_rows}
                                </span>
                                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                                    <CheckCircle2 size={12} /> {summary.valid_rows} valid
                                </span>
                                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-amber-50 text-amber-700 font-medium">
                                    <AlertTriangle size={12} /> {summary.rows_with_warnings} warning{summary.rows_with_warnings === 1 ? '' : 's'}
                                </span>
                                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-red-50 text-red-700 font-medium">
                                    <XCircle size={12} /> {summary.rows_with_errors} error{summary.rows_with_errors === 1 ? '' : 's'}
                                </span>
                            </div>

                            {headerIssues && (headerIssues.unknown_headers.length > 0 || headerIssues.duplicate_headers.length > 0) && (
                                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 space-y-1">
                                    {headerIssues.unknown_headers.length > 0 && (
                                        <p>Unrecognized columns (ignored): {headerIssues.unknown_headers.join(', ')}</p>
                                    )}
                                    {headerIssues.duplicate_headers.length > 0 && (
                                        <p>Duplicate columns: {headerIssues.duplicate_headers.join(', ')}</p>
                                    )}
                                </div>
                            )}

                            {hasBlockingErrors && (
                                <div className="p-3 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-start gap-2 text-status-danger text-xs">
                                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                    <span>Fix the row errors below before uploading, or upload anyway and the affected rows will be rejected.</span>
                                </div>
                            )}

                            {rowIssues.length > 0 && (
                                <div className="space-y-2">
                                    {rowIssues.slice(0, PREVIEW_LIMIT).map((row) => (
                                        <div
                                            key={row.row_number}
                                            className={`bg-bg-secondary border rounded-lg px-3 py-2.5 ${row.status === 'error' ? 'border-red-100' : 'border-amber-100'}`}
                                        >
                                            <div className="flex items-center gap-2 flex-wrap text-sm text-text-primary">
                                                <span className="font-medium">Row {row.row_number}</span>
                                                {row.company && <span className="text-text-secondary">{row.company}</span>}
                                                {row.obf_number && (
                                                    <span className="text-[11px] font-mono bg-bg-tertiary text-text-secondary px-1.5 py-0.5 rounded">OBF {row.obf_number}</span>
                                                )}
                                            </div>
                                            {row.errors.map((issue, idx) => (
                                                <p key={`e-${idx}`} className="text-xs text-red-700 mt-1.5 flex items-start gap-1.5">
                                                    <XCircle size={12} className="mt-0.5 shrink-0" />
                                                    <span>
                                                        <span className="font-medium">{issue.column}:</span> {issue.message}
                                                        {issue.suggestion && ` (Suggested: ${issue.suggestion})`}
                                                    </span>
                                                </p>
                                            ))}
                                            {row.warnings.map((issue, idx) => (
                                                <p key={`w-${idx}`} className="text-xs text-amber-700 mt-1.5 flex items-start gap-1.5">
                                                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                                                    <span>
                                                        {issue.column && <span className="font-medium">{issue.column}: </span>}
                                                        {issue.message}
                                                        {issue.suggestion && ` (Suggested: ${issue.suggestion})`}
                                                    </span>
                                                </p>
                                            ))}
                                        </div>
                                    ))}
                                    {rowIssues.length > PREVIEW_LIMIT && (
                                        <p className="text-xs text-text-tertiary">
                                            Showing {PREVIEW_LIMIT} of {rowIssues.length} rows with issues. Download the report for the full list.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border flex justify-end gap-3 bg-bg-secondary">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={uploading}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading || !file || hasBlockingErrors}
                        title={hasBlockingErrors ? 'Resolve row errors before uploading' : undefined}
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
