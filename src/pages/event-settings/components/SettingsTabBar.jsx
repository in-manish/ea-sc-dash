import { ChevronDown } from 'lucide-react';

/**
 * Event Settings tab bar that never hides a tab.
 * Phone width: one dropdown listing every tab. Wider: tabs wrap onto extra rows instead of scrolling sideways.
 */
export default function SettingsTabBar({ tabs, activeTab, onChange }) {
    return (
        <div className="mb-6">
            <label className="sm:hidden block relative">
                <span className="sr-only">Settings section</span>
                <select
                    value={activeTab}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-border bg-bg-primary text-text-primary text-sm font-semibold py-2.5 pl-3 pr-9 focus:outline-none focus:border-accent"
                >
                    {tabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>{tab.label}</option>
                    ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            </label>

            <div role="tablist" className="hidden sm:flex flex-wrap gap-1.5 pb-3 border-b border-border">
                {tabs.map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => onChange(tab.id)}
                            className={`rounded-md border px-3.5 py-1.5 text-[13px] cursor-pointer transition-colors duration-150 ${
                                active
                                    ? 'border-accent text-accent bg-bg-secondary font-semibold'
                                    : 'border-transparent text-text-secondary font-medium hover:text-text-primary hover:bg-bg-secondary'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
