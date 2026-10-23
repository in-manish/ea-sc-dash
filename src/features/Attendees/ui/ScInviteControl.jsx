import { KeyRound } from 'lucide-react';
import useScInvite from '../hooks/useScInvite';
import ScInviteModal from './ScInviteModal';

/** Selection-bar button + modal: send (or reset and resend) SnapCard login details. */
export default function ScInviteControl({ eventId, token, selection, count, onSent }) {
    const invite = useScInvite({ eventId, token, selection, onSent });

    return (
        <>
            <button
                type="button"
                className="btn btn-secondary flex items-center"
                onClick={invite.open}
                title="Email SnapCard login details to the selected attendees"
            >
                <KeyRound size={16} style={{ marginRight: '0.5rem' }} />
                Send SC login
            </button>
            <ScInviteModal count={count} invite={invite} />
        </>
    );
}
