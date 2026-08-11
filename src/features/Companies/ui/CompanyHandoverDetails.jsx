import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { parseHandoverDetails } from '../domain/parseHandoverDetails';

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

async function copySignature(url) {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('fetch failed');
    const blob = await res.blob();
    const type = blob.type || 'image/png';
    if (navigator.clipboard?.write && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
      return 'image';
    }
  } catch {
    // CORS or ClipboardItem unsupported — fall back to URL
  }
  await copyText(url);
  return 'url';
}

/** Renders handover JSON: name, designation, phone, signature image (copyable). */
export default function CompanyHandoverDetails({ handoverDetails }) {
  const details = parseHandoverDetails(handoverDetails);
  const [copied, setCopied] = useState('');

  if (!details) return null;

  const handleCopySignature = async () => {
    if (!details.signature) return;
    try {
      const mode = await copySignature(details.signature);
      setCopied(mode);
      window.setTimeout(() => setCopied(''), 2000);
    } catch {
      // ignore
    }
  };

  const latestRemark = details.remarks[0];

  return (
    <>
      {details.name && <Field label="Handover contact" value={details.name} />}
      {details.designation && (
        <Field label="Designation" value={details.designation} />
      )}
      {details.phone_number && (
        <Field label="Handover phone" value={details.phone_number} />
      )}

      {details.signature && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-green-200 bg-green-50/60 p-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[11px] font-semibold text-green-800">
              Signature · handover done
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline bg-transparent border-none p-0 cursor-pointer"
                onClick={handleCopySignature}
                title="Copy signature image"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied === 'image'
                  ? 'Image copied'
                  : copied === 'url'
                    ? 'URL copied'
                    : 'Copy'}
              </button>
              <a
                href={details.signature}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-accent"
                title="Open signature image"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopySignature}
            className="self-start p-0 border border-border rounded-md bg-white hover:border-accent/40 transition-colors cursor-pointer"
            title="Click to copy signature"
          >
            <img
              src={details.signature}
              alt="Handover signature"
              className="max-h-16 max-w-full object-contain rounded-md"
            />
          </button>
        </div>
      )}

      {latestRemark && (
        <div className="flex flex-col gap-0.5">
          <label className="text-[11px] text-text-secondary font-medium">Latest remark</label>
          <span className="text-sm text-text-primary break-words">
            {latestRemark.remarks}
          </span>
          {latestRemark.date && (
            <small className="text-[11px] text-text-tertiary">{latestRemark.date}</small>
          )}
        </div>
      )}
    </>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[11px] text-text-secondary font-medium">{label}</label>
      <span className="text-sm text-text-primary break-words">{value}</span>
    </div>
  );
}
