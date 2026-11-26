import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

const TONES = {
  success: { box: 'bg-green-500/10 border-green-500/30 text-green-800', Icon: CheckCircle2 },
  danger: { box: 'bg-red-500/10 border-red-500/30 text-red-800', Icon: XCircle },
  warning: { box: 'bg-amber-500/10 border-amber-500/30 text-amber-900', Icon: AlertTriangle },
  info: { box: 'bg-sky-500/10 border-sky-500/30 text-sky-900', Icon: Info },
};

/** One-line (or multi-line) message box using the standard palette, which shows in both themes. */
export default function Banner({ tone = 'info', children }) {
  if (!children) return null;
  const { box, Icon } = TONES[tone] || TONES.info;
  return (
    <div className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm whitespace-pre-line ${box}`}>
      <Icon size={16} className="shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
