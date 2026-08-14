import { useState } from 'react';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import useCreateEmailTemplate from '../hooks/useCreateEmailTemplate';
import useEmailTemplateList from '../hooks/useEmailTemplateList';
import CreateEmailTemplateModal from './CreateEmailTemplateModal';
import EmailTemplateEditModal from './EmailTemplateEditModal';
import EmailTemplateFilters from './EmailTemplateFilters';
import EmailTemplateTable from './EmailTemplateTable';

export default function EmailTemplatesPage() {
  const { token } = useAuth();
  const list = useEmailTemplateList(token);
  const create = useCreateEmailTemplate(token);
  const [selectedId, setSelectedId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const closeCreate = () => {
    setCreateOpen(false);
    create.reset();
  };

  const handleCreate = async () => {
    const created = await create.submit();
    if (!created) return;
    closeCreate();
    list.reload();
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <div className="mb-8 pb-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full mb-2 inline-block">
            Snapcard Administration
          </span>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Email template manage</h1>
          <p className="text-sm text-text-secondary">
            List, create, update, and archive password-reset templates. There is no delete.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm inline-flex items-center gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          Create template
        </button>
      </div>

      <EmailTemplateFilters
        filters={list.filters}
        dropdowns={list.dropdowns}
        isLoading={list.isLoading}
        onChange={list.setFilters}
        onApply={list.applyFilters}
        onClear={list.clearFilters}
        onRefresh={list.reload}
      />

      {list.error && (
        <div className="bg-red-50 text-danger p-4 rounded-lg text-sm border border-red-100 mb-6 flex items-start gap-2.5">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-0.5">Error loading templates</h4>
            <p className="text-red-600">{list.error}</p>
          </div>
        </div>
      )}

      {list.isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-bg-primary rounded-lg border border-border shadow-sm">
          <Loader2 size={40} className="animate-spin text-accent mb-4" />
          <span className="text-text-secondary font-medium">Loading email templates...</span>
        </div>
      ) : (
        <EmailTemplateTable
          results={list.results}
          totalCount={list.totalCount}
          pagination={{ limit: list.applied.limit, offset: list.applied.offset }}
          onLimitChange={list.setLimit}
          onPageChange={list.setPageOffset}
          onSelect={(row) => setSelectedId(row.id)}
        />
      )}

      <EmailTemplateEditModal
        templateId={selectedId}
        token={token}
        dropdowns={list.dropdowns}
        onClose={() => setSelectedId(null)}
        onSaved={() => {
          setSelectedId(null);
          list.reload();
        }}
      />
      <CreateEmailTemplateModal
        open={createOpen}
        form={create.form}
        fieldErrors={create.fieldErrors}
        error={create.error}
        isSaving={create.isSaving}
        dropdowns={list.dropdowns}
        onPatch={create.patch}
        onClose={closeCreate}
        onSubmit={handleCreate}
      />
    </div>
  );
}
