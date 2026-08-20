import { useEffect, useState } from 'react';
import { listCategoryTypeEmails } from '../api/categoryTypeEmailsApi';
import { parseCategoryTypeEmails } from '../domain/parseCategoryTypeEmails';

export default function useCategoryTypeEmails({ eventId, token, enabled }) {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (!enabled || !eventId || !token) {
            setEmails([]);
            setSelectedIds([]);
            setExpandedId(null);
            setError('');
            setLoading(false);
            return;
        }

        let active = true;
        const load = async () => {
            setLoading(true);
            setError('');
            setSelectedIds([]);
            setExpandedId(null);
            try {
                const data = await listCategoryTypeEmails(eventId, token);
                if (active) setEmails(parseCategoryTypeEmails(data));
            } catch (err) {
                if (!active) return;
                setEmails([]);
                setError(err.message || 'Failed to load category emails.');
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [enabled, eventId, token]);

    const toggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
        );
    };

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    return {
        emails,
        loading,
        error,
        selectedIds,
        toggle,
        expandedId,
        toggleExpand,
    };
}
