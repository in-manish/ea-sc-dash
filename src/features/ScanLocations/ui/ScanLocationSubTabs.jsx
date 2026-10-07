import { SCAN_LOCATION_PANELS } from '../domain/scanLocationPanels';

export default function ScanLocationSubTabs({ panel, onChange }) {
  return (
    <div className="flex border-b border-border gap-1 overflow-x-auto" role="tablist" aria-label="Scan location permission">
      {SCAN_LOCATION_PANELS.map((item) => {
        const active = item.id === panel;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-200 ${
              active
                ? 'border-accent text-accent bg-accent/5 rounded-t-lg'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-t-lg'
            }`}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
