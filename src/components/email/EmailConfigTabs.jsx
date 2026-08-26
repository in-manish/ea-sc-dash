import { EMAIL_TAB_ITEMS } from './emailConfigTabs.js';

export default function EmailConfigTabs({ activeTab, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {EMAIL_TAB_ITEMS.map((item) => {
        const TabIcon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className={`px-4 py-2.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === item.id
                ? 'border-accent text-accent bg-bg-secondary/50 rounded-t-lg'
                : 'border-transparent text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary rounded-t-lg'
            }`}
            onClick={() => onChange(item.id)}
          >
            <TabIcon size={16} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
