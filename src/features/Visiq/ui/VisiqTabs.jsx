import { Upload, Users } from 'lucide-react';

const TABS = [
  { id: 'subscribers', label: 'Subscribers', icon: Users },
  { id: 'imports', label: 'Imports', icon: Upload },
];

export default function VisiqTabs({ activeTab, onChange }) {
  return (
    <div className="flex flex-wrap border-b border-border mb-4 gap-1">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`px-3.5 py-2 font-medium text-sm flex items-center gap-2 border-b-2 -mb-px transition-colors duration-150 ${
              active
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={16} className={active ? 'text-accent' : 'text-text-tertiary'} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
