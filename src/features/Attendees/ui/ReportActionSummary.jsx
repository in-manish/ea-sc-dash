import { Info, AlertTriangle } from 'lucide-react';

/**
 * "What will happen" box shown right above the action button: plain sentences of the exact result,
 * plus notes (e.g. where to track the emails). `problem` replaces the plan with what is still missing.
 */
export default function ReportActionSummary({ lines = [], notes = [], problem }) {
    if (problem) {
        return (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>{problem}</span>
            </div>
        );
    }
    if (!lines.length) return null;
    return (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <div className="flex items-center gap-2 font-semibold mb-1.5">
                <Info size={16} className="shrink-0" />
                What will happen
            </div>
            <ul className="list-disc pl-6 flex flex-col gap-1">
                {lines.map((line) => <li key={line}>{line}</li>)}
            </ul>
            {notes.map((note) => <p key={note} className="text-xs text-blue-800 mt-2">{note}</p>)}
        </div>
    );
}
