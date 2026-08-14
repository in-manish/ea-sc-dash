import { useCallback, useEffect, useState } from 'react';

/** Page-scoped multi-select for exhibitor list remind actions. */
export function useExhibitorListSelection(companies) {
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  useEffect(() => {
    setSelectedIds(new Set());
  }, [companies]);

  const pageIds = (companies || []).map((c) => c.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  const toggle = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const togglePage = useCallback(() => {
    const ids = (companies || []).map((c) => c.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const everySelected = ids.length > 0 && ids.every((id) => next.has(id));
      if (everySelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  }, [companies]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    allPageSelected,
    somePageSelected,
    toggle,
    togglePage,
    clear,
  };
}
