import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { validateNewPermissionCode } from '../domain/permissionCodeForm';
import { permissionCodeCreateBody, validatePermissionWindow } from '../domain/permissionWindow';
import PermissionWindowFields from './PermissionWindowFields';

const inputClass = (invalid) =>
  `w-full h-10 px-3 border rounded-md text-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 ${
    invalid
      ? 'border-danger focus:ring-danger/20 focus:border-danger'
      : 'border-border focus:ring-accent/20 focus:border-accent'
  }`;

const EMPTY_WINDOW = {
  from_date: '',
  end_date: '',
  from_time: '',
  end_time: '',
  is_active: true,
};

export default function PermissionCodeForm({ onCreate }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [validity, setValidity] = useState(EMPTY_WINDOW);
  const [fields, setFields] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const checked = validateNewPermissionCode({ code, name });
    const nextFields = { ...checked.fields, ...validatePermissionWindow(validity) };
    if (Object.keys(nextFields).length) {
      setFields(nextFields);
      setMessage('Fix the highlighted fields before saving.');
      return;
    }
    setSaving(true);
    setFields({});
    setMessage('');
    try {
      await onCreate(permissionCodeCreateBody({ code: checked.code, name: checked.name, ...validity }));
      setCode('');
      setName('');
      setValidity(EMPTY_WINDOW);
    } catch (err) {
      setFields(err.fields || {});
      setMessage(err.message || 'Failed to create the permission code.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-bg-primary border border-border rounded-2xl p-5 shadow-sm space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-text-primary">Add a code</h2>
        <p className="text-xs text-text-tertiary mt-1">
          The letter or digit is stored in uppercase. Dates and times are optional.
        </p>
      </div>
      {message ? <p className="text-sm text-danger whitespace-pre-line m-0">{message}</p> : null}
      <div className="grid grid-cols-1 sm:grid-cols-[6rem_minmax(0,1fr)_auto] gap-3 items-start">
        <label className="block">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Code</span>
          <input
            value={code}
            maxLength={1}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className={`${inputClass(fields.code)} mt-1 text-center font-semibold uppercase`}
            aria-invalid={Boolean(fields.code)}
          />
          {fields.code ? <span className="text-xs text-danger mt-1 block">{fields.code}</span> : null}
        </label>
        <label className="block">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Name</span>
          <input
            value={name}
            maxLength={255}
            onChange={(e) => setName(e.target.value)}
            className={`${inputClass(fields.name)} mt-1`}
            aria-invalid={Boolean(fields.name)}
          />
          {fields.name ? <span className="text-xs text-danger mt-1 block">{fields.name}</span> : null}
        </label>
        <button
          type="submit"
          disabled={saving}
          className="sm:mt-5 h-10 px-4 rounded-md bg-accent text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : 'Add code'}
        </button>
      </div>
      <PermissionWindowFields value={validity} onChange={setValidity} errors={fields} />
    </form>
  );
}
