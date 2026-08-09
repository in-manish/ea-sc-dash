import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Mail, Phone } from 'lucide-react';
import { userService } from '../../../services/userService';
import useEditUserForm from '../hooks/useEditUserForm';
import EditContactField from './EditContactField';
import EditUserProfileFields from './EditUserProfileFields';
import DuplicateContactMatches from './DuplicateContactMatches';
import VerifyContactConfirmModal from './VerifyContactConfirmModal';

/** Editable profile form body used inside the user detail panel. */
export default function UserProfileEditForm({
  user,
  token,
  isActive,
  onSaved,
  onCancel,
  onDirtyChange,
  onSwitchUser,
}) {
  const form = useEditUserForm({ user, token, isOpen: isActive });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    onDirtyChange?.(form.isDirty);
  }, [form.isDirty, onDirtyChange]);

  if (!form.editingUser) return null;
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
        country_code: editingUser.country_code || null,
        is_verified_email: editingUser.is_verified_email,
        is_verified_phone_number: editingUser.is_verified_phone_number,
        designation: editingUser.designation || null,
        company: editingUser.company || null,
        company_address: editingUser.company_address || null,
        city: editingUser.city || null,
        state: editingUser.state || null,
        country: editingUser.country || null,
        country_name: editingUser.country_name || null,
        zipcode: editingUser.zipcode || null,
      }, token);
      onSaved?.(result);
      setSuccessMessage('User updated successfully');
      setTimeout(() => onCancel?.(), 500);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update user.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {updateError && <div className="bg-red-50 text-danger p-3 rounded-lg text-sm border border-red-100 flex gap-2"><AlertCircle size={16} className="shrink-0 mt-0.5" /><span>{updateError}</span></div>}
          {successMessage && <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm border border-emerald-100 flex gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5" /><span>{successMessage}</span></div>}

          <div className="input-group">
            <label className="input-label" htmlFor="detail-edit-name">Full name</label>
            <input id="detail-edit-name" type="text" name="name" value={editingUser.name} onChange={form.handleEditChange} className="input-field" required autoFocus />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <EditContactField id="detail-edit-email" icon={Mail} label="Email address" name="email" type="email" value={editingUser.email} onChange={form.handleEditChange} verified={editingUser.is_verified_email} onVerifyChange={(v) => form.requestVerifyToggle('is_verified_email', v)} duplicateCount={form.duplicateUsersByEmail.length} />
            <EditContactField id="detail-edit-phone" icon={Phone} label="Phone number" name="phone_number" value={editingUser.phone_number} onChange={form.handleEditChange} verified={editingUser.is_verified_phone_number} onVerifyChange={(v) => form.requestVerifyToggle('is_verified_phone_number', v)} duplicateCount={form.duplicateUsersByPhone.length} />
          </div>

          {showEmailDupes && <DuplicateContactMatches users={form.duplicateUsersByEmail} highlightField="email" onIgnore={() => form.setIgnoreEmailWarnings(true)} onEditUser={(u) => onSwitchUser?.(u)} />}
          {showPhoneDupes && <DuplicateContactMatches users={form.duplicateUsersByPhone} highlightField="phone" onIgnore={() => form.setIgnorePhoneWarnings(true)} onEditUser={(u) => onSwitchUser?.(u)} />}

          <EditUserProfileFields values={editingUser} onChange={form.handleEditChange} />
        </div>

        <footer className="px-5 py-3 border-t border-border flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (dirty && !window.confirm('Discard unsaved changes?')) return;
              onCancel?.();
            }}
            className="btn btn-secondary text-sm px-3"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary text-sm flex items-center gap-1.5 min-w-[120px] px-3 disabled:opacity-40" disabled={isUpdating || !dirty}>
            {isUpdating ? <Loader2 size={14} className="animate-spin" /> : null} Save changes
          </button>
        </footer>
      </form>

      {form.pendingVerify && (
        <VerifyContactConfirmModal
          contactType={form.pendingVerify.contactType}
          contactValue={pendingValue}
          duplicateUsers={form.pendingVerify.duplicates}
          onCancel={() => form.setPendingVerify(null)}
          onConfirm={form.confirmPendingVerify}
        />
      )}
    </>
  );
}
