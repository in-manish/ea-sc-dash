import { ContactRound, History, Inbox } from 'lucide-react';
import UserCardsSection from './UserCardsSection';

const TABS = [
  { id: 'saved', label: 'Saved cards', icon: ContactRound },
  { id: 'pending', label: 'Pending', icon: Inbox },
  { id: 'activity', label: 'Activity', icon: History },
];

/** Lower section tabs — mirrors CompanyDetails co-exhibitors / matchmaking switcher. */
export default function UserDetailsCardsSection({
  userId,
  token,
  tab,
  onTabChange,
  selectedCard,
  onSelectCard,
  activityStatus,
  onActivityStatusChange,
  pendingDirection,
  onPendingDirectionChange,
}) {
  return (
    <div className="mt-8">
      {!selectedCard && (
        <div className="mb-6 flex items-center gap-1 p-1 bg-bg-secondary border border-border rounded-lg inline-flex flex-wrap">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 border-none cursor-pointer ${
                  active
                    ? 'bg-white text-accent shadow-sm'
                    : 'bg-transparent text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => onTabChange(t.id)}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="bg-bg-primary border border-border rounded-lg shadow-sm overflow-hidden min-h-[320px] flex flex-col">
        <UserCardsSection
          userId={userId}
          token={token}
          enabled
          tab={tab}
          selectedCard={selectedCard}
          onSelectCard={onSelectCard}
          activityStatus={activityStatus}
          onActivityStatusChange={onActivityStatusChange}
          pendingDirection={pendingDirection}
          onPendingDirectionChange={onPendingDirectionChange}
        />
      </div>
    </div>
  );
}
