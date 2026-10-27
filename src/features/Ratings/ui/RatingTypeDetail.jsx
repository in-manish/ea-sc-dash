import { useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAlert } from '../../../contexts/AlertContext';
import { STARTER_SCALE, DEFAULT_SCALE_COLORS } from '../constants';
import { useRatingScale } from '../hooks/useRatingScale';
import OptionForm from './OptionForm';
import RatingModal from './RatingModal';
import RatingNotice from './RatingNotice';
import RatingTypeForm from './RatingTypeForm';
import ScaleCard from './ScaleCard';
import ScaleForm from './ScaleForm';

export default function RatingTypeDetail({ type, token, onUnauthorized, onUpdateType, onDeleteType }) {
  const { showConfirm } = useAlert();
  const data = useRatingScale({ token, typeId: type.id, onUnauthorized });
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const close = () => setModal(null);

  const guarded = async (fn) => {
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    }
  };
  const confirmDelete = async (message, title, fn) => {
    if (await showConfirm(message, { title, confirmText: 'Delete', variant: 'danger' })) guarded(fn);
  };
  const save = (call) => async (body) => {
    await call(body);
    close();
  };

  const addStarter = () =>
    guarded(async () => {
      for (const item of STARTER_SCALE) {
        await data.createScale({ rating_value: item.value, label: item.label, color_code: DEFAULT_SCALE_COLORS[item.value], display_order: item.value, is_active: true });
      }
    });

  const nextValue = Math.max(0, ...data.scales.map((s) => s.value)) + 1;

  return (
    <div className="flex flex-col gap-5 min-w-0">
      <header className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-[14rem]">
          <h2 className="text-lg font-semibold text-text-primary m-0">{type.name}</h2>
          <p className="text-sm text-text-secondary mt-1 mb-0">{type.description || 'No description.'}</p>
          <p className="text-xs text-text-tertiary mt-1 mb-0">{type.categoryLabel} rating{type.isActive ? '' : ' · inactive'}</p>
        </div>
        <button type="button" onClick={() => setModal({ kind: 'type' })} className="h-9 px-3 rounded-md border border-border text-sm font-semibold text-text-secondary hover:bg-bg-secondary inline-flex items-center gap-2">
          <Pencil size={14} /> Edit
        </button>
        <button
          type="button"
          onClick={() => confirmDelete(
            `Delete "${type.name}"? This also deletes its scale, its options and every rating already given with it. To stop using it, set it inactive instead.`,
            'Delete rating type',
            () => onDeleteType(type.id),
          )}
          className="h-9 px-3 rounded-md border border-red-500/30 text-sm font-semibold text-red-600 hover:bg-red-500/10 inline-flex items-center gap-2"
        >
          <Trash2 size={14} /> Delete
        </button>
      </header>

      <RatingNotice text={error || data.error} />

      {data.loading && !data.scales.length ? (
        <div className="flex items-center gap-2 text-sm text-text-tertiary"><Loader2 size={16} className="animate-spin" /> Loading scale…</div>
      ) : data.scales.length ? (
        <div className="flex flex-col gap-3">
          {data.scales.map((scale) => (
            <ScaleCard
              key={scale.id}
              scale={scale}
              onEditScale={(s) => setModal({ kind: 'scale', scale: s })}
              onDeleteScale={(s) => confirmDelete(`Delete value ${s.value} (${s.label || 'no label'}) and its ${s.options.length} option(s)?`, 'Delete rating value', () => data.removeScale(s.id))}
              onAddOption={(s) => setModal({ kind: 'option', scale: s })}
              onEditOption={(s, option) => setModal({ kind: 'option', scale: s, option })}
              onDeleteOption={(s, option) => confirmDelete(`Delete option "${option.title}"?`, 'Delete option', () => data.removeOption(option.id))}
            />
          ))}
          <button type="button" onClick={() => setModal({ kind: 'scale' })} className="h-10 rounded-md border border-dashed border-border text-sm font-semibold text-accent hover:bg-accent/5 inline-flex items-center justify-center gap-2">
            <Plus size={16} /> Add rating value
          </button>
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-xl p-8 text-center flex flex-col items-center gap-3">
          <p className="text-sm text-text-secondary m-0">This type has no scale yet. Users need values to pick from.</p>
          <div className="flex gap-2">
            <button type="button" onClick={addStarter} className="h-10 px-4 rounded-md bg-accent text-white text-sm font-semibold hover:opacity-90">Add 1–5 starter scale</button>
            <button type="button" onClick={() => setModal({ kind: 'scale' })} className="h-10 px-4 rounded-md border border-border text-sm font-semibold text-text-secondary hover:bg-bg-secondary">Add one value</button>
          </div>
        </div>
      )}

      {modal?.kind === 'type' && (
        <RatingModal title="Edit rating type" onClose={close}>
          <RatingTypeForm type={type} onClose={close} onSave={save((body) => onUpdateType(type.id, body))} />
        </RatingModal>
      )}
      {modal?.kind === 'scale' && (
        <RatingModal title={modal.scale ? `Edit value ${modal.scale.value}` : 'Add rating value'} onClose={close}>
          <ScaleForm
            scale={modal.scale}
            nextValue={nextValue}
            onClose={close}
            onSave={save((body) => (modal.scale ? data.updateScale(modal.scale.id, body) : data.createScale(body)))}
          />
        </RatingModal>
      )}
      {modal?.kind === 'option' && (
        <RatingModal title={modal.option ? 'Edit option' : 'Add option'} subtitle={`For value ${modal.scale.value}${modal.scale.label ? ` · ${modal.scale.label}` : ''}`} onClose={close}>
          <OptionForm
            option={modal.option}
            nextOrder={modal.scale.options.length + 1}
            onClose={close}
            onSave={save((body) => (modal.option ? data.updateOption(modal.option.id, body) : data.createOption(modal.scale.id, body)))}
          />
        </RatingModal>
      )}
    </div>
  );
}
