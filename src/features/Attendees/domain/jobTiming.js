export const isUnderTwoHours = (createdAtStr) => {
    if (!createdAtStr) return false;
    const createdAt = new Date(createdAtStr);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 2;
};

export const getJobPollDelay = (pollCount) => {
    if (pollCount >= 20) return 20000;
    if (pollCount >= 10) return 5000;
    return 2000;
};

export const getJobStatusColor = (status) => {
    if (status === 'complete') return 'bg-emerald-100 text-emerald-800';
    if (status === 'in_progress') return 'bg-blue-100 text-blue-800 animate-pulse';
    if (status === 'failed') return 'bg-red-100 text-red-800';
    if (status === 'expired') return 'bg-yellow-100 text-yellow-800';
    return 'bg-slate-100 text-slate-800';
};
