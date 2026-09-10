import UploadHistoryTable from '../../../components/uploadHistory/UploadHistoryTable';
import TableHeaderFilterDropdown from './TableHeaderFilterDropdown';
import useAttendeeUploadHistory from '../hooks/useAttendeeUploadHistory';

/** Full paginated history of past attendee CSV uploads for this event. */
export default function AttendeeUploadHistoryPanel({ eventId, token, refreshKey = 0 }) {
    const history = useAttendeeUploadHistory({ eventId, token, refreshKey });
    const typeOptions = history.knownUploadTypes.map((t) => ({ value: t, label: t }));

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
            typeColumnLabel="Upload Type"
            typeHeader={(
                <TableHeaderFilterDropdown
                    label="Upload Type"
                    options={typeOptions}
                    selected={history.uploadType ? [history.uploadType] : []}
                    onChange={(next) => {
                        history.setUploadType(next[0] || '');
                        history.setPage(1);
                    }}
                    multiSelect={false}
                />
            )}
            filenamePrefix="attendee_upload"
            getRowId={(rec) => rec.upload_id}
            getType={(rec) => rec.upload_type}
        />
    );
}
