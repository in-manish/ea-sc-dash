import { BarChart2, List, RefreshCw } from 'lucide-react';

const TABS = [
  { id: 'list', label: 'List Meetings', icon: List },
  { id: 'restore', label: 'Restore Meeting', icon: RefreshCw },
  { id: 'stats', label: 'Meeting Stats Report', icon: BarChart2 },
];

export default function MeetingsTabs({ activeTab, onChange }) {
  return (
    <div className="flex flex-wrap border-b border-border mb-6 gap-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`px-4 py-2.5 font-medium text-[0.925rem] flex items-center gap-2 border-b-2 transition-all duration-200 ${
              active
                ? 'border-accent text-accent bg-accent/5 rounded-t-lg'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-t-lg'
            }`}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={18} className={active ? 'text-accent' : 'text-text-tertiary'} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
