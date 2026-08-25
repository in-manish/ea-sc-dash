import { useCallback, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ListPagination from '../../Attendees/ui/ListPagination';
import { useCreateImport } from '../hooks/useCreateImport';
import { useImportFileActions } from '../hooks/useImportFileActions';
import { useImportList } from '../hooks/useImportList';
import ImportDetailDrawer from './ImportDetailDrawer';
import ImportHistoryHeader from './ImportHistoryHeader';
import ImportJobsTable from './ImportJobsTable';
import ImportPreviewModal from './ImportPreviewModal';
import ImportUploadPanel from './ImportUploadPanel';

export default function ImportsTab() {
  const { token, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  const list = useImportList({ token, onUnauthorized: logout, refreshKey });
  const files = useImportFileActions();

  const onCreated = useCallback(
    (job) => {
      setRefreshKey((k) => k + 1);
      setSelectedId(job?.id ?? null);
      list.setPage(1);
    },
    [list.setPage]
  );

  const create = useCreateImport({
    token,
    onUnauthorized: logout,
    onCreated,
  });

  const onFileChange = (file) => {
    create.setFile(file);
    files.bindLocalFile(file);
  };

  return (
    <div>
      <ImportUploadPanel
        file={create.file}
        onFileChange={onFileChange}
        tagText={create.tagText}
        onTagTextChange={create.setTagText}
        dryRun={create.dryRun}
        onDryRunChange={create.setDryRun}
        submitting={create.submitting}
        error={create.error}
        success={create.success}
        onSubmit={create.submit}
        onPreviewLocal={files.previewLocalFile}
        onDownloadLocal={files.downloadLocalFile}
        previewBusy={files.busy === 'preview'}
        downloadBusy={files.busy === 'download' && files.busyImportId == null}
      />

      {(files.error && !files.preview) || list.error ? (
        <div className="mb-3 text-sm text-danger bg-red-500/5 border border-red-500/20 rounded-md px-3 py-2">
          {files.error || list.error}
        </div>
      ) : null}

      <ImportHistoryHeader
        count={list.count}
        loading={list.loading}
        refreshing={list.refreshing}
        hasActive={list.hasActive}
        onRefresh={list.refresh}
      />

      <ImportJobsTable
        rows={list.results}
        loading={list.loading}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onPreview={files.previewJob}
        onDownload={files.downloadJob}
        downloadBusyId={files.busy === 'download' ? files.busyImportId : null}
      />

      <ListPagination
        page={list.page}
        loading={list.loading}
        hasNext={list.hasNext}
        onPrev={() => list.setPage((p) => Math.max(1, p - 1))}
        onNext={() => list.setPage((p) => p + 1)}
      />

      {selectedId != null && (
        <ImportDetailDrawer
          token={token}
          importId={selectedId}
          onClose={() => setSelectedId(null)}
          onUnauthorized={logout}
          onPreview={files.previewJob}
          onDownload={files.downloadJob}
          downloadBusy={files.busy === 'download' && files.busyImportId === selectedId}
        />
      )}

      <ImportPreviewModal
        open={Boolean(files.preview)}
        title={files.preview?.title || ''}
        data={
          files.preview
            ? {
                headers: files.preview.headers,
                rows: files.preview.rows,
                row_count: files.preview.rows?.length || 0,
                truncated: files.preview.truncated,
                limit: 50,
                file_type: 'csv',
              }
            : null
        }
        loading={files.busy === 'preview' && !files.preview}
        error={files.preview ? files.error : ''}
        onClose={files.closePreview}
        onDownload={files.downloadPreviewFile}
        downloadBusy={files.busy === 'download'}
      />
    </div>
  );
}
