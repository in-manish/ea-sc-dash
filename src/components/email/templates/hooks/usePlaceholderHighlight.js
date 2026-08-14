import { useCallback, useState } from 'react';

export default function usePlaceholderHighlight() {
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);

  const onHover = useCallback((name) => setHovered(name || null), []);
  const onLeave = useCallback(() => setHovered(null), []);
  const onToggle = useCallback((name) => {
    if (!name) return;
    setPinned((prev) => (prev === name ? null : name));
    setHovered(name);
  }, []);

  return {
    highlightName: hovered || pinned,
    pinnedName: pinned,
    onHover,
    onLeave,
    onToggle,
  };
}
