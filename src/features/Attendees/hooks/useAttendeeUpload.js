import { useMemo, useState } from 'react';
import { useCsvUploadFlow } from '../../../hooks/useCsvUploadFlow';
import {
    downloadAttendeeUploadValidationReport,
    uploadAttendeesCsv,
    validateAttendeesCsv,
} from '../api/attendeeUploadApi';

/** State/handlers for the attendee CSV upload modal: pick file, dry-run validate, upload. */
export function useAttendeeUpload({ eventId, token, onUploaded }) {
    const [strict, setStrict] = useState(false);
    const extraParams = useMemo(() => ({ strict }), [strict]);

    const upload = useCsvUploadFlow({
        eventId,
        token,
        onUploaded,
        validateFn: validateAttendeesCsv,
        uploadFn: uploadAttendeesCsv,
        downloadReportFn: downloadAttendeeUploadValidationReport,
        extraParams,
    });

    return { ...upload, strict, setStrict };
}
