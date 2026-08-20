import { useCallback, useEffect, useState } from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { whatsappService } from '../api/whatsappTemplateApi';
import { STATUS_FILTER_ALL, TEMPLATE_SCOPE } from '../constants';

const ARCHIVE_CONFIRM =
    'Archive this template? It will be hidden from the default list.';

export default function useWhatsAppTemplateList(token, { enabled = true } = {}) {
    const { showAlert, showConfirm } = useAlert();
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState('attendee');
    const [statusFilter, setStatusFilter] = useState(STATUS_FILTER_ALL);
    const [search, setSearch] = useState('');
    const [scope, setScope] = useState(TEMPLATE_SCOPE.ACTIVE);
    const [busyId, setBusyId] = useState(null);

    const isArchived = scope === TEMPLATE_SCOPE.ARCHIVED;

    const fetchTemplates = useCallback(async () => {
        if (!token || !enabled) return;
        setIsLoading(true);
        try {
            const options = isArchived ? { is_active: false } : {};
            const data = await whatsappService.getTemplates(token, category, options);
            if (data.success) {
                setTemplates(data.templates || []);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token, category, isArchived, enabled]);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const dropFromList = (id) => {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
    };

    const archiveTemplate = async (template) => {
        const ok = await showConfirm(ARCHIVE_CONFIRM, {
            title: 'Archive template',
            confirmText: 'Archive',
            cancelText: 'Cancel',
        });
        if (!ok) return false;
        setBusyId(template.id);
        try {
            const data = await whatsappService.archiveTemplate(token, template.id);
            const archived = data.template;
            if (data.success && (!archived || archived.is_active === false)) {
                dropFromList(archived?.id ?? template.id);
                await showAlert(data.message || 'Template archived', 'success');
                return true;
            }
            await showAlert(data.message || 'Failed to archive template', 'error');
            return false;
        } catch (error) {
            console.error(error);
            await showAlert('Failed to archive template', 'error');
            return false;
        } finally {
            setBusyId(null);
        }
    };

    const restoreTemplate = async (template) => {
        setBusyId(template.id);
        try {
            const data = await whatsappService.restoreTemplate(token, template.id);
            if (data.success || data.template?.is_active === true) {
                dropFromList(data.template?.id ?? template.id);
                await showAlert(data.message || 'Template restored', 'success');
                return true;
            }
            await showAlert(data.message || 'Failed to restore template', 'error');
            return false;
        } catch (error) {
            console.error(error);
            await showAlert('Failed to restore template', 'error');
            return false;
        } finally {
            setBusyId(null);
        }
    };

    return {
        templates,
        isLoading,
        category,
        setCategory,
        statusFilter,
        setStatusFilter,
        search,
        setSearch,
        scope,
        setScope,
        isArchived,
        busyId,
        fetchTemplates,
        archiveTemplate,
        restoreTemplate,
    };
}
