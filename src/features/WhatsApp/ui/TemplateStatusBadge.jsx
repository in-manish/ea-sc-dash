import React from 'react';
import { Clock, CheckCircle2, XCircle, PauseCircle, Ban } from 'lucide-react';
import { TEMPLATE_STATUS } from '../constants';
import { getStatusMeta } from '../domain/templateHelpers';

const STATUS_STYLES = {
    [TEMPLATE_STATUS.PENDING]: {
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        Icon: Clock,
    },
    [TEMPLATE_STATUS.APPROVED]: {
        className: 'bg-success/10 text-success border-success/20',
        Icon: CheckCircle2,
    },
    [TEMPLATE_STATUS.REJECTED]: {
        className: 'bg-danger/10 text-danger border-danger/20',
        Icon: XCircle,
    },
    [TEMPLATE_STATUS.PAUSED]: {
        className: 'bg-bg-tertiary text-text-secondary border-border',
        Icon: PauseCircle,
    },
    [TEMPLATE_STATUS.DISABLED]: {
        className: 'bg-bg-tertiary text-text-tertiary border-border',
        Icon: Ban,
    },
};

const SIZE_STYLES = {
    sm: 'px-2 py-0.5 text-[9px] gap-1',
    md: 'px-2.5 py-1 text-[10px] gap-1.5',
};

/**
 * Visual status chip for WhatsApp templates.
 */
const TemplateStatusBadge = ({ status, size = 'md', showIcon = true, className = '' }) => {
    const meta = getStatusMeta(status);
    const style = STATUS_STYLES[meta.value] || STATUS_STYLES[TEMPLATE_STATUS.PENDING];
    const Icon = style.Icon;

    return (
        <span
            title={meta.hint}
            className={`inline-flex items-center rounded-lg font-bold uppercase tracking-wider border ${style.className} ${SIZE_STYLES[size] || SIZE_STYLES.md} ${className}`}
        >
            {showIcon && <Icon size={size === 'sm' ? 10 : 12} strokeWidth={2.5} />}
            {meta.label}
        </span>
    );
};

export default TemplateStatusBadge;
