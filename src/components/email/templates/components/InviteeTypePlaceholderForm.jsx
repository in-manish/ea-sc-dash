import { useState } from 'react';
import { Plus } from 'lucide-react';
import { buildInviteeLinkPlaceholder } from '../domain/inviteeLinkPlaceholder';

export default function InviteeTypePlaceholderForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const preview = buildInviteeLinkPlaceholder(title);

  const submit = (e) => {
    e.preventDefault();
    if (!preview) return;
    onAdd?.(preview, title);
    setTitle('');
  };

  return (
    <form onSubmit={submit} className="pt-6 border-t border-gray-200">
      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
        Invitee type link
      </span>
      <p className="text-[11px] text-gray-500 leading-relaxed m-0 mb-2">
        Type an invitee title to build <span className="font-mono">invitee_&lt;title_slug&gt;_link</span>.
      </p>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Hosted Buyer"
          className="flex-1 min-w-0 text-xs font-medium text-gray-900 bg-white p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
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
        <p className="font-mono text-[11px] text-gray-700 m-0 mt-1.5 break-all">
          {`{{${preview.name}}}`}
        </p>
      ) : null}
    </form>
  );
}
