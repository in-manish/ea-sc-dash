import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    Globe,
    Building2,
    ShieldCheck,
    Loader2,
    RefreshCw,
    HeartHandshake,
    IdCard,
} from 'lucide-react';
import CopyableValue from './CopyableValue';
import ObfCopyChip from './ObfCopyChip';

const AttendeeTableRow = ({
    attendee,
    selectedEvent,
    isCrossEvent,
    isGlobalSelectionMode,
    isSelected,
    syncingScUuid,
    needsScSync,
    onToggleSelect,
    onOpenDetail,
    onSyncSc,
    onMatchmaking,
    onCreateEBadge,
}) => {
    const navigate = useNavigate();

    return (
        <tr
            className={`cursor-pointer transition-colors duration-200 [&>td]:border-b [&>td]:border-border group ${
                isCrossEvent
                    ? 'bg-amber-50 hover:bg-amber-100/80'
                    : 'hover:bg-bg-secondary'
            }`}
            title={isCrossEvent ? `Other event (ID: ${attendee.event_id})` : undefined}
            onClick={() => onOpenDetail(attendee)}
        >
            <td className="py-4 px-4 align-top group-last:border-b-0" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    className={`w-4 h-4 accent-accent ${isGlobalSelectionMode ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                    checked={isSelected}
                    onChange={() => onToggleSelect(attendee.uuid)}
                    disabled={isGlobalSelectionMode}
                    aria-label={`Select ${attendee.name}`}
                />
            </td>
            <td className="py-4 px-6 align-top group-last:border-b-0">
                <div className="font-semibold text-text-primary text-sm flex items-center gap-2">
                    {attendee.name}
                    <CopyableValue
                        value={attendee.id}
                        label="ID"
                        prefix="#"
                        hideLabel
                        className="text-[10px] font-mono opacity-60 hover:opacity-100"
                    />
                    {attendee.is_poc && (
                        <ShieldCheck
                            size={16}
                            className="align-text-bottom text-accent"
                            title="Point of Contact (POC)"
                        />
                    )}
                </div>
                <div className="mt-0.5 flex flex-col gap-0.5">
                    <CopyableValue value={attendee.reg_id} label="Reg ID" />
                    <CopyableValue value={attendee.evc_id} label="EVC ID" />
                </div>
            </td>
            <td className="py-4 px-6 align-top group-last:border-b-0">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[0.8125rem] text-text-secondary" title={attendee.email}>
                        <Mail size={12} className="shrink-0" />
                        <span className="truncate max-w-[180px]">{attendee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[0.8125rem] text-text-secondary" title={attendee.phone_number}>
                        <Phone size={12} className="shrink-0" /> +{attendee.country_code} {attendee.phone_number}
                    </div>
                </div>
            </td>
            <td className="py-4 px-6 align-top group-last:border-b-0">
                <div className="flex flex-col">
                    <div className="font-medium text-sm text-text-primary">
                        {attendee.exhibitor_id ? (
                            <span
                                className="text-accent cursor-pointer hover:underline underline-offset-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/event/${selectedEvent.id}/companies/${attendee.exhibitor_id}`);
                                }}
                                title="View Company Details"
                            >
                                {attendee.company || '-'}
                            </span>
                        ) : (
                            attendee.company || '-'
                        )}
                    </div>
                    <ObfCopyChip value={attendee.obf_number} />
                    <div className="text-xs text-text-secondary mt-0.5">
                        {[attendee.city, attendee.country].filter(Boolean).join(', ') || '-'}
                    </div>
                    {(attendee.website || attendee.parent_exhibitor_id) && (
                        <div className="flex gap-2.5 mt-1.5">
                            {attendee.website && (
                                <div className="text-xs flex items-center gap-1">
                                    <Globe size={10} className="text-text-tertiary" />
                                    <a
                                        href={attendee.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-accent hover:underline"
                                    >
                                        Website
                                    </a>
                                </div>
                            )}
                            {attendee.parent_exhibitor_id && (
                                <div className="text-xs flex items-center gap-1">
                                    <Building2 size={10} className="text-text-tertiary" />
                                    <span
                                        className="text-accent cursor-pointer hover:underline text-[0.75rem] ml-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(
                                                `/event/${selectedEvent.id}/companies/${attendee.parent_exhibitor_id}`
                                            );
                                        }}
                                        title={`Go to Parent Exhibitor (ID: ${attendee.parent_exhibitor_id})`}
                                    >
                                        Parent Exhibitor
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </td>
            <td className="py-4 px-6 align-top group-last:border-b-0">
                <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 tracking-wide">
                    {attendee.attendee_type}
                </span>
            </td>
            <td className="py-4 px-6 align-top group-last:border-b-0">
                <span
                    className={`inline-flex py-1 px-2.5 rounded-full text-xs font-medium tracking-wide ${attendee.reg_type === 'ON_SPOT' ? 'bg-[#fefaca] text-[#854d0e]' : 'bg-[#dcfce7] text-[#166534]'}`}
                >
                    {attendee.reg_type}
                </span>
            </td>
            <td className="py-4 px-6 align-middle group-last:border-b-0 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="inline-flex items-center gap-2">
                    {needsScSync(attendee) && (
                        <button
                            className="btn btn-secondary btn-sm inline-flex items-center gap-1.5"
                            onClick={() => onSyncSc(attendee)}
                            disabled={syncingScUuid === attendee.uuid}
                            title="Sync badge with SnapCard"
                        >
                            {syncingScUuid === attendee.uuid ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <RefreshCw size={14} />
                            )}
                            Sync SC
                        </button>
                    )}
                    <button
                        className="btn btn-secondary btn-sm inline-flex items-center gap-1.5"
                        onClick={() => onMatchmaking(attendee)}
                        title="View Matchmaking Answers"
                    >
                        <HeartHandshake size={14} />
                        Matchmaking
                    </button>
                    <button
                        className="btn btn-secondary btn-sm inline-flex items-center gap-1.5"
                        onClick={() => onCreateEBadge(attendee.uuid)}
                        title="Re-create E-badge"
                    >
                        <IdCard size={14} />
                        Re-create E-badge
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AttendeeTableRow;
