import { useState } from 'react';
import { UserCheck, Loader2 } from 'lucide-react';
import useChangeExhibitorPoc from '../hooks/useChangeExhibitorPoc';
import ConfirmExhibitorPasswordResetModal from '../../Companies/ui/ConfirmExhibitorPasswordResetModal';

/** Makes the selected exhibitor attendee the company POC (previous POC is unlinked). */
export default function ChangeExhibitorPocControl({ eventId, token, attendee, onChanged }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { changing, success, error, changePoc, clearMessages } =
        useChangeExhibitorPoc({ eventId, token });

    const alreadyPoc = Boolean(attendee.is_poc);

    const openConfirm = () => {
        clearMessages();
        setConfirmOpen(true);
    };

    const onConfirm = async () => {
        const ok = await changePoc({
            badgeId: attendee.id,
            companyId: attendee.exhibitor_id,
        });
        if (ok) {
            setConfirmOpen(false);
            onChanged?.();
        }
    };

    const who = attendee.name || attendee.email || 'this attendee';

    return (
        <>
            <button
                type="button"
                className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
                disabled={changing || alreadyPoc}
                onClick={openConfirm}
                title={
                    alreadyPoc
                        ? 'Already the POC. Select another exhibitor attendee of this company to make them the POC'
                        : 'Make the selected attendee the exhibitor POC for their company'
                }
            >
                {changing ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <UserCheck size={16} />
                )}
                Set as exhibitor POC
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
                    title="Set as exhibitor POC"
                    description={`Make ${who} the POC for their company? The current POC is unlinked and the new POC receives the portal password email.`}
                    confirmLabel="Set as POC"
                    loading={changing}
                    error={error}
                    onConfirm={onConfirm}
                    onCancel={() => !changing && setConfirmOpen(false)}
                />
            )}
        </>
    );
}
