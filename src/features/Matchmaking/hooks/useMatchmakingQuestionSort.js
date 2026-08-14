import { useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

export function useMatchmakingQuestionSort({
    listRef, enabled, disabled, itemCount, onReorder,
}) {
    const sortableRef = useRef(null);

    useEffect(() => {
        if (!listRef.current || itemCount === 0 || !enabled) {
            sortableRef.current?.destroy();
            sortableRef.current = null;
            return undefined;
        }

        sortableRef.current?.destroy();
        sortableRef.current = Sortable.create(listRef.current, {
            animation: 200,
            handle: '.drag-handle',
            ghostClass: 'opacity-40',
            disabled,
            onEnd: (evt) => {
                if (evt.oldIndex == null || evt.newIndex == null || evt.oldIndex === evt.newIndex) return;
                onReorder(evt.oldIndex, evt.newIndex);
            },
        });

        return () => {
            sortableRef.current?.destroy();
            sortableRef.current = null;
        };
    }, [listRef, enabled, disabled, itemCount, onReorder]);
}
