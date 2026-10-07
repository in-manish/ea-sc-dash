import { useCallback, useEffect, useRef, useState } from 'react';
import { getServiceOptions, pushServiceOptions, saveServiceMapping } from '../api/permissionSourcesApi';
import { parseMappingResult, parsePushResult, parseServiceOptions } from '../domain/parsePermissionSources';

/** The SurveyJS options saved in EA, with their mapping. Organizer only: a 403 sets `denied`. */
export default function useServiceOptions(eventId, token, onUnauthorized) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [denied, setDenied] = useState(false);
  const onUnauthorizedRef = useRef(onUnauthorized);
  onUnauthorizedRef.current = onUnauthorized;

  const fail = useCallback((err, fallback) => {
    setError(err.message || fallback);
    if (err.status === 403) setDenied(true);
    if (err.status === 401) onUnauthorizedRef.current?.();
  }, []);

  const load = useCallback(async () => {
    if (!eventId || !token) {
      setOptions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setOptions(parseServiceOptions(await getServiceOptions(token, eventId)));
      setDenied(false);
    } catch (err) {
      fail(err, 'Failed to load the SurveyJS options.');
    } finally {
      setLoading(false);
    }
  }, [eventId, token, fail]);

  useEffect(() => {
    load();
  }, [load]);

  const push = async (list) => {
    setSaving(true);
    setError('');
    try {
      const result = parsePushResult(await pushServiceOptions(token, eventId, list));
      setNotice(`${result.saved} option(s) saved.${result.errors.length ? ` ${result.errors.length} had errors.` : ''}`);
      await load();
      return result;
    } catch (err) {
      fail(err, 'Failed to save the SurveyJS options.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const saveMapping = async (entries) => {
    setSaving(true);
    setError('');
    try {
      const result = parseMappingResult(await saveServiceMapping(token, eventId, entries));
      const waiting = result.resolved ? ` ${result.resolved} waiting attendee(s) were updated.` : '';
      setNotice(`${result.saved} mapping(s) saved.${waiting}`);
      if (result.errors.length) setError(result.errors.map((row) => `${row.id}: ${row.message}`).join('\n'));
      await load();
      return result;
    } catch (err) {
      fail(err, 'Failed to save the mapping.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  return {
    options, loading, saving, error, notice, denied, push, saveMapping, refresh: load,
    clearError: () => setError(''), clearNotice: () => setNotice(''),
  };
}
