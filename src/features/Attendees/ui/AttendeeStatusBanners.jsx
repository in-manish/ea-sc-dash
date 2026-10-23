const AttendeeStatusBanners = ({
    error,
    whatsAppActionSuccess,
    whatsAppActionError,
    emailActionSuccess,
    deleteSuccess,
    selectedAttendee,
    scSyncSuccess,
    scSyncError,
}) => (
    <>
        {error && (
            <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md mb-6">
                {error}
            </div>
        )}
        {whatsAppActionSuccess && (
            <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 rounded-md mb-6">
                {whatsAppActionSuccess}
            </div>
        )}
        {whatsAppActionError && (
            <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md mb-6">
                {whatsAppActionError}
            </div>
        )}
        {emailActionSuccess && (
            <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 rounded-md mb-6">
                {emailActionSuccess}
            </div>
        )}
        {deleteSuccess && (
            <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 rounded-md mb-6">
                {deleteSuccess}
            </div>
        )}
        {!selectedAttendee && scSyncSuccess && (
            <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 rounded-md mb-6">
                {scSyncSuccess}
            </div>
        )}
        {!selectedAttendee && scSyncError && (
            <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md mb-6">
                {scSyncError}
            </div>
        )}
    </>
);

export default AttendeeStatusBanners;
