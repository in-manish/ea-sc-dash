import { useCallback, useEffect, useState } from 'react';
import { sponsorPromoApi } from '../api/sponsorPromoApi';

export function useSponsorPromo({ eventId, token }) {
  const [pools, setPools] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [codes, setCodes] = useState(null);
  const [assignedFilter, setAssignedFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadPools = useCallback(async () => {
    if (!token || !eventId) return;
    setLoading(true);
    setError('');
    try {
      const data = await sponsorPromoApi.listPools(eventId, token);
      setPools(data.pools || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [eventId, token]);

  const loadCodes = useCallback(async () => {
    if (!token || !eventId || !selectedSlug) {
      setCodes(null);
      return;
    }
    try {
      setCodes(await sponsorPromoApi.listCodes(eventId, token, selectedSlug, assignedFilter));
    } catch (err) {
      setError(err.message);
    }
  }, [eventId, token, selectedSlug, assignedFilter]);

  useEffect(() => { loadPools(); }, [loadPools]);
  useEffect(() => { loadCodes(); }, [loadCodes]);

  // Run a write, refresh lists, and surface the error text instead of throwing.
  const run = useCallback(async (action, successMsg, { reloadCodes = true } = {}) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await action();
      if (successMsg) setNotice(typeof successMsg === 'function' ? successMsg(result) : successMsg);
      await Promise.all([loadPools(), reloadCodes ? loadCodes() : null]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }, [loadPools, loadCodes]);

  const createPool = (payload) => run(
    async () => {
      const pool = await sponsorPromoApi.createPool(eventId, token, payload);
      setSelectedSlug(pool.slug);
      return pool;
    },
    'Sponsor pool created.',
  );
  const togglePool = (pool) => run(
    () => sponsorPromoApi.updatePool(eventId, token, pool.slug, { is_active: !pool.is_active }),
    pool.is_active ? 'Pool turned off. No new codes will be given.' : 'Pool turned on.',
  );
  const updatePool = (pool, payload) => {
    const slugChanged = Boolean(payload.slug) && payload.slug !== pool.slug;
    return run(
      async () => {
        const updated = await sponsorPromoApi.updatePool(eventId, token, pool.slug, payload);
        // The codes effect reloads under the new slug; reloading under the old one would 404
        if (slugChanged && selectedSlug === pool.slug) setSelectedSlug(updated.slug);
        return updated;
      },
      'Pool updated.',
      { reloadCodes: !slugChanged },
    );
  };
  const importCodes = (file) => run(
    () => sponsorPromoApi.importCodes(eventId, token, selectedSlug, file),
    (r) => `Imported ${r.imported} code(s), skipped ${r.skipped} blank row(s).`,
  );
  const deleteCode = (codeId) => run(
    () => sponsorPromoApi.deleteCode(eventId, token, selectedSlug, codeId),
    'Code deleted.',
  );

  return {
    pools, selectedSlug, setSelectedSlug, codes, assignedFilter, setAssignedFilter,
    loading, busy, error, notice, createPool, togglePool, updatePool, importCodes, deleteCode,
  };
}
