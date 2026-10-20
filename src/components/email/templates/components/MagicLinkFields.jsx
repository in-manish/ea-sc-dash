import React from 'react';

const INPUT_CLASS =
    'w-full text-sm font-medium text-gray-900 bg-white p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:font-normal placeholder:text-gray-400';
const LABEL_CLASS = 'block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2';

/** Magic link login settings of an email template. Put {{ magic_link }} in the body to use it. */
const MagicLinkFields = ({ isEditing, editFormData, previewTemplate, handleEditChange }) => {
    const data = isEditing ? editFormData : previewTemplate;
    // Backend without the magic link fields (older server): hide the section.
    if (data?.magic_link_enabled === undefined) return null;

    const set = (name, value) => handleEditChange({ target: { name, value } });
    const enabled = data.magic_link_enabled === true;

    return (
        <div className="flex flex-col gap-3">
            <div>
                <label className={LABEL_CLASS}>Magic link login</label>
                {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer gap-3">
                        <input
                            type="checkbox"
                            name="magic_link_enabled"
                            checked={enabled}
                            onChange={(e) => set('magic_link_enabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
                        <span className="text-xs font-medium text-gray-700 shrink-0">{enabled ? 'On' : 'Off'}</span>
                    </label>
                ) : (
                    <span
                        className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {enabled ? 'On' : 'Off'}
                    </span>
                )}
            </div>

            {enabled && isEditing ? (
                <>
                    <p className="text-[11px] text-gray-500">
                        Put <code>{'{{ magic_link }}'}</code> in the email body. Each person gets their own login link.
                    </p>
                    <div>
                        <label className={LABEL_CLASS}>Expires after (minutes)</label>
                        <input
                            type="number"
                            min="1"
                            name="magic_link_expiry_minutes"
                            value={data.magic_link_expiry_minutes ?? ''}
                            onChange={(e) => set('magic_link_expiry_minutes', e.target.value)}
                            className={INPUT_CLASS}
                            placeholder="Empty = default (30)"
                        />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>Number of uses</label>
                        <input
                            type="number"
                            min="1"
                            name="magic_link_single_use"
                            value={data.magic_link_single_use ?? ''}
                            onChange={(e) => set('magic_link_single_use', e.target.value)}
                            className={INPUT_CLASS}
                            placeholder="Empty = unlimited"
                        />
                        <p className="text-[11px] text-gray-500 mt-1">1 = works once. Empty = until it expires.</p>
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>After login go to</label>
                        <input
                            type="url"
                            name="magic_link_redirect_url"
                            value={data.magic_link_redirect_url || ''}
                            onChange={(e) => set('magic_link_redirect_url', e.target.value)}
                            className={INPUT_CLASS}
                            placeholder="https://..."
                        />
                    </div>
                </>
            ) : null}

            {enabled && !isEditing ? (
                <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                    <div>Expires after: {data.magic_link_expiry_minutes ? `${data.magic_link_expiry_minutes} min` : 'default'}</div>
                    <div>Uses: {data.magic_link_single_use ?? 'unlimited'}</div>
                    <div className="break-all">Goes to: {data.magic_link_redirect_url || 'diary home'}</div>
                </div>
            ) : null}
        </div>
    );
};

export default MagicLinkFields;
