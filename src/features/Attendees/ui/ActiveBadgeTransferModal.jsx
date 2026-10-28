import { useState, useEffect, useRef } from 'react';
import { X, Loader2, ArrowRight, Search, User } from 'lucide-react';

const ActiveBadgeTransferModal = ({
  isOpen,
  sourceAttendee,
  transferring = false,
  searching = false,
  searchResults = [],
  result,
  onSearch,
  onTransfer,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState(null);
  const searchTimeout = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedTarget(null);
    }
  }, [isOpen]);

  // Auto-select first result when results change (and no target selected)
  useEffect(() => {
    if (!selectedTarget && searchResults.length > 0 && sourceAttendee) {
      const firstValid = searchResults.find((a) => a.uuid !== sourceAttendee.uuid);
      if (firstValid) {
        setSelectedTarget(firstValid);
      }
    }
  }, [searchResults, selectedTarget, sourceAttendee]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!searchQuery.trim() || searchQuery.length < 2) return;
    
    searchTimeout.current = setTimeout(() => {
      onSearch?.(searchQuery.trim());
    }, 300);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, onSearch]);

  if (!isOpen) return null;

  const canSubmit = sourceAttendee && selectedTarget && !transferring;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onTransfer(sourceAttendee.reg_id, selectedTarget.reg_id);
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedTarget(null);
    onClose?.();
  };

  const handleSelectTarget = (attendee) => {
    setSelectedTarget(attendee);
    setSearchQuery('');
  };

  // Filter out the source from search results
  const filteredResults = searchResults.filter(
    (a) => a.uuid !== sourceAttendee?.uuid
  );

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="presentation"
    >
      <div
        className="bg-bg-primary border border-border rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-modal-title"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
          <div className="min-w-0">
            <h2
              id="transfer-modal-title"
              className="text-base font-semibold text-text-primary"
            >
              Transfer Active Badge
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Move active badge to another attendee
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost p-2 shrink-0"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-auto px-5 py-4 space-y-4">
          {/* Source Badge */}
          <div>
            <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
              From (Source)
            </label>
            {sourceAttendee ? (
              <div className="p-3 bg-bg-secondary rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <User size={20} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary truncate">
                      {sourceAttendee.name || 'No name'}
                    </p>
                    <p className="text-sm text-text-secondary truncate">
                      {sourceAttendee.email || sourceAttendee.phone_number || 'No contact'}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      Reg ID: {sourceAttendee.reg_id}
                      {sourceAttendee.evc_id && ` • SC: ${sourceAttendee.evc_id}`}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-tertiary">No source selected</p>
            )}
          </div>

          <div className="flex justify-center">
            <ArrowRight size={20} className="text-text-tertiary" />
          </div>

          {/* Target Search/Selection */}
          <div>
            <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
              To (Target)
            </label>
            
            <div className="space-y-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  className="input w-full pl-9"
                  placeholder="Search by email or phone..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) setSelectedTarget(null);
                  }}
                  disabled={transferring}
                />
                {searching && (
                  <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-text-tertiary" />
                )}
              </div>

              {/* Results list */}
              {filteredResults.length > 0 && (
                <div className="border border-border rounded-lg max-h-48 overflow-auto">
                  {filteredResults.slice(0, 5).map((attendee) => {
                    const isSelected = selectedTarget?.uuid === attendee.uuid;
                    return (
                      <button
                        key={attendee.uuid}
                        type="button"
                        className={`w-full px-3 py-2 text-left transition-colors border-b border-border last:border-b-0 ${
                          isSelected 
                            ? 'bg-accent/10 border-l-2 border-l-accent' 
                            : 'hover:bg-bg-secondary'
                        }`}
                        onClick={() => handleSelectTarget(attendee)}
                      >
                        <p className={`font-medium text-sm truncate ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                          {attendee.name || 'No name'}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {attendee.email || attendee.phone_number || 'No contact'}
                          {attendee.reg_id && ` • Reg: ${attendee.reg_id}`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {searchQuery.length >= 2 && !searching && filteredResults.length === 0 && (
                <p className="text-sm text-text-tertiary text-center py-2">
                  No attendees found
                </p>
              )}
            </div>
          </div>

          {/* Result message */}
          {result && (
            <div
              className={`p-3 rounded-lg text-sm ${
                result.success
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {result.success ? (
                <div>
                  <p className="font-medium">Transfer successful</p>
                  <p className="mt-1 text-xs opacity-80">
                    Active badge moved to {selectedTarget?.name || result.target_reg_id}
                  </p>
                </div>
              ) : (
                <p>{result.error || 'Transfer failed'}</p>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-border flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            {result?.success ? 'Done' : 'Cancel'}
          </button>
          {!result?.success && (
            <button
              type="button"
              className="btn btn-primary inline-flex items-center"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {transferring && (
                <Loader2 size={16} className="animate-spin mr-2" />
              )}
              {transferring ? 'Transferring…' : 'Transfer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveBadgeTransferModal;
