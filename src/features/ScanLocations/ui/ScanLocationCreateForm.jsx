import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import PermissionIdPicker from './PermissionIdPicker';

export default function ScanLocationCreateForm({ codes, codesReady, saving, onCreate }) {
  const [name, setName] = useState('');
  const [specialPermission, setSpecialPermission] = useState(false);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Location name is required.');
      return;
    }
    setError('');
    try {
      await onCreate({
        name: name.trim(),
        permissionIds: selected,
        specialPermission,
      });
      setName('');
      setSpecialPermission(false);
      setSelected([]);
    } catch (err) {
      setError(err.message || 'Failed to create the scan location.');
    }
  };

  return (
    <form onSubmit={submit} className="bg-bg-primary border border-border rounded-2xl p-5 shadow-sm space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-text-primary">Add a location</h2>
        <p className="text-xs text-text-tertiary mt-1">
          The name must be unique. A deleted name cannot be reused.
        </p>
      </div>
      {error ? <p className="text-sm text-danger m-0 whitespace-pre-line">{error}</p> : null}
      <label className="block">
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Location name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full h-10 px-3 border border-border rounded-md text-sm bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={specialPermission}
          onChange={(e) => setSpecialPermission(e.target.checked)}
        />
        Special permission
      </label>
      <PermissionIdPicker
        codes={codes}
        selected={selected}
        onChange={setSelected}
        ready={codesReady}
        emptyHint="No codes yet. Add them on the Permission codes tab. You can still create an open-entry location."
      />
      <button
        type="submit"
        disabled={saving}
        className="h-10 px-4 rounded-md bg-accent text-white text-sm font-semibold disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : 'Add location'}
      </button>
    </form>
  );
}
