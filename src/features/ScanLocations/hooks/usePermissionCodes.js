import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createPermissionCode,
  deletePermissionCode,
  listPermissionCodes,
  updatePermissionCode,
} from '../api/permissionCodesApi';
import { canEditPermissionCodes } from '../domain/permissionCodeAccess';
import { parsePermissionCode, parsePermissionCodes } from '../domain/parsePermissionCodes';

export default function usePermissionCodes(eventId, token, onUnauthorized, user) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [canEdit, setCanEdit] = useState(() => canEditPermissionCodes(user));
  const onUnauthorizedRef = useRef(onUnauthorized);
  const editDeniedRef = useRef(false);
  onUnauthorizedRef.current = onUnauthorized;

  useEffect(() => {
    if (!editDeniedRef.current) setCanEdit(canEditPermissionCodes(user));
  }, [user]);

  const noteDenied = (err) => {
    if (err.status === 401) onUnauthorizedRef.current?.();
    if (err.status === 403) {
      editDeniedRef.current = true;
      setCanEdit(false);
      setError(err.message || 'Only an organizer can edit permission codes.');
    }
  };

  const load = useCallback(async () => {
    if (!eventId || !token) {
      setCodes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await listPermissionCodes(token, eventId);
      setCodes(parsePermissionCodes(data));
    } catch (err) {
      setCodes([]);
      setError(err.message || 'Failed to load permission codes.');
      if (err.status === 403) {
        editDeniedRef.current = true;
        setCanEdit(false);
      }
      if (err.status === 401) onUnauthorizedRef.current?.();
    } finally {
      setLoading(false);
    }
  }, [eventId, token]);

  useEffect(() => {
    load();
  }, [load]);

  const createCode = async (body) => {
    try {
      const created = parsePermissionCode(await createPermissionCode(token, eventId, body));
      setCodes((prev) => parsePermissionCodes([...prev, created]));
      setNotice(`Code ${created?.code || body.code} created.`);
      setError('');
      return created;
    } catch (err) {
      noteDenied(err);
      throw err;
    }
  };

  const updateCode = async (id, body) => {
    try {
      const updated = parsePermissionCode(await updatePermissionCode(token, eventId, id, body));
      setCodes((prev) => prev.map((row) => (row.id === id ? { ...row, ...updated } : row)));
      setNotice(`Code ${updated?.code || 'code'} saved.`);
      setError('');
      return updated;
    } catch (err) {
      noteDenied(err);
      if (err.status === 404) {
        await load();
        setError(err.message || 'Permission code does not exist.');
      }
      throw err;
    }
  };

  const removeCode = async (row) => {
    try {
      await deletePermissionCode(token, eventId, row.id);
      setCodes((prev) => prev.filter((item) => item.id !== row.id));
      setNotice(`Code ${row.code} deleted.`);
      setError('');
    } catch (err) {
      setNotice('');
      setError(err.message || 'Failed to delete the permission code.');
      noteDenied(err);
      if (err.status === 404) {
        await load();
        setError(err.message || 'Permission code does not exist.');
      }
      throw err;
    }
  };

  return {
    codes,
    loading,
    error,
    notice,
    clearNotice: () => setNotice(''),
    clearError: () => setError(''),
    canEdit,
    refresh: load,
    createCode,
    updateCode,
    removeCode,
  };
}
