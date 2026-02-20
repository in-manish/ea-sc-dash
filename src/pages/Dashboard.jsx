import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutGrid, List, Calendar, MapPin, Clock, Save, X } from 'lucide-react';

const Dashboard = () => {
    const { user, selectEvent } = useAuth();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('card');
    const [pendingEvent, setPendingEvent] = useState(null);

    const events = user?.events || [];

    const handleEventClick = (event) => {
        setPendingEvent(event);
    };

    const confirmEventSelection = () => {
        if (pendingEvent) {
            selectEvent(pendingEvent);
            navigate(`/event/${pendingEvent.id}/attendees`);
            setPendingEvent(null);
        }
    };

    const cancelEventSelection = () => {
        setPendingEvent(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-[1200px] mx-auto animate-fade-in">
            <div className="flex justify-between items-end mb-8 pb-4 border-b border-border">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-1">Events Overview</h1>
                    <p className="text-sm text-text-secondary">Select an event to manage</p>
                </div>

                <div className="flex bg-bg-primary border border-border rounded-md p-1">
                    <button
                        className={`flex items-center justify-center w-9 h-8 rounded-sm bg-transparent border-none transition-all duration-200 hover:text-text-primary hover:bg-bg-secondary ${viewMode === 'card' ? 'bg-bg-tertiary text-accent' : 'text-text-secondary'}`}
                        onClick={() => setViewMode('card')}
                        title="Card View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={`flex items-center justify-center w-9 h-8 rounded-sm bg-transparent border-none transition-all duration-200 hover:text-text-primary hover:bg-bg-secondary ${viewMode === 'list' ? 'bg-bg-tertiary text-accent' : 'text-text-secondary'}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-text-tertiary text-center bg-bg-primary rounded-lg border border-dashed border-border">
                    <Calendar size={48} className="mb-4 text-border-hover" />
                    <h3>No Events Found</h3>
                    <p>You don't have any events assigned yet.</p>
                </div>
            ) : (
                <div className={viewMode === 'card' ? 'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6' : 'flex flex-col gap-2'}>
                    {viewMode === 'list' && (
                        <div className="grid grid-cols-[1.5fr_1.2fr_1.2fr_2fr_100px] gap-4 px-4 pb-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                            <div>Event Name</div>
                            <div>Date</div>
                            <div>Time</div>
                            <div>Location</div>
                            <div>Status</div>
                        </div>
                    )}

                    {events.map((event) => (
                        <div
                            key={event.id}
                            className={`bg-bg-primary border border-border cursor-pointer ${viewMode === 'card'
                                    ? 'rounded-lg p-6 flex flex-col transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-border-hover'
                                    : 'grid grid-cols-[1.5fr_1.2fr_1.2fr_2fr_100px] gap-4 items-center rounded-md p-4 transition-colors duration-200 hover:bg-bg-secondary'
                                }`}
                            onClick={() => handleEventClick(event)}
                        >
                            <div className={viewMode === 'card' ? 'flex-1 mb-6' : 'contents'}>
                                <h3 className={viewMode === 'card' ? 'text-lg font-semibold text-text-primary mb-2' : 'text-[0.925rem] font-semibold text-text-primary m-0'}>{event.name}</h3>
                                {viewMode === 'card' && event.description && <p className="text-sm text-text-secondary mb-4 line-clamp-2">{event.description}</p>}

                                <div className={viewMode === 'card' ? 'flex flex-col gap-2' : 'contents'}>
                                    <div className={`flex items-center gap-2 ${viewMode === 'card' ? 'text-[0.8125rem]' : 'text-sm'} text-text-secondary`}>
                                        {viewMode === 'card' && <Calendar size={14} />}
                                        <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${viewMode === 'card' ? 'text-[0.8125rem]' : 'text-sm'} text-text-secondary`}>
                                        {viewMode === 'card' && <Clock size={14} />}
                                        <span>{event.start_time} - {event.end_time}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${viewMode === 'card' ? 'text-[0.8125rem]' : 'text-sm'} text-text-secondary`}>
                                        {viewMode === 'card' && <MapPin size={14} />}
                                        <span>{event.address || 'No location specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={viewMode === 'card' ? 'flex justify-between items-center pt-4 border-t border-bg-tertiary' : 'contents'}>
                                <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${event.event_active ? 'bg-[#dcfce7] text-[#166534]' : 'bg-slate-100 text-slate-500'}`}>
                                    {event.event_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Dialog */}
            {pendingEvent && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[100] animate-fade-in">
                    <div className="bg-bg-primary rounded-lg p-6 w-full max-w-[400px] shadow-md border border-border">
                        <h3 className="text-xl font-bold text-text-primary mb-2">Open Event?</h3>
                        <p className="text-text-secondary mb-6">
                            Do you want to manage <strong>{pendingEvent.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="btn btn-secondary"
                                onClick={cancelEventSelection}
                            >
                                Ignore
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={confirmEventSelection}
                            >
                                <Save size={16} style={{ marginRight: '0.5rem' }} />
                                Save & Open
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
