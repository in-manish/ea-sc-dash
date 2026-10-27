import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const thClass =
  'bg-bg-secondary py-3 px-4 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border whitespace-nowrap';
const tdClass = 'py-3 px-4 text-sm text-text-primary border-b border-border align-middle';

function SignatureCell({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-accent hover:underline"
      title="Open signature"
    >
      <img
        src={url}
        alt="Handover signature"
        className="h-8 w-16 object-contain bg-white border border-border rounded"
        loading="lazy"
      />
      <ExternalLink size={12} />
    </a>
  );
}

/** Signed-handover rows: company, OBF, stall, handover person, designation, phone, signature. */
export default function HandoverTable({ rows, eventId }) {
  return (
    <div className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className={thClass}>Company</th>
            <th className={thClass}>OBF</th>
            <th className={thClass}>Stall</th>
            <th className={thClass}>Handover person</th>
            <th className={thClass}>Designation</th>
            <th className={thClass}>Phone</th>
            <th className={thClass}>Signature</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-bg-secondary/50">
              <td className={tdClass}>
                <Link
                  to={`/event/${eventId}/companies/${row.id}`}
                  className="font-medium text-text-primary hover:text-accent"
                >
                  {row.companyName || '—'}
                </Link>
                {row.isCoExhibitor && (
                  <span className="ml-2 text-[11px] text-text-tertiary">Co-exhibitor</span>
                )}
              </td>
              <td className={tdClass}>{row.obfNumber || '—'}</td>
              <td className={tdClass}>{row.stallNumber || '—'}</td>
              <td className={tdClass}>{row.name || '—'}</td>
              <td className={tdClass}>{row.designation || '—'}</td>
              <td className={tdClass}>{row.phone || '—'}</td>
              <td className={tdClass}>
                <SignatureCell url={row.signature} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
