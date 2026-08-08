import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Mail, Phone, X } from 'lucide-react';
import { userService } from '../../../services/userService';
import useEditUserForm from '../hooks/useEditUserForm';
import EditContactField from './EditContactField';
import DuplicateContactMatches from './DuplicateContactMatches';
import VerifyContactConfirmModal from './VerifyContactConfirmModal';

const initials = (n) =>
  n ? n.split(' ').map((p) => p[0]).join('').substring(0, 2).toUpperCase() : 'U';

export default function EditUserModal({ user, isOpen, token, onClose, onSaved }) {
  const form = useEditUserForm({ user, token, isOpen });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape' && !form.pendingVerify) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, form.pendingVerify, onClose]);

  if (!isOpen || !form.editingUser) return null;
  const { editingUser } = form;
  const dirty = form.isDirty;
  const pendingValue =
    form.pendingVerify?.contactType === 'email' ? editingUser.email : editingUser.phone_number;
  const showEmailDupes = !form.ignoreEmailWarnings && form.duplicateUsersByEmail.length > 0;
  const showPhoneDupes = !form.ignorePhoneWarnings && form.duplicateUsersByPhone.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dirty || isUpdating) return;
    setIsUpdating(true);
    setUpdateError('');
    setSuccessMessage('');
    try {
      const result = await userService.adminUpdateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        phone_number: editingUser.phone_number,
        is_verified_email: editingUser.is_verified_email,
        is_verified_phone_number: editingUser.is_verified_phone_number,
      }, token);
      onSaved?.(result);
      setSuccessMessage('User updated successfully');
      setTimeout(() => onClose(), 700);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update user.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => !form.pendingVerify && onClose()} role="presentation">
        <div role="dialog" aria-modal="true" aria-labelledby="edit-user-title" className="bg-bg-primary border border-border rounded-2xl shadow-2xl w-full max-w-[820px] max-h-[92vh] flex flex-col overflow-hidden animate-modal-smooth" onClick={(e) => e.stopPropagation()}>
          <header className="px-6 py-5 border-b border-border flex items-center gap-3.5 shrink-0 bg-bg-secondary/25">
            <div className="w-12 h-12 rounded-full bg-accent text-accent-text flex items-center justify-center text-base font-bold shrink-0">{initials(editingUser.name)}</div>
            <div className="min-w-0 flex-1">
              <h3 id="edit-user-title" className="font-bold text-text-primary text-lg truncate">{editingUser.name || 'Edit user'}</h3>
              <p className="text-xs text-text-tertiary mt-0.5">
                User ID <span className="font-semibold text-text-secondary">#{editingUser.id}</span>
                {dirty ? <span className="ml-2 text-accent font-medium">· Unsaved changes</span> : null}
              </p>
            </div>
            <button type="button" onClick={onClose} className="p-2 rounded-lg border-none bg-transparent text-text-secondary hover:bg-bg-secondary cursor-pointer" aria-label="Close"><X size={18} /></button>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {updateError && <div className="bg-red-50 text-danger p-3.5 rounded-lg text-sm border border-red-100 flex gap-2"><AlertCircle size={16} className="shrink-0 mt-0.5" /><span>{updateError}</span></div>}
              {successMessage && <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-lg text-sm border border-emerald-100 flex gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5" /><span>{successMessage}</span></div>}

              <div className="input-group max-w-xl">
                <label className="input-label" htmlFor="edit-name">Full name</label>
                <input id="edit-name" type="text" name="name" value={editingUser.name} onChange={form.handleEditChange} className="input-field" required autoFocus />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EditContactField id="edit-email" icon={Mail} label="Email address" name="email" type="email" value={editingUser.email} onChange={form.handleEditChange} verified={editingUser.is_verified_email} onVerifyChange={(v) => form.requestVerifyToggle('is_verified_email', v)} duplicateCount={form.duplicateUsersByEmail.length} />
                <EditContactField id="edit-phone" icon={Phone} label="Phone number" name="phone_number" value={editingUser.phone_number} onChange={form.handleEditChange} verified={editingUser.is_verified_phone_number} onVerifyChange={(v) => form.requestVerifyToggle('is_verified_phone_number', v)} duplicateCount={form.duplicateUsersByPhone.length} />
              </div>

              {/* Full-width match lists — not nested in half-width columns */}
              <div className="space-y-3">
                {showEmailDupes && <DuplicateContactMatches users={form.duplicateUsersByEmail} highlightField="email" onIgnore={() => form.setIgnoreEmailWarnings(true)} onEditUser={form.loadUser} />}
                {showPhoneDupes && <DuplicateContactMatches users={form.duplicateUsersByPhone} highlightField="phone" onIgnore={() => form.setIgnorePhoneWarnings(true)} onEditUser={form.loadUser} />}
              </div>
            </div>

            <footer className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0">
              <p className="text-xs text-text-tertiary hidden sm:block">Esc to close · shared contacts need typed confirmation</p>
              <div className="flex gap-2.5 ml-auto">
                <button type="button" onClick={onClose} className="btn btn-secondary text-sm px-4" disabled={isUpdating}>Cancel</button>
                <button type="submit" className="btn btn-primary text-sm flex items-center gap-1.5 min-w-[128px] px-4 disabled:opacity-40" disabled={isUpdating || !dirty}>
                  {isUpdating ? <Loader2 size={14} className="animate-spin" /> : null} Save changes
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>

      {form.pendingVerify && (
        <VerifyContactConfirmModal contactType={form.pendingVerify.contactType} contactValue={pendingValue} duplicateUsers={form.pendingVerify.duplicates} onCancel={() => form.setPendingVerify(null)} onConfirm={form.confirmPendingVerify} />
      )}
    </>
  );
}
