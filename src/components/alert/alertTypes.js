import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const primaryBtn = 'btn btn-primary btn-sm px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px]';
const dangerBtn =
    'btn btn-sm px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-status-danger hover:opacity-90 text-white border-none';

export const ALERT_DEFAULT_TITLES = {
    info: 'Notice',
    success: 'Success',
    error: 'Error',
    confirm: 'Confirm',
};

export const ALERT_TYPE_STYLES = {
    info: {
        iconWrap: 'bg-accent/10 text-accent',
        Icon: Info,
        confirmClass: primaryBtn,
    },
    success: {
        iconWrap: 'bg-status-success/10 text-status-success',
        Icon: CheckCircle2,
        confirmClass: primaryBtn,
    },
    error: {
        iconWrap: 'bg-status-danger/10 text-status-danger',
        Icon: AlertCircle,
        confirmClass: dangerBtn,
    },
    confirm: {
        iconWrap: 'bg-accent/10 text-accent',
        Icon: AlertTriangle,
        confirmClass: primaryBtn,
    },
};

export function getAlertTypeStyle(type, variant = 'primary') {
    const style = ALERT_TYPE_STYLES[type] || ALERT_TYPE_STYLES.info;
    if (variant === 'danger') {
        return {
            ...style,
            iconWrap: ALERT_TYPE_STYLES.error.iconWrap,
            Icon: AlertTriangle,
            confirmClass: dangerBtn,
        };
    }
    return style;
}
