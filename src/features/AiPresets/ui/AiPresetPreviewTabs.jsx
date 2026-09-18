export default function AiPresetPreviewTabs({ tabs, activeId, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-border" role="tablist">
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`px-3 py-2 text-xs font-semibold bg-transparent cursor-pointer rounded-t-md ${
              selected
                ? 'text-accent shadow-[inset_0_-2px_0_0_currentColor]'
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            {tab.label}
            {tab.meta ? (
              <span className="ml-1.5 font-normal text-text-tertiary">{tab.meta}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
