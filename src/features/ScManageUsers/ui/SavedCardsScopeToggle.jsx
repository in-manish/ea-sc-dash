/** Active / Archived toggle for saved cards. */
export default function SavedCardsScopeToggle({ scope, onChange }) {
  const items = [
    { id: 'active', label: 'Active' },
    { id: 'archived', label: 'Archived' },
  ];

  return (
    <div className="flex items-center gap-1 p-0.5 bg-bg-secondary border border-border rounded-md shrink-0">
      {items.map((item) => {
        const active = scope === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded border-none cursor-pointer transition-colors ${
              active
                ? 'bg-white text-accent shadow-sm'
                : 'bg-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
