import { CARD_FORMATS, MAX_CUSTOM_EMAILS } from '../domain/cardExportRequest';

const MODES = [
    { value: 'download', title: 'Download', text: 'Save the files on this computer. Nobody is emailed.' },
    { value: 'email', title: 'Email', text: 'Send the files by email in the background.' },
];

const Section = ({ title, children }) => (
    <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">{title}</span>
        {children}
    </div>
);

export const ModePicker = ({ form, update }) => (
    <div className="grid grid-cols-2 gap-2">
        {MODES.map((m) => (
            <label
                key={m.value}
                className={`flex items-start gap-2 p-3 rounded-md border cursor-pointer ${form.mode === m.value ? 'border-accent bg-bg-secondary' : 'border-border'}`}
            >
                <input type="radio" className="mt-1" checked={form.mode === m.value} onChange={() => update({ mode: m.value })} />
                <span className="text-sm">
                    <span className="font-semibold text-text-primary block">{m.title}</span>
                    <span className="text-text-secondary">{m.text}</span>
                </span>
            </label>
        ))}
    </div>
);

export const FormatPicker = ({ form, toggleFormat }) => (
    <Section title="File format (pick one or more)">
        <div className="flex flex-wrap gap-4">
            {CARD_FORMATS.map((f) => (
                <label key={f.value} className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                    <input type="checkbox" checked={form.formats.includes(f.value)} onChange={() => toggleFormat(f.value)} />
                    {f.label}
                </label>
            ))}
        </div>
    </Section>
);

export const DateRangePicker = ({ form, update, dateWindow }) => (
    <Section title="Cards exchanged between">
        <div className="flex flex-wrap items-center gap-2">
            <input
                type="date"
                className="input-field w-auto"
                value={form.start}
                min={dateWindow.min || undefined}
                max={form.end || dateWindow.max || undefined}
                onChange={(e) => update({ start: e.target.value })}
            />
            <span className="text-sm text-text-secondary">and</span>
            <input
                type="date"
                className="input-field w-auto"
                value={form.end}
                min={form.start || dateWindow.min || undefined}
                max={dateWindow.max || undefined}
                onChange={(e) => update({ end: e.target.value })}
            />
        </div>
        <p className="text-xs text-text-tertiary">
            {dateWindow.min && dateWindow.max
                ? `Event dates ${dateWindow.min} to ${dateWindow.max} (venue time, both days included). Leave a date empty to use the event date.`
                : 'This event has no dates set; leave empty for all cards.'}
        </p>
    </Section>
);

export const RecipientFields = ({ form, update }) => (
    <Section title="Send to">
        <label className="flex items-start gap-2 text-sm text-text-primary cursor-pointer">
            <input
                type="checkbox"
                className="mt-1"
                checked={form.sendToAttendee}
                onChange={(e) => update({ sendToAttendee: e.target.checked })}
            />
            <span>
                Each attendee
                <span className="block text-text-secondary">Every attendee gets only their own cards.</span>
            </span>
        </label>
        <textarea
            className="input-field min-h-[64px]"
            placeholder="Other emails, comma separated (e.g. sales@company.com)"
            value={form.emailsText}
            onChange={(e) => update({ emailsText: e.target.value })}
        />
        <p className="text-xs text-text-tertiary">
            These addresses get every selected attendee's cards (one file per attendee, zipped). Up to {MAX_CUSTOM_EMAILS}.
            {!form.sendToAttendee && ' Leave empty to send to your login email.'}
        </p>
    </Section>
);
