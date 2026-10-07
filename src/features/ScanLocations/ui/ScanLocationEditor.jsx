import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import PermissionIdPicker from './PermissionIdPicker';

export default function ScanLocationEditor({ location, codes, codesReady, saving, onCancel, onSave }) {
  const [name, setName] = useState(location.name);
  const [specialPermission, setSpecialPermission] = useState(location.specialPermission);
  const [selected, setSelected] = useState(() => location.permissions.map((item) => item.id));
  const [error, setError] = useState('');

  const save = () => {
    if (!name.trim()) {
      setError('Location name is required.');
      return;
    }
    setError('');
    onSave({ name: name.trim(), permissionIds: selected, specialPermission });
  };

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <p className="text-xs text-text-tertiary m-0 leading-relaxed">
        The name is required. Permissions replace the whole list with ids. An empty list is open entry.
        Special is saved with this checkbox, including when every code is cleared.
      </p>
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
        emptyHint="No codes yet. Add them on the Permission codes tab."
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="h-10 px-4 rounded-md bg-accent text-white text-sm font-semibold disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save location'}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="h-10 px-4 text-sm text-text-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
