import { useState } from 'react';
import useUserSavedCards from '../hooks/useUserSavedCards';
import useUserCardRequests from '../hooks/useUserCardRequests';
import useUserPendingCards from '../hooks/useUserPendingCards';
import useSavedCardMutations from '../hooks/useSavedCardMutations';
import { getSavedCardId } from '../domain/savedCardHelpers';
import SavedCardDetail from './SavedCardDetail';
import SavedCardsTab from './SavedCardsTab';
import CardRequestActivityTab from './CardRequestActivityTab';
import PendingCardsTab from './PendingCardsTab';
import PermanentDeleteCardModal from './PermanentDeleteCardModal';

/** Card tabs body (saved / pending / activity) for the user detail panel. */
export default function UserCardsSection({
  userId,
  token,
  enabled,
  tab,
  selectedCard,
  onSelectCard,
  activityStatus,
  onActivityStatusChange,
  pendingDirection,
  onPendingDirectionChange,
}) {
  const [savedScope, setSavedScope] = useState('active');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const archived = savedScope === 'archived';
  const saved = useUserSavedCards({
    userId,
    token,
    enabled: enabled && tab === 'saved',
    archived,
  });
  const mutations = useSavedCardMutations({ userId, token });
  const pending = useUserPendingCards({
    userId,
    token,
    enabled: enabled && tab === 'pending',
    direction: pendingDirection,
  });
  const activity = useUserCardRequests({
    userId,
    token,
    enabled: enabled && tab === 'activity',
    status: activityStatus,
  });

  const handleScopeChange = (scope) => {
    onSelectCard(null);
    mutations.clearError();
    setSavedScope(scope);
  };

  const handleRestore = async (card) => {
    try {
      await mutations.restore(card);
      saved.removeLocal(getSavedCardId(card));
      if (selectedCard && getSavedCardId(selectedCard) === getSavedCardId(card)) {
        onSelectCard(null);
      }
      setSavedScope('active');
    } catch {
      /* error surfaced via mutations.error */
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await mutations.permanentlyDelete(deleteTarget);
      saved.removeLocal(getSavedCardId(deleteTarget));
      if (selectedCard && getSavedCardId(selectedCard) === getSavedCardId(deleteTarget)) {
        onSelectCard(null);
      }
      setDeleteTarget(null);
    } catch {
      /* keep modal open; error on mutations */
    }
  };

  return (
    <>
      {selectedCard ? (
        <SavedCardDetail
          card={selectedCard}
          onBack={() => onSelectCard(null)}
          archived={archived && tab === 'saved'}
          isBusy={mutations.isBusy(selectedCard)}
          onRestore={tab === 'saved' ? handleRestore : undefined}
          onRequestDelete={tab === 'saved' ? setDeleteTarget : undefined}
        />
      ) : tab === 'saved' ? (
        <SavedCardsTab
          cards={saved.cards}
          isLoading={saved.isLoading}
          error={saved.error}
          scope={savedScope}
          onScopeChange={handleScopeChange}
          onSelect={onSelectCard}
          onRestore={handleRestore}
          onRequestDelete={setDeleteTarget}
          busyCardId={mutations.busyCardId}
          actionError={mutations.error}
        />
      ) : tab === 'pending' ? (
        <PendingCardsTab
          cards={pending.cards}
          count={pending.count}
          page={pending.page}
          hasNext={pending.hasNext}
          hasPrev={pending.hasPrev}
          isLoading={pending.isLoading}
          error={pending.error}
          direction={pendingDirection}
          onDirectionChange={onPendingDirectionChange}
          onPrev={pending.goPrev}
          onNext={pending.goNext}
          onSelect={onSelectCard}
        />
      ) : (
        <CardRequestActivityTab
          items={activity.items}
          count={activity.count}
          page={activity.page}
          hasNext={activity.hasNext}
          hasPrev={activity.hasPrev}
          isLoading={activity.isLoading}
          error={activity.error}
          status={activityStatus}
          onStatusChange={onActivityStatusChange}
          onPrev={activity.goPrev}
          onNext={activity.goNext}
          onSelectCard={onSelectCard}
        />
      )}

      {deleteTarget && (
        <PermanentDeleteCardModal
          card={deleteTarget}
          isSubmitting={mutations.isBusy(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
