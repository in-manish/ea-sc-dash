import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutGrid, List, Calendar, MapPin, Clock, Save, X } from 'lucide-react';
import './Dashboard.css';

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
        <div className="dashboard-container animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Events Overview</h1>
                    <p className="page-subtitle">Select an event to manage</p>
                </div>

                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                        onClick={() => setViewMode('card')}
                        title="Card View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="empty-state">
                    <Calendar size={48} className="empty-icon" />
                    <h3>No Events Found</h3>
                    <p>You don't have any events assigned yet.</p>
                </div>
            ) : (
                <div className={`events-grid ${viewMode}`}>
                    {viewMode === 'list' && (
                        <div className="list-header">
                            <div className="col-name">Event Name</div>
                            <div className="col-date">Date</div>
                            <div className="col-time">Time</div>
                            <div className="col-location">Location</div>
                            <div className="col-status">Status</div>
                        </div>
                    )}

                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="event-card clickable"
                            onClick={() => handleEventClick(event)}
                        >
                            <div className="event-main">
                                <h3 className="event-name">{event.name}</h3>
                                {event.description && <p className="event-desc">{event.description}</p>}

                                <div className="event-details">
                                    <div className="detail-item">
                                        <Calendar size={14} />
                                        <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Clock size={14} />
                                        <span>{event.start_time} - {event.end_time}</span>
                                    </div>
                                    <div className="detail-item">
                                        <MapPin size={14} />
                                        <span>{event.address || 'No location specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="event-footer">
                                <span className={`status-badge ${event.event_active ? 'active' : 'inactive'}`}>
                                    {event.event_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Dialog */}
            {pendingEvent && (
                <div className="modal-overlay animate-fade-in">
                    <div className="modal-card">
                        <h3 className="modal-title">Open Event?</h3>
                        <p className="modal-text">
                            Do you want to manage <strong>{pendingEvent.name}</strong>?
                        </p>
                        <div className="modal-actions">
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
