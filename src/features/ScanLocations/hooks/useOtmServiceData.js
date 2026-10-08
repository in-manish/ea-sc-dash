import { useCallback, useState } from 'react';
import { getOtmBadgePermissions, getOtmFormQuestion } from '../api/otmPermissionsApi';
import { collectPurchaseRows } from '../domain/collectPurchaseRows';
import { parseOtmOptions, parseOtmPurchases } from '../domain/parseOtmData';

/** Fetch the options and the purchases from SurveyJS. Nothing is written to EA here. */
export default function useOtmServiceData(token, eventCode) {
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [purchaseProgress, setPurchaseProgress] = useState(null);

  const run = useCallback(async (kind, fetcher, parser, formValue, extraQuery = '') => {
    if (!formValue) {
      setError('Choose a form first.');
      return null;
    }
    setLoading(kind);
    setError('');
    try {
      return parser(await fetcher(token, eventCode, formValue, extraQuery));
    } catch (err) {
      setError(err.message || 'The SurveyJS request failed.');
      return null;
    } finally {
      setLoading('');
    }
  }, [token, eventCode]);

  const fetchOptions = useCallback(
    (formValue, extraQuery) => run('options', getOtmFormQuestion, parseOtmOptions, formValue, extraQuery),
    [run],
  );
  const fetchPurchases = useCallback(async (formValue, extraQuery = '') => {
    if (!formValue) {
      setError('Choose a form first.');
      return null;
    }
    setLoading('purchases');
    setError('');
    setPurchaseProgress({ page: 1, totalPages: 1, loaded: 0, total: 0 });
    try {
      const { rows, pages } = await collectPurchaseRows(
        (page, size) => getOtmBadgePermissions(token, eventCode, formValue, extraQuery, page, size),
        setPurchaseProgress,
      );
      return { ...parseOtmPurchases({ data: { data: rows } }), pages };
    } catch (err) {
      setError(err.message || 'The SurveyJS request failed.');
      return null;
    } finally {
      setLoading('');
      setPurchaseProgress(null);
    }
  }, [token, eventCode]);

  return { loading, error, purchaseProgress, clearError: () => setError(''), fetchOptions, fetchPurchases };
}
