import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { agendaService } from '../../services/agendaService';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

// Sub-components
import AgendaHeader from './components/AgendaHeader';
import AgendaCard from './components/AgendaCard';
import AgendaRow from './components/AgendaRow';

// Modals
import AgendaFormModal from './modals/AgendaFormModal';
import AgendaViewModal from './modals/AgendaViewModal';

const Agenda = () => {
    console.log(">>> INITIALIZING MODULAR EVENT AGENDA COMPONENT <<<");
    const { id: eventId } = useParams();
    const { token } = useAuth();

    // Data State
    const [agendas, setAgendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [search, setSearch] = useState('');

    // UI State
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'row'
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);

    useEffect(() => {
        if (token) {
            fetchAgendas();
        }
    }, [eventId, page, search, token]);

    const fetchAgendas = async () => {
        setLoading(true);
        try {
            const data = await agendaService.getAgendas(eventId, token, page, pageSize, search);
            setAgendas(data.results || []);
            setTotal(data.count || 0);
        } catch (err) {
            console.error('Fetch Agendas Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (agendaId) => {
        if (!window.confirm('Are you sure you want to delete this session?')) return;
        try {
            await agendaService.deleteAgenda(eventId, agendaId, token);
            fetchAgendas();
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    const handleOpenForm = (agenda = null) => {
        setSelectedAgenda(agenda);
        setIsFormModalOpen(true);
    };

    const handleOpenView = (agenda) => {
        setSelectedAgenda(agenda);
        setIsViewModalOpen(true);
    };

    return (
        <div className="p-6 md:p-10 max-w-[1500px] mx-auto min-h-screen animate-fade-in space-y-10">
            <AgendaHeader
                viewMode={viewMode}
                setViewMode={setViewMode}
                search={search}
                setSearch={setSearch}
                onAddSession={() => handleOpenForm(null)}
            />

            {loading && agendas.length === 0 ? (
                <div className="bg-bg-primary border border-border rounded-[2.5rem] shadow-premium p-20 flex flex-col items-center justify-center space-y-6">
                    <Loader2 className="animate-spin text-accent" size={48} />
                    <p className="text-text-tertiary font-black text-xs uppercase tracking-[0.25em]">Synchronizing Schedule...</p>
                </div>
            ) : (
                <>
                    <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12' : 'flex flex-col gap-4 mb-12'}>
                        {agendas.map((item) => (
                            viewMode === 'card' ? (
                                <AgendaCard
                                    key={item.id}
                                    item={item}
                                    onEdit={handleOpenForm}
                                    onDelete={handleDelete}
                                    onView={handleOpenView}
                                />
                            ) : (
                                <AgendaRow
                                    key={item.id}
                                    item={item}
                                    onEdit={handleOpenForm}
                                    onDelete={handleDelete}
                                    onView={handleOpenView}
                                />
                            )
                        ))}
                    </div>

                    {/* Pagination */}
                    {total > pageSize && (
                        <div className="flex items-center justify-center gap-8 mt-16 bg-bg-primary p-5 rounded-[2rem] border border-border shadow-premium w-fit mx-auto mesh-bg relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none" />
                            <div className="relative z-10 flex items-center gap-8">
                                <button
                                    className="bg-white border-2 border-border/50 text-text-primary hover:border-accent hover:text-accent font-black uppercase tracking-widest text-[10px] py-3 px-6 rounded-2xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    <ChevronLeft size={18} />
                                    Previous
                                </button>
                                <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.25em] px-8 border-x-2 border-border/50">
                                    Page {page} <span className="text-text-tertiary mx-2">of</span> {Math.ceil(total / pageSize) || 1}
                                </span>
                                <button
                                    className="bg-white border-2 border-border/50 text-text-primary hover:border-accent hover:text-accent font-black uppercase tracking-widest text-[10px] py-3 px-6 rounded-2xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                                    disabled={page >= Math.ceil(total / pageSize)}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <AgendaFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                agenda={selectedAgenda}
                eventId={eventId}
                token={token}
                onSuccess={fetchAgendas}
            />

            <AgendaViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                selectedAgenda={selectedAgenda}
            />
        </div>
    );
};

export default Agenda;
