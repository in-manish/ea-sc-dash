import { X, Download, Loader2, AlertTriangle, CheckCircle2, Mail, Users } from 'lucide-react';
import { EXPORT_FILE_TYPES, EXPORT_INLINE_LIMIT } from '../domain/exportFields';
import AttendeeExportFieldPicker from './AttendeeExportFieldPicker';

const plural = (n) => `${n} attendee${n === 1 ? '' : 's'}`;

const ScopeBanner = ({ count, isSelectedRows }) => (
    <div className="flex items-start gap-3 p-3 rounded-md bg-bg-secondary border border-border text-sm">
        <Users size={18} className="mt-0.5 shrink-0 text-text-secondary" />
        <div>
            <div className="font-semibold text-text-primary">
                {isSelectedRows ? `${plural(count)} selected` : `${plural(count)} matching the current list`}
            </div>
            <div className="text-text-secondary">
                {isSelectedRows
                    ? 'Only the ticked rows are exported.'
                    : 'Search and filters are applied. Tick rows first to export only those.'}
            </div>
            {count > EXPORT_INLINE_LIMIT && (
                <div className="text-text-secondary mt-1">
                    Exports over {EXPORT_INLINE_LIMIT} attendees are emailed to you instead of downloaded here.
                </div>
            )}
        </div>
    </div>
);

const FileTypePicker = ({ value, onChange }) => (
    <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2">File format</div>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="File format">
            {EXPORT_FILE_TYPES.map((t) => (
                <button
                    key={t.value}
                    type="button"
                    role="radio"
                    aria-checked={value === t.value}
                    onClick={() => onChange(t.value)}
                    className={`p-3 rounded-md border text-left transition-colors ${
                        value === t.value ? 'border-accent bg-bg-secondary' : 'border-border hover:border-text-tertiary'
                    }`}
                >
                    <div className="text-sm font-semibold text-text-primary">{t.label}</div>
                    <div className="text-xs text-text-secondary">{t.hint}</div>
                </button>
            ))}
        </div>
    </div>
);

const ExportResult = ({ result }) =>
    result.download_link ? (
        <div className="flex flex-col items-center text-center gap-3 py-4">
            <CheckCircle2 size={40} className="text-green-600" />
            <div>
                <div className="font-semibold text-text-primary">Your file is ready</div>
                <div className="text-sm text-text-secondary">{plural(result.count)} exported.</div>
            </div>
            <a
                href={result.download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2"
            >
                <Download size={16} />
                Download file
            </a>
        </div>
    ) : (
        <div className="flex flex-col items-center text-center gap-3 py-4">
            <Mail size={40} className="text-accent" />
            <div>
                <div className="font-semibold text-text-primary">Export on its way</div>
                <div className="text-sm text-text-secondary">
                    {result.message || 'The download link will be emailed to you.'}
                </div>
            </div>
        </div>
    );

const ExportForm = ({ exporter }) => (
    <div className="flex flex-col gap-5">
        <ScopeBanner count={exporter.count} isSelectedRows={exporter.isSelectedRows} />
        <FileTypePicker value={exporter.fileType} onChange={exporter.setFileType} />
        <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2">Fields to include</div>
            <AttendeeExportFieldPicker
                fields={exporter.fields}
                onToggle={exporter.toggleField}
                onSetFields={exporter.setFieldList}
            />
        </div>
    </div>
);

const ExportDialog = ({ exporter }) => {
    const { result, error, submitting, close, submit, fields } = exporter;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in" onClick={close}>
            <div
                className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-modal-smooth"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-text-primary">
                            <Download size={20} />
                            <h2 className="text-lg font-bold">Export attendees</h2>
                        </div>
                        {!result && <p className="text-sm text-text-secondary mt-1">Choose the file format and the columns you need.</p>}
                    </div>
                    <button type="button" onClick={close} aria-label="Close" className="text-text-tertiary hover:text-text-primary"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {result ? <ExportResult result={result} /> : <ExportForm exporter={exporter} />}
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 text-red-800 p-3 border border-red-200 rounded-md mt-4 text-sm">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                    {result ? (
                        <button type="button" className="btn btn-primary" onClick={close}>Done</button>
                    ) : (
                        <>
                            <button type="button" className="btn btn-secondary" onClick={close} disabled={submitting}>Cancel</button>
                            <button
                                type="button"
                                onClick={submit}
                                disabled={submitting || !fields.length}
                                className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                Export {fields.length ? `${fields.length} field${fields.length === 1 ? '' : 's'}` : ''}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const AttendeeExportModal = ({ exporter }) => (exporter.isOpen ? <ExportDialog exporter={exporter} /> : null);

export default AttendeeExportModal;
