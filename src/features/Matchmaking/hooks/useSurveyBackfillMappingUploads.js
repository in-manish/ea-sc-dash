import { useState, useCallback, useEffect, useRef } from 'react';
import { matchmakingApi } from '../api/matchmakingApi';
import {
    parseMappingUploadList,
    parseMappingUploadRow,
    MAPPING_UPLOAD_PAGE_SIZES,
} from '../domain/parseBackfillMappingUploads';
import { downloadBlob } from '../../../utils/downloadBlob';
import { useAlert } from '../../../contexts/AlertContext';

export { MAPPING_UPLOAD_PAGE_SIZES };

export default function useSurveyBackfillMappingUploads({
    eventId,
    token,
    page,
    setPage,
    pageSize,
    uploadId,
    setUploadId,
}) {
    const { showAlert } = useAlert();
    const showAlertRef = useRef(showAlert);
    const setUploadIdRef = useRef(setUploadId);
    showAlertRef.current = showAlert;
    setUploadIdRef.current = setUploadId;

    const [list, setList] = useState(() => parseMappingUploadList(null));
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [error, setError] = useState(null);

    const loadList = useCallback(async () => {
        if (!eventId || !token) return;
        setLoading(true);
        setError(null);
        try {
            const raw = await matchmakingApi.listSurveyBackfillMappingUploads(
                eventId,
                { page, pageSize },
                token,
            );
            setList(parseMappingUploadList(raw));
        } catch (err) {
            setError(err.message || 'Failed to load upload history.');
            setList(parseMappingUploadList(null));
        } finally {
            setLoading(false);
        }
    }, [eventId, token, page, pageSize]);

    useEffect(() => {
        loadList();
    }, [loadList]);

    // Fetch detail only when event/token/uploadId change — never on alert/setter identity.
    useEffect(() => {
        if (!eventId || !token || !uploadId) {
            setDetail(null);
            setDetailLoading(false);
            return undefined;
        }

        let cancelled = false;
        setDetailLoading(true);

        matchmakingApi.getSurveyBackfillMappingUpload(eventId, uploadId, token)
            .then((raw) => {
                if (!cancelled) setDetail(parseMappingUploadRow(raw));
            })
            .catch((err) => {
                if (cancelled) return;
                setDetail(null);
                showAlertRef.current(err.message || 'Failed to load upload.', 'error');
                setUploadIdRef.current?.('');
            })
            .finally(() => {
                if (!cancelled) setDetailLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [eventId, token, uploadId]);

    const closeDetail = useCallback(() => {
        setDetail(null);
        setDetailLoading(false);
        setUploadIdRef.current?.('');
    }, []);

    const openUpload = useCallback((id) => {
        setUploadIdRef.current?.(String(id));
    }, []);

    const download = useCallback(async (id, fallbackName) => {
        if (!eventId || !token || id == null) return;
        setDownloadingId(id);
        try {
            const { blob, filename } = await matchmakingApi.downloadSurveyBackfillMappingUpload(
                eventId,
                id,
                token,
            );
            downloadBlob(blob, filename || fallbackName || `mapping-${id}.csv`);
        } catch (err) {
            showAlertRef.current(err.message || 'Download failed.', 'error');
        } finally {
            setDownloadingId(null);
        }
    }, [eventId, token]);

    return {
        ...list,
        page,
        setPage,
        pageSize,
        loading,
        error,
        detail,
        detailLoading,
        downloadingId,
        refresh: loadList,
        openUpload,
        closeDetail,
        download,
    };
}
