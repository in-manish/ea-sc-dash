import { useEffect, useMemo, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { emailService } from '../../../../services/emailService';
import {
  EMAIL_TEMPLATE_TYPE_CUSTOM,
  EMAIL_TEMPLATE_TYPE_GROUPS,
  EMAIL_TEMPLATE_TYPES,
  normalizeTemplateType,
} from '../constants/emailTemplateTypes';

function existingByType(results) {
  const map = {};
  (results || []).forEach((row) => {
    if (row?.template_type && !map[row.template_type]) map[row.template_type] = row;
  });
  return map;
}

export default function CreateTemplateTypePicker({
  open,
  eventId,
  token,
  onClose,
  onSelect,
  onOpenExisting,
}) {
  const [existing, setExisting] = useState({});
  const [customSlug, setCustomSlug] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCustomSlug('');
    if (!eventId || !token) return undefined;
    let cancelled = false;
    setLoading(true);
    emailService
      .getEmailTemplates(eventId, token, { page: 1, size: 100, event: eventId })
      .then((data) => {
        const rows = Array.isArray(data) ? data : data?.results;
        if (!cancelled) setExisting(existingByType(rows));
      })
      .catch(() => {
        if (!cancelled) setExisting({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, eventId, token]);

  const grouped = useMemo(
    () => EMAIL_TEMPLATE_TYPE_GROUPS.map((group) => ({
      group,
      items: EMAIL_TEMPLATE_TYPES.filter((item) => item.group === group),
    })),
    [],
  );

  if (!open) return null;

  const pick = (value) => {
    const found = existing[value];
    if (found) onOpenExisting?.(found);
    else onSelect?.(value);
  };

  const customValue = normalizeTemplateType(customSlug);
  const customExisting = customValue ? existing[customValue] : null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <header className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Create template by type</h3>
            <p className="text-xs text-gray-500 mt-1">
              One template per type for this event. Type is prefilled from your selection.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>
        <div className="p-4 overflow-y-auto flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-6 text-gray-400">
              <Loader2 className="animate-spin" size={20} />
            </div>
          ) : null}
          {grouped.map(({ group, items }) => (
            <section key={group}>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{group}</h4>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <TypeRow
                    key={item.value}
                    item={item}
                    exists={Boolean(existing[item.value])}
                    onClick={() => pick(item.value)}
                  />
                ))}
              </div>
            </section>
          ))}
          <section>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Custom</h4>
            <div className="flex gap-2">
              <input
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="custom_type_slug"
                className="input-field flex-1 text-sm"
              />
              <button
                type="button"
                disabled={!customValue}
                onClick={() => pick(customValue || EMAIL_TEMPLATE_TYPE_CUSTOM)}
                className="px-3 py-2 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {customExisting ? 'Open' : 'Create'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function TypeRow({ item, exists, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full px-3 py-2.5 rounded-xl border border-gray-200 hover:border-accent/40 hover:bg-accent/5 transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-gray-900">{item.label}</span>
        <span className={`text-[10px] font-black uppercase tracking-wider ${exists ? 'text-amber-600' : 'text-accent'}`}>
          {exists ? 'Open existing' : 'Create'}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
      <p className="text-[10px] text-gray-400 mt-1 font-mono">{item.value}</p>
    </button>
  );
}
