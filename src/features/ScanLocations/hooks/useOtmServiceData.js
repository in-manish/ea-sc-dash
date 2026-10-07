import { useCallback, useState } from 'react';
import { getOtmBadgePermissions, getOtmFormQuestion } from '../api/otmPermissionsApi';
import { parseOtmOptions, parseOtmPurchases } from '../domain/parseOtmData';

/** Fetch the options and the purchases from SurveyJS. Nothing is written to EA here. */
export default function useOtmServiceData(token, eventCode) {
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const run = useCallback(async (kind, fetcher, parser, formValue) => {
    if (!formValue) {
      setError('Choose a form first.');
      return null;
    }
    setLoading(kind);
    setError('');
    try {
      return parser(await fetcher(token, eventCode, formValue));
    } catch (err) {
      setError(err.message || 'The SurveyJS request failed.');
      return null;
    } finally {
      setLoading('');
    }
  }, [token, eventCode]);

  const fetchOptions = useCallback(
    (formValue) => run('options', getOtmFormQuestion, parseOtmOptions, formValue),
    [run],
  );
  const fetchPurchases = useCallback(
    (formValue) => run('purchases', getOtmBadgePermissions, parseOtmPurchases, formValue),
    [run],
  );

  return { loading, error, clearError: () => setError(''), fetchOptions, fetchPurchases };
}
