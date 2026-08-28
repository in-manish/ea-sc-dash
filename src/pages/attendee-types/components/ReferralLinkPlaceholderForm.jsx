import { useState } from 'react';
import { Plus } from 'lucide-react';
import { buildReferralLinkPlaceholder } from '../domain/badgeEmailReferralLinks';

export default function ReferralLinkPlaceholderForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const preview = buildReferralLinkPlaceholder(title);

    const submit = (e) => {
        e.preventDefault();
        if (!preview) return;
        onAdd?.(preview, title);
        setTitle('');
    };

    return (
        <form onSubmit={submit} className="mb-4">
            <span className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">
                Invitee type referral
            </span>
            <p className="text-[11px] text-text-tertiary leading-relaxed m-0 mb-2">
                Title becomes <span className="font-mono">{'{title_slug}_referral_link'}</span> (bare token, same as EA).
            </p>
            <div className="flex gap-1.5">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Hosted Buyer"
                    className="flex-1 min-w-0 text-xs font-medium text-text-primary bg-bg-primary p-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
                <button
                    type="submit"
                    disabled={!preview}
                    className="shrink-0 p-2 rounded-lg bg-accent text-white disabled:opacity-40"
                    title="Add placeholder"
                >
                    <Plus size={14} />
                </button>
            </div>
            {preview ? (
                <p className="font-mono text-[11px] text-text-secondary m-0 mt-1.5 break-all">
                    {preview.name}
                </p>
            ) : null}
        </form>
    );
}
