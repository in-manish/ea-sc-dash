import UploadHistoryTable from '../../../components/uploadHistory/UploadHistoryTable';
import useCompanyUploadHistory from '../hooks/useCompanyUploadHistory';

/** Full paginated history of past company CSV uploads for this event. */
export default function CompanyUploadHistoryPanel({ eventId, token, refreshKey = 0 }) {
    const history = useCompanyUploadHistory({ eventId, token, refreshKey });

    return (
        <UploadHistoryTable
            uploads={history.uploads}
            loading={history.loading}
            error={history.error}
            total={history.total}
            page={history.page}
            hasNext={history.hasNext}
            onRefresh={() => history.loadUploads(history.page)}
            onPrev={() => history.setPage((p) => Math.max(1, p - 1))}
            onNext={() => history.setPage((p) => p + 1)}
            onSortDate={history.toggleSort}
            typeColumnLabel="Status"
            filenamePrefix="company_upload"
            getRowId={(rec) => rec.id}
            getType={(rec) => rec.status}
        />
    );
}
