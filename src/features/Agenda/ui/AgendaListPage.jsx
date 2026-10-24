import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAlert } from '../../../contexts/AlertContext';
import { agendaService } from '../../../services/agendaService';
import AgendaCard from './AgendaCard';
import AgendaHeader from './AgendaHeader';
import AgendaListEmptyState from './AgendaListEmptyState';
import AgendaListErrorBanner from './AgendaListErrorBanner';
import AgendaRow from './AgendaRow';
import AgendaViewModal from './AgendaViewModal';

const AgendaListPage = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showConfirm, showAlert } = useAlert();

  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState(null);

  const fetchAgendas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agendaService.getAgendas(eventId, token, page, pageSize, search);
      setAgendas(data.results || []);
      setTotal(data.count || 0);
      setHasLoaded(true);
    } catch (err) {
      console.error('Fetch Agendas Error:', err);
      setAgendas([]);
      setTotal(0);
      setHasLoaded(false);
      setError(err.message || 'Failed to load agenda sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAgendas();
  }, [eventId, page, search, token]);

  const handleDelete = async (agendaId) => {
    const confirmed = await showConfirm('Are you sure you want to delete this session?', {
      title: 'Delete Session',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
    if (!confirmed) return;
    try {
      await agendaService.deleteAgenda(eventId, agendaId, token);
      fetchAgendas();
      showAlert('Session deleted successfully', 'success');
    } catch (err) {
      showAlert(`Failed to delete: ${err.message}`, 'error');
    }
  };

  const openEdit = (agenda = null) => {
    if (agenda) {
      navigate(`/event/${eventId}/agenda/${agenda.id}/edit`, { state: { agenda } });
    } else {
      navigate(`/event/${eventId}/agenda/new`);
    }
  };

  const showInitialLoading = loading && !hasLoaded && !error;
  const showEmpty = !loading && !error && hasLoaded && agendas.length === 0;

  return (
    <div className="p-6 md:p-10 max-w-[1500px] mx-auto min-h-screen animate-fade-in space-y-10">
      <AgendaHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        search={search}
        setSearch={(value) => {
          setPage(1);
          setSearch(value);
        }}
        onAddSession={() => openEdit(null)}
      />

      {error && (
        <AgendaListErrorBanner
          message={error}
          onRetry={fetchAgendas}
          onDismiss={() => setError(null)}
        />
      )}

      {showInitialLoading ? (
        <div className="bg-bg-primary border border-border rounded-[2.5rem] shadow-premium p-20 flex flex-col items-center justify-center space-y-6">
          <Loader2 className="animate-spin text-accent" size={48} />
          <p className="text-text-tertiary font-black text-xs uppercase tracking-[0.25em]">
            Synchronizing Schedule...
          </p>
        </div>
      ) : showEmpty ? (
        <AgendaListEmptyState
          hasSearch={Boolean(search.trim())}
          onAddSession={() => openEdit(null)}
          onClearSearch={() => {
            setPage(1);
            setSearch('');
          }}
        />
      ) : !error ? (
        <>
          <div
            className={
              viewMode === 'card'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12'
                : 'flex flex-col gap-4 mb-12'
            }
          >
            {agendas.map((item) =>
              viewMode === 'card' ? (
                <AgendaCard
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onView={(a) => {
                    setSelectedAgenda(a);
                    setIsViewModalOpen(true);
                  }}
                />
              ) : (
                <AgendaRow
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onView={(a) => {
                    setSelectedAgenda(a);
                    setIsViewModalOpen(true);
                  }}
                />
              )
            )}
          </div>

          {total > pageSize && (
            <div className="flex items-center justify-center gap-8 mt-16 bg-bg-primary p-5 rounded-[2rem] border border-border shadow-premium w-fit mx-auto">
              <button
                className="bg-white border border-border text-text-primary hover:border-accent hover:text-accent font-black uppercase tracking-widest text-[10px] py-3 px-6 rounded-2xl flex items-center gap-3 disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={18} /> Previous
              </button>
              <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.25em] px-8">
                Page {page} of {Math.ceil(total / pageSize) || 1}
              </span>
              <button
                className="bg-white border border-border text-text-primary hover:border-accent hover:text-accent font-black uppercase tracking-widest text-[10px] py-3 px-6 rounded-2xl flex items-center gap-3 disabled:opacity-50"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : null}

      <AgendaViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedAgenda={selectedAgenda}
      />
    </div>
  );
};

export default AgendaListPage;
