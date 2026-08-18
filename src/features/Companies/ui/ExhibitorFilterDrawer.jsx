import { X } from 'lucide-react';
import ExhibitorFilterFields from './ExhibitorFilterFields';

export default function ExhibitorFilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilters,
  onReset,
  onPageReset,
}) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1100] transition-opacity duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute top-0 right-0 w-[400px] h-full bg-bg-primary shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold m-0 text-text-primary">Filters</h3>
          <button
            type="button"
            className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <ExhibitorFilterFields
            filters={filters}
            setFilters={setFilters}
            onPageReset={onPageReset}
          />
        </div>

        <div className="p-6 border-t border-border flex gap-4 bg-bg-secondary">
          <button type="button" className="btn btn-secondary w-full" onClick={onReset}>
            Reset All
          </button>
          <button type="button" className="btn btn-primary w-full" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
