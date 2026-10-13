import { useCallback, useState } from 'react';

/** Either a list of chosen uuids, or "all" attendees matching the applied filter. */
export function useAttendeeSelection(initial = null) {
  const [selectedUuids, setSelectedUuids] = useState(initial?.selectedUuids || []);
  const [selectAll, setSelectAll] = useState(Boolean(initial?.selectAll));

  const clear = useCallback(() => {
    setSelectedUuids([]);
    setSelectAll(false);
  }, []);

  const toggleOne = useCallback((uuid) => {
    setSelectedUuids((prev) =>
      prev.includes(uuid) ? prev.filter((item) => item !== uuid) : [...prev, uuid],
    );
  }, []);

  const togglePage = useCallback((rows) => {
    const uuids = rows.map((row) => row.uuid);
    setSelectedUuids((prev) => {
      const allChosen = uuids.every((uuid) => prev.includes(uuid));
      if (allChosen) return prev.filter((uuid) => !uuids.includes(uuid));
      return [...new Set([...prev, ...uuids])];
    });
  }, []);

  return { selectedUuids, selectAll, setSelectAll, clear, toggleOne, togglePage };
}
