import useUserSavedCards from '../hooks/useUserSavedCards';
import useUserCardRequests from '../hooks/useUserCardRequests';
import useUserPendingCards from '../hooks/useUserPendingCards';
import SavedCardDetail from './SavedCardDetail';
import SavedCardsTab from './SavedCardsTab';
import CardRequestActivityTab from './CardRequestActivityTab';
import PendingCardsTab from './PendingCardsTab';

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
  const saved = useUserSavedCards({
    userId,
    token,
    enabled: enabled && tab === 'saved',
  });
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

  if (selectedCard) {
    return <SavedCardDetail card={selectedCard} onBack={() => onSelectCard(null)} />;
  }

  if (tab === 'saved') {
    return (
      <SavedCardsTab
        cards={saved.cards}
        isLoading={saved.isLoading}
        error={saved.error}
        onSelect={onSelectCard}
      />
    );
  }

  if (tab === 'pending') {
    return (
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
    );
  }

  return (
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
  );
}
