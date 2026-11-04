import React from 'react';
import { ArrowUpRight, Search } from 'lucide-react';

/** Marks a title as the Offering side (question title) or the Seeking side (title_seeking). */
const SIDES = {
    offering: {
        label: 'Offering',
        Icon: ArrowUpRight,
        className: 'text-accent bg-accent/10 border-accent/25',
    },
    seeking: {
        label: 'Seeking',
        Icon: Search,
        className: 'text-status-success bg-status-success/5 border-status-success/20',
    },
};

const MatchSideBadge = ({ side }) => {
    const config = SIDES[side];
    if (!config) return null;
    const { label, Icon, className } = config;
    return (
        <span className={`inline-flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider align-middle ${className}`}>
            <Icon size={9} /> {label}
        </span>
    );
};

export default MatchSideBadge;
