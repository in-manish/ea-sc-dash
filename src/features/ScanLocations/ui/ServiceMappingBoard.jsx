import { useRef, useState } from 'react';
import { permissionIdList } from '../domain/permissionIds';
import usePersistedState from '../hooks/usePersistedState';
import ServiceMappingLines from './ServiceMappingLines';
import ServiceOptionList from './ServiceOptionList';
import ServicePermissionList from './ServicePermissionList';

function sameIds(left, right) {
  const a = [...left].sort((x, y) => x - y);
  const b = [...right].sort((x, y) => x - y);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

/** Two lists side by side. You pick an option, tick its permissions, and save. No mapping is made for you. */
export default function ServiceMappingBoard({ eventId, options, codes, codesReady, saving, onSave }) {
  const [selectedId, setSelectedId] = usePersistedState(`ea_service_mapping:${eventId}:option`, '');
  const [view, setView] = useState('all');
  const [edits, setEdits] = useState({});
  const boardRef = useRef(null);

  const saved = (option) => permissionIdList(option.targets);
  const chosenFor = (option) => edits[option.id] ?? saved(option);
  const isChanged = (option) => edits[option.id] !== undefined && !sameIds(edits[option.id], saved(option));
  const changed = options.filter(isChanged);
  const selected = options.find((option) => option.id === selectedId) || null;
  const pendingCodes = Object.fromEntries(changed.map((option) => [
    option.id,
    codes.filter((code) => chosenFor(option).includes(code.id)).map((code) => code.code),
  ]));

  const toggle = (permissionId) => {
    const current = chosenFor(selected);
    const next = current.includes(permissionId) ? current.filter((id) => id !== permissionId) : [...current, permissionId];
    setEdits((all) => ({ ...all, [selected.id]: next }));
  };
  const clear = (ids) => setEdits((all) => {
    const next = { ...all };
    ids.forEach((id) => delete next[id]);
    return next;
  });
  const save = async (list) => {
    const result = await onSave(list.map((option) => ({ source_option_id: option.id, permission_ids: chosenFor(option) })));
    if (result) clear(list.map((option) => option.id));
  };

  if (options.length === 0) {
    return (
      <p className="m-0 rounded-2xl border border-dashed border-border py-10 text-center text-sm text-text-secondary">
        No SurveyJS options yet. Fetch them from SurveyJS, or paste them above.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
        <span><span className="font-semibold text-green-700">Green</span> timing and name agree</span>
        <span><span className="font-semibold text-amber-700">Amber</span> name differs, or timing cannot be confirmed</span>
        <span><span className="font-semibold text-red-700">Red</span> the date or time does not match</span>
      </p>
      {changed.length > 1 ? (
        <div className="flex justify-end">
          <button type="button" disabled={saving} onClick={() => save(changed)}
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50">
            Save all unsaved mappings ({changed.length})
          </button>
        </div>
      ) : null}
      <div ref={boardRef} className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 items-start">
        <ServiceOptionList options={options} selectedId={selectedId} edited={changed.map((option) => option.id)}
          pendingCodes={pendingCodes} view={view} onView={setView} onSelect={setSelectedId} />
        <ServicePermissionList option={selected} codes={codes} codesReady={codesReady}
          chosen={selected ? chosenFor(selected) : []} changed={selected ? isChanged(selected) : false}
          saving={saving} onToggle={toggle} onSave={() => save([selected])} onUndo={() => clear([selected.id])} />
        <ServiceMappingLines boardRef={boardRef} optionId={selected?.id || ''}
          signature={selected ? [...chosenFor(selected)].sort((a, b) => a - b).join(',') : ''} />
      </div>
    </div>
  );
}
