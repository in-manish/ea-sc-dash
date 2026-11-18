import { Mail, UserRound, Users } from 'lucide-react';
import { MAX_CUSTOM_EMAILS } from '../domain/cardExportRequest';

const Option = ({ checked, onChange, icon, title, text, children }) => (
    <div className={`rounded-md border transition-colors ${checked ? 'border-accent bg-bg-secondary' : 'border-border'}`}>
        <label className="flex items-start gap-3 p-3 cursor-pointer">
            <input type="checkbox" className="mt-1" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span className="mt-0.5 shrink-0 text-text-tertiary">{icon}</span>
            <span className="text-sm">
                <span className="font-semibold text-text-primary block">{title}</span>
                <span className="text-text-secondary">{text}</span>
            </span>
        </label>
        {checked && children && <div className="px-3 pb-3 pl-[3.25rem]">{children}</div>}
    </div>
);

/**
 * "Who should get the email?" — three explicit choices (nothing hidden):
 * each selected attendee (only their own report), me, other people.
 * `report` = { one: 'meeting report', many: 'meeting reports' }; `attendeeHint` = e.g. "Test Visitor".
 */
export default function ReportRecipientPicker({ form, update, me, report, count, attendeeHint }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Who should get the email?</span>
            <Option
                checked={form.sendToAttendee}
                onChange={(value) => update({ sendToAttendee: value })}
                icon={<UserRound size={16} />}
                title={count === 1 ? `The attendee${attendeeHint ? ` (${attendeeHint})` : ''}` : `Each selected attendee (${count})`}
                text={`One email per attendee with only their own ${report.one}. Nobody sees anyone else's.`}
            />
            <Option
                checked={form.sendToMe}
                onChange={(value) => update({ sendToMe: value })}
                icon={<Mail size={16} />}
                title={`Me${me ? ` (${me})` : ''}`}
                text={count === 1 ? `You get the ${report.one}.` : `You get all ${count} ${report.many} in one email.`}
            />
            <Option
                checked={form.sendToOthers}
                onChange={(value) => update({ sendToOthers: value })}
                icon={<Users size={16} />}
                title="Other people"
                text={count === 1 ? `They get the ${report.one}.` : `They get all ${count} ${report.many}, like you.`}
            >
                <textarea
                    className="input-field min-h-[64px]"
                    placeholder="name@company.com, other@company.com"
                    value={form.emailsText}
                    onChange={(e) => update({ emailsText: e.target.value })}
                    autoFocus
                />
                <p className="text-xs text-text-tertiary mt-1">Separate addresses with commas. Up to {MAX_CUSTOM_EMAILS}.</p>
            </Option>
        </div>
    );
}
