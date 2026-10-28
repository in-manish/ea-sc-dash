import { useState, useEffect, useRef } from 'react';
import { X, Loader2, ArrowRight, Search, User, BadgeCheck, RefreshCw } from 'lucide-react';

const ActiveBadgeTransferModal = ({
  isOpen,
  sourceAttendee,
  sourceActiveBadge,
  transferring = false,
  searching = false,
  checkingActiveBadge = false,
  searchResults = [],
  checkedActiveBadges = {},
  result,
  onSearch,
  onTransfer,
  onCheckActiveBadge,
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
        className="bg-bg-primary border border-border rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]"
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
              <div className="p-4 bg-bg-secondary rounded-lg border border-border">
                {/* Name row with badges */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <User size={18} className="text-accent" />
                  <span className="font-semibold text-text-primary text-base">
                    {sourceAttendee.name || 'No name'}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded">
                    {sourceAttendee.attendee_type || 'N/A'}
                  </span>
                </div>
                {/* Info grid - 2 columns */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-text-tertiary">Email</span>
                    <p className="text-text-primary font-medium truncate">{sourceAttendee.email || '—'}</p>
                  </div>
                  <div>
                    <span className="text-text-tertiary">Phone</span>
                    <p className="text-text-primary font-medium">{sourceAttendee.phone_number || '—'}</p>
                  </div>
                  <div>
                    <span className="text-text-tertiary">Reg ID</span>
                    <p className="text-text-primary font-mono">{sourceAttendee.reg_id || '—'}</p>
                  </div>
                  <div>
                    <span className="text-text-tertiary">UUID</span>
                    <p className="text-text-primary font-mono text-xs">{sourceAttendee.uuid || '—'}</p>
                  </div>
                  <div>
                    <span className="text-text-tertiary">EVC ID</span>
                    <p className="text-text-primary font-mono text-green-400">{sourceAttendee.evc_id || '—'}</p>
                  </div>
                  <div>
                    <span className="text-text-tertiary">Active Badge ID</span>
                    <p className="text-text-primary font-mono">
                      {sourceActiveBadge ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <BadgeCheck size={14} /> {sourceActiveBadge.id}
                        </span>
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
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
                <div className="border border-border rounded-lg max-h-96 overflow-auto divide-y divide-border">
                  {filteredResults.slice(0, 5).map((attendee) => {
                    const isSelected = selectedTarget?.uuid === attendee.uuid;
                    const hasEvcId = !!attendee.evc_id;
                    const checkedInfo = checkedActiveBadges[attendee.uuid];
                    return (
                      <div
                        key={attendee.uuid}
                        className={`p-4 transition-colors ${
                          isSelected 
                            ? 'bg-accent/10 border-l-4 border-l-accent' 
                            : 'hover:bg-bg-secondary'
                        }`}
                      >
                        {/* Name row with badges + actions */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <button
                            type="button"
                            className="flex items-center gap-2 flex-wrap text-left flex-1 min-w-0"
                            onClick={() => handleSelectTarget(attendee)}
                          >
                            <span className={`font-semibold ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                              {attendee.name || 'No name'}
                            </span>
                            <span className="px-2 py-0.5 text-xs font-medium bg-bg-tertiary text-text-secondary rounded">
                              {attendee.attendee_type || 'N/A'}
                            </span>
                            {hasEvcId && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded">
                                ⚠ Has SC
                              </span>
                            )}
                          </button>
                          {/* Check Active Badge button */}
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded border border-border hover:bg-bg-tertiary text-text-secondary flex items-center gap-1 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCheckActiveBadge?.(attendee.uuid);
                            }}
                            disabled={checkingActiveBadge}
                            title="Check EventActiveBadge"
                          >
                            <RefreshCw size={12} className={checkingActiveBadge ? 'animate-spin' : ''} />
                            Check
                          </button>
                        </div>
                        {/* Info grid - 3 columns */}
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={() => handleSelectTarget(attendee)}
                        >
                          <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-sm">
                            <div>
                              <span className="text-text-tertiary text-xs block">Email</span>
                              <span className="text-text-secondary truncate block">{attendee.email || '—'}</span>
                            </div>
                            <div>
                              <span className="text-text-tertiary text-xs block">Phone</span>
                              <span className="text-text-secondary">{attendee.phone_number || '—'}</span>
                            </div>
                            <div>
                              <span className="text-text-tertiary text-xs block">Reg ID</span>
                              <span className="text-text-secondary font-mono">{attendee.reg_id || '—'}</span>
                            </div>
                            <div>
                              <span className="text-text-tertiary text-xs block">UUID</span>
                              <span className="text-text-secondary font-mono text-xs">{attendee.uuid || '—'}</span>
                            </div>
                            <div>
                              <span className="text-text-tertiary text-xs block">EVC ID</span>
                              <span className={`font-mono ${attendee.evc_id ? 'text-yellow-400' : 'text-text-tertiary'}`}>
                                {attendee.evc_id || '—'}
                              </span>
                            </div>
                            <div>
                              <span className="text-text-tertiary text-xs block">Active Badge</span>
                              {checkedInfo === undefined ? (
                                <span className="text-text-tertiary text-xs">Click Check</span>
                              ) : checkedInfo === null ? (
                                <span className="text-text-tertiary">None</span>
                              ) : (
                                <span className="text-yellow-400 font-mono flex items-center gap-1">
                                  <BadgeCheck size={12} /> {checkedInfo.id}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      </div>
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
