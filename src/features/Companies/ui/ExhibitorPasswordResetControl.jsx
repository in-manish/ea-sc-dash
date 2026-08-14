import { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import { useExhibitorPasswordReset } from '../hooks/useExhibitorPasswordReset';
import { hasExhibitorPasswordResetTarget } from '../domain/exhibitorPasswordResetPayload';
import ConfirmExhibitorPasswordResetModal from './ConfirmExhibitorPasswordResetModal';

export default function ExhibitorPasswordResetControl({
  eventId,
  token,
  payload,
  enabled = true,
  disabled = false,
  label = 'Reset exhibitor POC password',
  title = 'Reset exhibitor POC password',
  description = 'Resets the exhibitor portal password for this POC.',
  buttonClassName = 'btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50',
  idleTitle,
  disabledTitle,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { resetting, success, error, resetPassword, clearMessages } =
    useExhibitorPasswordReset({ eventId, token });

  const canSubmit =
    enabled && !disabled && hasExhibitorPasswordResetTarget(payload);
  const busy = resetting || disabled;

  const openConfirm = () => {
    if (!canSubmit) return;
    clearMessages();
    setConfirmOpen(true);
  };

  const onConfirm = async () => {
    const ok = await resetPassword(payload);
    if (ok) setConfirmOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        disabled={busy || !canSubmit}
        onClick={openConfirm}
        title={canSubmit ? idleTitle || title : disabledTitle || title}
      >
        {resetting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <KeyRound size={14} />
        )}
        {label}
      </button>
      {success && (
        <p className="basis-full text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 m-0">
          {success}
        </p>
      )}
      {!confirmOpen && error && (
        <p className="basis-full text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2 m-0">
          {error}
        </p>
      )}
      {confirmOpen && (
        <ConfirmExhibitorPasswordResetModal
          title={title}
          description={description}
          loading={resetting}
          error={error}
          onConfirm={onConfirm}
          onCancel={() => !resetting && setConfirmOpen(false)}
        />
      )}
    </>
  );
}
