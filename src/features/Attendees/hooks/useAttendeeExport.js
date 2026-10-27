import { useState } from 'react';
import { exportAttendees } from '../api/attendeeExportApi';
import {
    buildExportScope,
    loadExportPrefs,
    orderFields,
    saveExportPrefs,
} from '../domain/exportFields';

/**
 * Export dialog state. selection = { selectionMode, selectedAttendeeUuids, search, searchType,
 * filters, total, hasActiveSearchOrFilters }; the ticked rows win, otherwise all matches are exported.
 */
export default function useAttendeeExport({ eventId, token, selection }) {
    const [isOpen, setIsOpen] = useState(false);
    const [fields, setFields] = useState([]);
    const [fileType, setFileType] = useState('csv');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const { count, scope } = buildExportScope(selection);
    const isSelectedRows = Boolean(scope.uuids);

    const open = () => {
        const prefs = loadExportPrefs();
        setFields(prefs.fields);
        setFileType(prefs.type);
        setError('');
        setResult(null);
        setIsOpen(true);
    };

    const close = () => {
        if (!submitting) setIsOpen(false);
    };

    const toggleField = (key) => {
        setError('');
        setFields((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    };

    const setFieldList = (next) => {
        setError('');
        setFields(next);
    };

    const submit = async () => {
        if (!fields.length) {
            setError('Pick at least one field to export.');
            return;
        }
        if (!eventId || !token) return;
        const ordered = orderFields(fields);
        setSubmitting(true);
        setError('');
        try {
            const response = await exportAttendees(eventId, token, { fields: ordered, type: fileType, ...scope });
            saveExportPrefs({ fields: ordered, type: fileType });
            setResult({ ...response, count });
        } catch (err) {
            setError(err.message || 'Export failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return {
        isOpen, fields, fileType, submitting, error, result, count, isSelectedRows,
        open, close, toggleField, setFieldList, setFileType, submit,
    };
}
