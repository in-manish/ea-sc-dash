import { EMAIL_TAB_GUIDE } from './emailConfigTabs.js';

/** Two short cards that explain the difference between Category Emails and Templates. */
export default function EmailTabGuide({ activeTab }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
      {EMAIL_TAB_GUIDE.map((item) => {
        const active = item.id === activeTab;
        return (
          <div
            key={item.id}
            className={`rounded-xl border p-3.5 ${active ? 'border-accent bg-accent/5' : 'border-border bg-bg-primary opacity-80'}`}
          >
            <p className="m-0 text-sm font-bold text-text-primary">{item.title}</p>
            <p className="m-0 mt-1 text-xs text-text-secondary">{item.use}</p>
            <p className="m-0 mt-1 text-xs text-text-tertiary">{item.example}</p>
          </div>
        );
      })}
    </div>
  );
}
