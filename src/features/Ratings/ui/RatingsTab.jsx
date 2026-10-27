import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRatingTypes } from '../hooks/useRatingTypes';
import RatingModal from './RatingModal';
import RatingNotice from './RatingNotice';
import RatingTypeDetail from './RatingTypeDetail';
import RatingTypeForm from './RatingTypeForm';
import RatingTypeList from './RatingTypeList';

/** Meetings → Ratings. Pick a rating type (`?type=<id>`) to edit its scale and feedback options. */
export default function RatingsTab() {
  const { token, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { types, loading, error, denied, create, update, remove } = useRatingTypes({ token, onUnauthorized: logout });
  const [creating, setCreating] = useState(false);

  const selectedId = Number(searchParams.get('type')) || types[0]?.id || null;
  const selected = types.find((t) => t.id === selectedId) || null;
  const select = (id) =>
    setSearchParams((params) => {
      if (id) params.set('type', String(id));
      else params.delete('type');
      return params;
    });

  if (denied) return <RatingNotice text="Organizer access required to manage ratings." />;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <p className="text-sm text-text-secondary m-0">
        Set up what attendees can rate (meetings, profiles…), the values they pick from, and the reasons they can tick for each value.
      </p>
      <RatingNotice text={error} />
      {loading && !types.length ? (
        <div className="flex items-center gap-2 text-sm text-text-tertiary"><Loader2 size={16} className="animate-spin" /> Loading rating types…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-6 items-start">
          <RatingTypeList types={types} selectedId={selectedId} onSelect={select} onCreate={() => setCreating(true)} />
          {selected ? (
            <RatingTypeDetail
              key={selected.id}
              type={selected}
              token={token}
              onUnauthorized={logout}
              onUpdateType={update}
              onDeleteType={async (id) => {
                await remove(id);
                select(null);
              }}
            />
          ) : (
            <p className="text-sm text-text-tertiary m-0">No rating types yet. Create the first one.</p>
          )}
        </div>
      )}
      {creating && (
        <RatingModal title="New rating type" onClose={() => setCreating(false)}>
          <RatingTypeForm
            type={null}
            onClose={() => setCreating(false)}
            onSave={async (body) => {
              const result = await create(body);
              setCreating(false);
              if (result?.data?.id) select(result.data.id);
            }}
          />
        </RatingModal>
      )}
    </div>
  );
}
