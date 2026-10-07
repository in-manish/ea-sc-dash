import {
    AlertCircle, CheckCircle2, FileSpreadsheet, Loader2, ShieldCheck, Upload,
} from 'lucide-react';
import MappingCsvResultPanel from './MappingCsvResultPanel';

export default function MappingCsvPanel({ csv }) {
    return (
        <section className="p-5 bg-bg-primary rounded-lg border border-border space-y-4">
            <div>
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <FileSpreadsheet size={18} className="text-accent" />
                    1. Upload mapping CSV
                </h3>
                <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
                    Validate with dry run first. Confirming replaces every existing mapping row
                    for each form in the file.
                </p>
            </div>

            {csv.error && (
                <div className="p-3 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-start gap-2 text-status-danger text-sm">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {csv.error}
                </div>
            )}
            {csv.success && (
                <div className="p-3 bg-status-success/5 border border-status-success/10 rounded-lg flex items-center gap-2 text-status-success text-sm">
                    <CheckCircle2 size={16} />
                    {csv.success}
                </div>
            )}

            <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => csv.handleFileChange(e.target.files?.[0])}
                className="w-full p-2 text-sm border border-border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
            />

            {csv.file && (
                <p className="text-xs text-text-tertiary">
                    Selected: <span className="font-medium text-text-secondary">{csv.file.name}</span>
                </p>
            )}

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={csv.validate}
                    disabled={!csv.file || csv.busy}
                    className="btn btn-secondary btn-sm gap-2"
                >
                    {csv.busy ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                    Dry-run validate
                </button>
                <button
                    type="button"
                    onClick={csv.confirmSave}
                    disabled={!csv.canConfirm || csv.busy}
                    className="btn btn-primary btn-sm gap-2"
                    title={csv.canConfirm ? 'Save mapping from this CSV' : 'Run dry-run validate first'}
                >
                    {csv.busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Confirm & save
                </button>
            </div>

            <MappingCsvResultPanel result={csv.result} />
        </section>
    );
}
