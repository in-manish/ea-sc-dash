import { Fragment, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Copy, Download, Loader2, Trash2, Upload } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSponsorPromo } from '../hooks/useSponsorPromo';

const SLUG_RE = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

const pad = (n) => String(n).padStart(2, '0');

// ISO string from the API -> value for <input type="datetime-local"> (browser local time)
const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// datetime-local value -> ISO string; empty -> null (clears the limit)
const toIso = (local) => (local ? new Date(local).toISOString() : null);

const formatWindow = (iso) => (iso ? new Date(iso).toLocaleString('en-IN') : 'No limit');

function poolStatus(pool) {
  if (!pool.is_active) return 'Off';
  const now = Date.now();
  if (pool.start_valid && now < new Date(pool.start_valid).getTime()) return 'Not started';
  if (pool.end_valid && now > new Date(pool.end_valid).getTime()) return 'Expired';
  return 'Active';
}

const SAMPLE_CSV = [
  'promotional_code',
  'SPONSOR-AB12CD',
  'SPONSOR-EF34GH',
  'SPONSOR-IJ56KL',
  'SPONSOR-MN78OP',
].join('\n');

function downloadSampleCsv() {
  const url = URL.createObjectURL(new Blob([`${SAMPLE_CSV}\n`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sponsor_promo_codes_sample.csv';
  link.click();
  URL.revokeObjectURL(url);
}

const INPUT = 'block mt-1 px-3 py-2 border border-border rounded text-sm bg-bg-primary';

// "The Maya Mobile Inc." -> "the_maya_mobile_inc" (underscores only: a hyphen breaks email templates)
const slugify = (text) => text
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^[^a-z]+/, '')
  .slice(0, 100)
  .replace(/_+$/, '');

function CopyTokenButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API is blocked on plain http: fall back to a hidden textarea
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied' : 'Copy token'}
      aria-label="Copy template token"
      className="ml-2 p-1 rounded text-text-tertiary hover:text-accent hover:bg-bg-tertiary align-middle"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  );
}

export default function SponsorPromoPage() {
  const { id: eventId } = useParams();
  const { token } = useAuth();
  const promo = useSponsorPromo({ eventId, token });
  const fileRef = useRef(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [hyphenTyped, setHyphenTyped] = useState(false);
  const [editSlug, setEditSlug] = useState(null);
  const [startValid, setStartValid] = useState('');
  const [endValid, setEndValid] = useState('');
  const [editForm, setEditForm] = useState({ name: '', slug: '', start: '', end: '' });

  const slugValid = SLUG_RE.test(slug);
  const rangeInvalid = (start, end) => Boolean(start && end && new Date(start) >= new Date(end));
  const selected = promo.pools.find((p) => p.slug === promo.selectedSlug);

  const handleCreate = async (e) => {
    e.preventDefault();
    const created = await promo.createPool({
      name: name.trim(),
      slug,
      is_active: true,
      start_valid: toIso(startValid),
      end_valid: toIso(endValid),
    });
    if (created) {
      setStartValid('');
      setEndValid('');
      setName('');
      setSlug('');
      setSlugEdited(false);
      setHyphenTyped(false);
    }
  };

  const handleNameChange = (value) => {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const startEdit = (pool) => {
    setEditSlug(pool.slug);
    setEditForm({
      name: pool.name,
      slug: pool.slug,
      start: toLocalInput(pool.start_valid),
      end: toLocalInput(pool.end_valid),
    });
  };

  const saveEdit = async (pool) => {
    const saved = await promo.updatePool(pool, {
      name: editForm.name.trim(),
      slug: editForm.slug,
      start_valid: toIso(editForm.start),
      end_valid: toIso(editForm.end),
    });
    if (saved) setEditSlug(null);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) await promo.importCodes(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-bold text-text-primary m-0">Sponsor Promo Codes</h2>
        <p className="text-sm text-text-secondary mt-1">
          One pool per sponsor. Put <code>{'{{your-slug.promotional_code}}'}</code> in a badge or category
          email and each attendee gets one code from that pool. They get the same code on later sends.
        </p>

        {promo.error && (
          <div className="mt-3 p-3 rounded border border-red-300 bg-red-50 text-sm text-red-700 whitespace-pre-line">
            {promo.error}
          </div>
        )}
        {promo.notice && (
          <div className="mt-3 p-3 rounded border border-green-300 bg-green-50 text-sm text-green-700">
            {promo.notice}
          </div>
        )}

        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 mt-4">
          <label className="text-xs font-bold text-text-secondary">
            Sponsor name
            <input
              className="block mt-1 px-3 py-2 border border-border rounded text-sm bg-bg-primary"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Tata Motors"
            />
          </label>
          <label className="text-xs font-bold text-text-secondary">
            Slug (auto from name, used in the template)
            <input
              className="block mt-1 px-3 py-2 border border-border rounded text-sm bg-bg-primary"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setHyphenTyped(e.target.value.includes('-'));
                setSlug(slugify(e.target.value));
              }}
              placeholder="tata_motors"
            />
          </label>
          <label className="text-xs font-bold text-text-secondary">
            Valid from (optional)
            <input type="datetime-local" className={INPUT} value={startValid} onChange={(e) => setStartValid(e.target.value)} />
          </label>
          <label className="text-xs font-bold text-text-secondary">
            Valid until (optional)
            <input type="datetime-local" className={INPUT} value={endValid} onChange={(e) => setEndValid(e.target.value)} />
          </label>
          <button
            type="submit"
            disabled={promo.busy || !name.trim() || !slugValid || rangeInvalid(startValid, endValid)}
            className="px-4 py-2 rounded bg-accent text-white text-sm font-bold disabled:opacity-50"
          >
            Create pool
          </button>
        </form>
        {rangeInvalid(startValid, endValid) && (
          <p className="text-xs text-red-600 mt-1">Valid from must be before valid until.</p>
        )}
        <p className={`text-xs mt-2 ${hyphenTyped ? 'text-red-600 font-bold' : 'text-amber-700'}`}>
          Warning: do not use a hyphen in the slug. <code>{'{{tata-motors.promotional_code}}'}</code> breaks the
          email template and nothing is sent. Use underscores: <code>{'{{tata_motors.promotional_code}}'}</code>.
          {hyphenTyped && ' Hyphens were changed to underscores.'}
        </p>
        {slug && !slugValid && (
          <p className="text-xs text-red-600 mt-1">Start with a letter; use lowercase letters, numbers and underscores, e.g. tata_motors.</p>
        )}
      </div>

      <div className="bg-bg-primary border border-border rounded-lg shadow-sm overflow-x-auto">
        {promo.loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-text-tertiary">
            <Loader2 className="animate-spin text-accent" size={20} /> Loading pools…
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-tertiary border-b border-border">
                <th className="p-3">Sponsor</th>
                <th className="p-3">Template token</th>
                <th className="p-3">Free / Total</th>
                <th className="p-3">Valid</th>
                <th className="p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {promo.pools.length === 0 && (
                <tr><td colSpan={6} className="p-4 text-text-tertiary">No sponsor pools yet.</td></tr>
              )}
              {promo.pools.map((pool) => (
                <Fragment key={pool.id}>
                <tr
                  onClick={() => promo.setSelectedSlug(pool.slug)}
                  className={`border-b border-border cursor-pointer ${pool.slug === promo.selectedSlug ? 'bg-bg-tertiary' : ''}`}
                >
                  <td className="p-3 font-bold">{pool.name}</td>
                  <td className="p-3 whitespace-nowrap">
                    <code>{`{{${pool.slug}.promotional_code}}`}</code>
                    <CopyTokenButton text={`{{${pool.slug}.promotional_code}}`} />
                  </td>
                  <td className="p-3">{pool.free_codes} / {pool.total_codes}</td>
                  <td className="p-3 text-xs">
                    {formatWindow(pool.start_valid)} → {formatWindow(pool.end_valid)}
                  </td>
                  <td className="p-3">{poolStatus(pool)}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      disabled={promo.busy}
                      onClick={(e) => { e.stopPropagation(); startEdit(pool); }}
                      className="px-3 py-1 mr-2 border border-border rounded text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={promo.busy}
                      onClick={(e) => { e.stopPropagation(); promo.togglePool(pool); }}
                      className="px-3 py-1 border border-border rounded text-xs font-bold"
                    >
                      {pool.is_active ? 'Turn off' : 'Turn on'}
                    </button>
                  </td>
                </tr>
                {editSlug === pool.slug && (
                  <tr className="border-b border-border bg-bg-secondary">
                    <td colSpan={6} className="p-3">
                      <div className="flex flex-wrap items-end gap-3">
                        <label className="text-xs font-bold text-text-secondary">
                          Sponsor name
                          <input className={INPUT} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </label>
                        <label className="text-xs font-bold text-text-secondary">
                          Slug
                          <input
                            className={INPUT}
                            value={editForm.slug}
                            onChange={(e) => setEditForm({ ...editForm, slug: slugify(e.target.value) })}
                          />
                        </label>
                        <label className="text-xs font-bold text-text-secondary">
                          Valid from
                          <input type="datetime-local" className={INPUT} value={editForm.start} onChange={(e) => setEditForm({ ...editForm, start: e.target.value })} />
                        </label>
                        <label className="text-xs font-bold text-text-secondary">
                          Valid until
                          <input type="datetime-local" className={INPUT} value={editForm.end} onChange={(e) => setEditForm({ ...editForm, end: e.target.value })} />
                        </label>
                        <button
                          type="button"
                          disabled={promo.busy || !editForm.name.trim() || !SLUG_RE.test(editForm.slug) || rangeInvalid(editForm.start, editForm.end)}
                          onClick={() => saveEdit(pool)}
                          className="px-4 py-2 rounded bg-accent text-white text-sm font-bold disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button type="button" onClick={() => setEditSlug(null)} className="px-4 py-2 border border-border rounded text-sm font-bold">
                          Cancel
                        </button>
                      </div>
                      {editForm.slug !== pool.slug && (
                        <p className="text-xs text-red-600 font-bold mt-2">
                          Changing the slug breaks every email template that still uses{' '}
                          <code>{`{{${pool.slug}.promotional_code}}`}</code>. Update those templates to{' '}
                          <code>{`{{${editForm.slug || 'new_slug'}.promotional_code}}`}</code> before sending. Codes already given stay with their attendees.
                        </p>
                      )}
                      <p className="text-xs text-text-tertiary mt-2">
                        Underscores only, no hyphens. Clear a date to remove that limit.
                      </p>
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-base font-bold text-text-primary m-0">Codes: {selected.name}</h3>
            <div className="flex items-center gap-2">
              <select
                className="px-2 py-1 border border-border rounded text-sm bg-bg-primary"
                value={promo.assignedFilter}
                onChange={(e) => promo.setAssignedFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="false">Free</option>
                <option value="true">Assigned</option>
              </select>
              <button
                type="button"
                onClick={downloadSampleCsv}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded text-sm font-bold"
              >
                <Download size={14} /> Sample CSV
              </button>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
              <button
                type="button"
                disabled={promo.busy}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-accent text-white text-sm font-bold disabled:opacity-50"
              >
                <Upload size={14} /> Import CSV
              </button>
            </div>
          </div>
          <p className="text-xs text-text-tertiary mb-3">
            CSV needs one column named <code>promotional_code</code>, one code per row. Duplicates reject the whole file. Use Sample CSV for the format.
          </p>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-tertiary border-b border-border">
                <th className="p-2">Code</th>
                <th className="p-2">Assigned to</th>
                <th className="p-2">Assigned at</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {(promo.codes?.codes || []).map((code) => (
                <tr key={code.id} className="border-b border-border">
                  <td className="p-2 font-mono">{code.promotional_code}</td>
                  <td className="p-2">
                    {code.is_assigned ? (code.badge_email || code.badge_name || `Badge ${code.badge_id}`) : 'Free'}
                  </td>
                  <td className="p-2">{code.assigned_at ? new Date(code.assigned_at).toLocaleString('en-IN') : ''}</td>
                  <td className="p-2 text-right">
                    {!code.is_assigned && (
                      <button
                        type="button"
                        disabled={promo.busy}
                        onClick={() => promo.deleteCode(code.id)}
                        className="text-red-600"
                        aria-label="Delete code"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {promo.codes && promo.codes.codes.length === 0 && (
                <tr><td colSpan={4} className="p-3 text-text-tertiary">No codes.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
