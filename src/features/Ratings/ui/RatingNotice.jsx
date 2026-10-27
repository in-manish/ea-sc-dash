import { AlertCircle } from 'lucide-react';

/** Error banner. `children` can hold a retry button. */
export default function RatingNotice({ text, children }) {
  if (!text) return null;
  return (
    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-sm text-red-600">
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <span className="flex-1 whitespace-pre-line">{text}</span>
      {children}
    </div>
  );
}
