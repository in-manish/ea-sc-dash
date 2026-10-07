import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import useSurveyBackfillMappingCsv from '../../hooks/useSurveyBackfillMappingCsv';
import useSurveyBackfillRun from '../../hooks/useSurveyBackfillRun';
import useSurveyBackfillLogs, { BACKFILL_PAGE_SIZES } from '../../hooks/useSurveyBackfillLogs';
import useSurveyBackfillMappingList from '../../hooks/useSurveyBackfillMappingList';
import useSurveyBackfillMappingUploads, {
    MAPPING_UPLOAD_PAGE_SIZES,
} from '../../hooks/useSurveyBackfillMappingUploads';
import { BACKFILL_LOG_STATUSES } from '../../domain/parseBackfillMappingResult';
import MappingCsvPanel from './MappingCsvPanel';
import MappingUploadsPanel from './MappingUploadsPanel';
import MappingListPanel from './MappingListPanel';
import BackfillRunPanel from './BackfillRunPanel';
import BackfillLogsPanel from './BackfillLogsPanel';

function parsePageSize(raw, allowed, fallback) {
    const n = Number(raw);
    return allowed.includes(n) ? n : fallback;
}

function parseStatus(raw) {
    return BACKFILL_LOG_STATUSES.includes(raw) ? raw : '';
}

export default function SurveyBackfillPage() {
    const { selectedEvent, token } = useAuth();
    const eventId = selectedEvent?.id;
    const [searchParams, setSearchParams] = useSearchParams();

    const formFilter = searchParams.get('form_value') || '';
    const mapSearch = searchParams.get('map_search') || '';
    const statusFilter = parseStatus(searchParams.get('status'));
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = parsePageSize(searchParams.get('page_size'), BACKFILL_PAGE_SIZES, 50);
    const uploadPage = Math.max(1, Number(searchParams.get('upload_page')) || 1);
    const uploadPageSize = parsePageSize(
        searchParams.get('upload_page_size'),
        MAPPING_UPLOAD_PAGE_SIZES,
        20,
    );
    const uploadId = searchParams.get('upload_id') || '';

    const patchParams = useCallback((updates) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value == null || value === '' || value === false) next.delete(key);
                else next.set(key, String(value));
            });
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const setFormFilter = (value) => patchParams({ form_value: value, page: 1 });
    const setMapSearch = (value) => patchParams({ map_search: value });
    const setStatusFilter = (value) => patchParams({ status: value, page: 1 });
    const setPage = (value) => {
        const nextPage = typeof value === 'function' ? value(page) : value;
        patchParams({ page: nextPage > 1 ? nextPage : '' });
    };
    const setPageSize = (value) => patchParams({ page_size: value === 50 ? '' : value, page: 1 });
    const setUploadPage = (value) => {
        const nextPage = typeof value === 'function' ? value(uploadPage) : value;
        patchParams({ upload_page: nextPage > 1 ? nextPage : '' });
    };
    const setUploadPageSize = (value) => patchParams({
        upload_page_size: value === 20 ? '' : value,
        upload_page: 1,
    });
    const setUploadId = useCallback((value) => {
        patchParams({ upload_id: value || '' });
    }, [patchParams]);

    const mapping = useSurveyBackfillMappingList({
        eventId,
        token,
        formValue: formFilter.trim(),
        search: mapSearch.trim(),
    });
    const uploads = useSurveyBackfillMappingUploads({
        eventId,
        token,
        page: uploadPage,
        setPage: setUploadPage,
        pageSize: uploadPageSize,
        uploadId,
        setUploadId,
    });
    const refreshMapping = mapping.refresh;
    const refreshUploads = uploads.refresh;
    const onCsvSaved = useCallback(() => {
        refreshMapping();
        refreshUploads();
    }, [refreshMapping, refreshUploads]);
    const csv = useSurveyBackfillMappingCsv({
        eventId,
        token,
        onSaved: onCsvSaved,
    });
    const logs = useSurveyBackfillLogs({
        eventId,
        token,
        formValue: formFilter.trim(),
        status: statusFilter,
        page,
        setPage,
        pageSize,
    });
    const { setPolling, refresh } = logs;
    const startPoll = useCallback(() => {
        setPolling(true);
        refresh();
    }, [setPolling, refresh]);
    const run = useSurveyBackfillRun({ eventId, token, onQueued: startPoll });

    if (!selectedEvent) {
        return (
            <p className="text-sm text-text-secondary py-12 text-center">
                Select an event to manage SurveyJS mapping and backfill.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl animate-fade-in pb-8">
            <div>
                <h2 className="text-lg font-bold text-text-primary">
                    SurveyJS mapping & backfill
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                    Upload the option-mapping CSV, review history and mappings, queue a backfill, then watch logs.
                </p>
            </div>

            <MappingCsvPanel csv={csv} />
            <MappingUploadsPanel
                uploads={uploads}
                pageSize={uploadPageSize}
                setPageSize={setUploadPageSize}
                uploadId={uploadId}
            />
            <MappingListPanel
                mapping={mapping}
                formFilter={formFilter}
                setFormFilter={setFormFilter}
                search={mapSearch}
                setSearch={setMapSearch}
            />
            <BackfillRunPanel run={run} onStartPoll={startPoll} />
            <BackfillLogsPanel
                eventId={eventId}
                logs={logs}
                formFilter={formFilter}
                setFormFilter={setFormFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
        </div>
    );
}
