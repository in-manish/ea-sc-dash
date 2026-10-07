import { useRef, useState } from 'react';
import { runServiceBackfill } from '../api/permissionSourcesApi';
import { chunkRecords } from '../domain/parseOtmData';
import { parseBackfillResult } from '../domain/parsePermissionSources';

const EMPTY = { records: 0, added: 0, alreadyMapped: 0, unmappedOption: 0, unknownBadge: 0, skipped: 0, error: 0 };

/** Send records to EA's backfill in chunks of 500 and add the totals up. A failed chunk stops the run. */
export default function useServiceBackfill(eventId, token, onUnauthorized) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const onUnauthorizedRef = useRef(onUnauthorized);
  onUnauthorizedRef.current = onUnauthorized;

  const run = async ({ records, dryRun, retryPending }) => {
    const chunks = chunkRecords(records);
    setRunning(true);
    setError('');
    setResult(null);
    setProgress({ done: 0, total: chunks.length });
    const merged = { totals: { ...EMPTY }, results: [], batchIds: [], retry: null, dryRun: Boolean(dryRun) };
    try {
      const calls = chunks.length ? chunks : [[]];
      for (let i = 0; i < calls.length; i += 1) {
        const last = i === calls.length - 1;
        const part = parseBackfillResult(await runServiceBackfill(token, eventId, {
          records: calls[i], dryRun, retryPending: Boolean(retryPending) && last,
        }));
        Object.keys(EMPTY).forEach((key) => { merged.totals[key] += part.totals[key] || 0; });
        merged.results.push(...part.results);
        if (part.batchId) merged.batchIds.push(part.batchId);
        if (part.retry) merged.retry = part.retry;
        setProgress({ done: i + 1, total: calls.length });
      }
      setResult(merged);
    } catch (err) {
      setError(err.message || 'Failed to run the backfill.');
      if (err.status === 401) onUnauthorizedRef.current?.();
      if (merged.batchIds.length) setResult(merged);
    } finally {
      setRunning(false);
    }
  };

  return { run, running, progress, result, error, clearError: () => setError('') };
}
