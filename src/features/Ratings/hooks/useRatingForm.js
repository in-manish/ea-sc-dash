import { useCallback, useState } from 'react';

/**
 * Shared form submit: runs `validate(values)` (`{ ok, fields }`), then `submit()`.
 * A rejected submit shows the API message and maps field errors (400) next to the fields.
 */
export function useRatingForm({ values, validate, submit }) {
  const [fields, setFields] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const check = validate(values);
      setFields(check.fields);
      if (!check.ok) {
        setMessage('Fix the highlighted fields before saving.');
        return;
      }
      setSaving(true);
      setMessage('');
      try {
        await submit();
      } catch (err) {
        setFields(err.fields || {});
        setMessage(err.message || 'Could not save.');
        setSaving(false);
      }
    },
    [values, validate, submit],
  );

  return { fields, message, saving, handleSubmit };
}
