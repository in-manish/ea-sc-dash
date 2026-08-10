import { ArrowLeft, Edit2, ShieldAlert, ShieldCheck } from 'lucide-react';

const initials = (n) =>
  n ? n.split(' ').map((p) => p[0]).join('').substring(0, 2).toUpperCase() : 'U';

/** CompanyDetails-style header: back, identity, Edit action. */
export default function UserDetailsHeader({
  user,
  isEditing,
  dirty,
  onBack,
  onEdit,
}) {
  if (!user) return null;
  const emailOk = user.is_verified_email === true;
  const phoneOk = user.is_verified_phone_number === true;

  return (
    <div className="mb-8">
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer p-0 mb-4"
        onClick={onBack}
      >
        <ArrowLeft size={16} /> Back to List
      </button>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-border pb-6 gap-4">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-accent text-accent-text rounded-md flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm">
            {initials(user.name)}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-text-primary flex items-center gap-3">
              {user.name || 'User'}
              {dirty ? <span className="text-sm font-medium text-accent">Unsaved</span> : null}
            </h1>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-semibold tracking-wide bg-bg-tertiary text-text-primary font-mono border border-border">
                #{user.id}
              </span>
              {user.role && (
                <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium tracking-wide bg-purple-100 text-purple-800 uppercase">
                  {user.role}
                </span>
              )}
              <span className={`inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium border ${
                emailOk ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {emailOk ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />} Email
              </span>
              <span className={`inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium border ${
                phoneOk ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {phoneOk ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />} Phone
              </span>
            </div>
          </div>
        </div>

        {!isEditing && (
          <div className="flex items-center shrink-0 gap-2">
            <button type="button" className="btn btn-secondary inline-flex items-center gap-1.5" onClick={onEdit}>
              <Edit2 size={14} /> Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
