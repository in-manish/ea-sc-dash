import { X, Loader2, Save } from 'lucide-react';
import useEditAttendee from '../hooks/useEditAttendee';
import EditAttendeeFormFields from './EditAttendeeFormFields';

const EditAttendeeModal = ({
  eventId,
  uuid,
  token,
  attendeeTypes = [],
  attendeeTypesLoading = false,
  onClose,
  onSaved,
}) => {
  const {
    form,
    setField,
    loading,
    saving,
    error,
    loadError,
    fieldErrors,
    submit,
  } = useEditAttendee({
    eventId,
    uuid,
    token,
    onSaved: (updated) => {
      onSaved?.(updated);
      onClose?.();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in"
      onClick={saving ? undefined : onClose}
    >
      <div
        className="bg-bg-primary rounded-lg border border-border shadow-xl w-[95%] max-w-[720px] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex justify-between items-center bg-bg-secondary">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Edit Attendee</h2>
            <p className="text-xs text-text-tertiary mt-0.5 font-mono">{uuid}</p>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-sm text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary disabled:opacity-50"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-text-tertiary gap-3">
              <Loader2 className="animate-spin text-accent" size={28} />
              <p className="text-sm">Loading attendee…</p>
            </div>
          )}

          {!loading && loadError && (
            <div className="bg-red-50 text-red-800 p-3 border border-red-200 rounded-md text-sm whitespace-pre-line">
              {loadError}
            </div>
          )}

          {!loading && !loadError && form && (
            <form id="edit-attendee-form" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-800 p-3 border border-red-200 rounded-md text-sm mb-4 whitespace-pre-line">
                  {error}
                </div>
              )}
              <EditAttendeeFormFields
                form={form}
                setField={setField}
                fieldErrors={fieldErrors || {}}
                attendeeTypes={attendeeTypes}
                typesLoading={attendeeTypesLoading}
              />
            </form>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-bg-secondary">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-attendee-form"
            className="btn btn-primary inline-flex items-center gap-2"
            disabled={loading || saving || Boolean(loadError) || !form}
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAttendeeModal;
