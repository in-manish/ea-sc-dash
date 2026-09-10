/** Format a duration in seconds as HH:MM:SS. */
export function formatProcessingTime(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    const h = String(Math.floor(total / 3600)).padStart(2, '0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}
