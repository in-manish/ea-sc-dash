import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, Search, Filter, Phone, Mail, Globe, X } from 'lucide-react';
import './Attendees.css';

const Attendees = () => {
    const { selectedEvent, token } = useAuth();
    const navigate = useNavigate();
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [selectedAttendee, setSelectedAttendee] = useState(null);
    const [isModalMaximized, setIsModalMaximized] = useState(false);

    useEffect(() => {
        const fetchAttendees = async () => {
            if (!selectedEvent) return;

            setLoading(true);
            setError(null);

            try {
                const data = await eventService.getAttendees(selectedEvent.id, token, page);
                setAttendees(data.results);
                setTotal(data.total);
                setHasLoaded(true);
            } catch (err) {
                setError('Failed to load attendees. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedEvent && token) {
            fetchAttendees();
        }
    }, [selectedEvent, page, token]);

    // Group fields logic - Includes ALL fields
    const getGroupedFields = (attendee) => {
        if (!attendee) return {};

        const isExhibitor = attendee.attendee_type === 'Exhibitor' || attendee.attendee_type_sort === 'exhibitor';

        const professionalFields = [
            { label: 'Company', value: attendee.company },
            { label: 'Designation', value: attendee.designation },
            { label: 'Website', value: attendee.website },
            { label: 'Company Address', value: attendee.company_address },
            { label: 'City', value: attendee.city },
            { label: 'State', value: attendee.state },
            { label: 'Country', value: attendee.country },
        ];

        if (isExhibitor) {
            professionalFields.push(
                { label: 'Exhibitor ID', value: attendee.exhibitor_id },
                { label: 'Parent Exhibitor ID', value: attendee.parent_exhibitor_id },
                { label: 'Is POC', value: attendee.is_poc ? 'Yes' : 'No' }
            );
        }

        const registrationFields = [
            { label: 'Reg ID', value: attendee.reg_id },
            { label: 'Reg Type', value: attendee.reg_type },
            { label: 'Attendee Type', value: attendee.attendee_type },
            { label: 'Attendee Type ID', value: attendee.attendee_type_id },
            { label: 'Attendee Type Sort', value: attendee.attendee_type_sort },
            { label: 'Login Code', value: attendee.event_login_code },
        ];

        if (isExhibitor) {
            registrationFields.push(
                { label: 'OBF Number', value: attendee.obf_number }
            );
        }

        registrationFields.push(
            { label: 'Upload ID', value: attendee.upload_id },
            { label: 'EVC ID', value: attendee.evc_id }
        );

        return {
            Identity: [
                { label: 'Full Name', value: attendee.name },
                { label: 'Email', value: attendee.email },
                { label: 'Phone', value: `+${attendee.country_code || ''} ${attendee.phone_number || ''}` },
                { label: 'ID', value: attendee.id },
                { label: 'UUID', value: attendee.uuid },
                { label: 'Tracking UUID', value: attendee.tracking_uuid },
            ],
            Professional: professionalFields,
            Registration: registrationFields,
            Status: [
                { label: 'Email Sent', value: attendee.email_sent ? 'Yes' : 'No' },
                { label: 'SMS Sent', value: attendee.sms_sent ? 'Yes' : 'No' },
                { label: 'WhatsApp Sent', value: attendee.wa_sent ? 'Yes' : 'No' },
                { label: 'Checked In', value: attendee.check_in ? 'Yes' : 'No' },
                { label: 'Meeting Enabled', value: attendee.is_meeting_enabled ? 'Yes' : 'No' },
            ],
            System: [
                { label: 'Event ID', value: attendee.event_id },
                { label: 'Event Name', value: attendee.event_name },
                { label: 'Schema', value: attendee.schema },
                { label: 'Created At', value: attendee.created_at ? new Date(attendee.created_at).toLocaleString() : '-' },
                { label: 'Modified At', value: attendee.modified_at ? new Date(attendee.modified_at).toLocaleString() : '-' },
            ]
        };
    };

    if (!hasLoaded && loading) {
        return (
            <div className="loading-container">
                <Loader2 className="spinner" size={32} />
                <p>Loading Attendees...</p>
            </div>
        );
    }

    return (
        <div className="attendees-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Attendees</h1>
                    <p className="page-subtitle">Total: {total} registered</p>
                </div>

                <div className="actions-bar">
                    <div className="search-box">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Search attendees..." className="search-input" />
                    </div>
                    <button className="btn btn-secondary">
                        <Filter size={16} style={{ marginRight: '0.5rem' }} />
                        Filter
                    </button>
                </div>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="attendees-table-container">
                <table className="attendees-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Company</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="loading-row">
                                    <Loader2 className="spinner" size={24} />
                                </td>
                            </tr>
                        ) : attendees.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-row">No attendees found.</td>
                            </tr>
                        ) : (
                            attendees.map((attendee) => (
                                <tr
                                    key={attendee.uuid}
                                    className="clickable-row"
                                    onClick={() => setSelectedAttendee(attendee)}
                                >
                                    <td>
                                        <div className="attendee-name">{attendee.name}</div>
                                        <div className="attendee-id">Reg ID: {attendee.reg_id}</div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <div className="contact-item" title={attendee.email}>
                                                <Mail size={12} /> {attendee.email}
                                            </div>
                                            <div className="contact-item" title={attendee.phone_number}>
                                                <Phone size={12} /> +{attendee.country_code} {attendee.phone_number}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="company-info">
                                            <div className="company-name">
                                                {attendee.exhibitor_id ? (
                                                    <span
                                                        className="text-link"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/event/${selectedEvent.id}/companies/${attendee.exhibitor_id}`);
                                                        }}
                                                        title="View Company Details"
                                                    >
                                                        {attendee.company || '-'}
                                                    </span>
                                                ) : (
                                                    attendee.company || '-'
                                                )}
                                            </div>
                                            <div className="company-loc">{attendee.city}, {attendee.country}</div>
                                            {attendee.website && (
                                                <div className="company-web">
                                                    <Globe size={10} /> <a href={attendee.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Website</a>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-type">{attendee.attendee_type}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${attendee.reg_type === 'ON_SPOT' ? 'badge-warning' : 'badge-success'}`}>
                                            {attendee.reg_type}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === 1 || loading}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                <span className="page-info">Page {page}</span>
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={attendees.length < 50 || loading}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>

            {/* Attendee Detail Modal */}
            {selectedAttendee && (
                <div className="modal-overlay animate-fade-in" onClick={() => setSelectedAttendee(null)}>
                    <div
                        className={`modal-card wide-modal ${isModalMaximized ? 'maximized' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">{selectedAttendee.name}</h2>
                                <span className="modal-subtitle">{selectedAttendee.company}</span>
                            </div>
                            <div className="modal-actions-header">
                                <button
                                    className="icon-btn"
                                    onClick={() => setIsModalMaximized(!isModalMaximized)}
                                    title={isModalMaximized ? "Restore" : "Maximize"}
                                >
                                    <div className={`resize-icon ${isModalMaximized ? 'minimize' : 'maximize'}`}></div>
                                </button>
                                <button className="icon-btn close-btn" onClick={() => setSelectedAttendee(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="modal-content-scroll">
                            {Object.entries(getGroupedFields(selectedAttendee)).map(([group, fields]) => (
                                <div key={group} className="detail-group">
                                    <h4 className="group-title">{group}</h4>
                                    <div className="fields-grid">
                                        {fields.map((field, idx) => (
                                            <div key={idx} className="field-item">
                                                <label className="field-label">{field.label}</label>
                                                <div className="field-value">{field.value !== null && field.value !== undefined && field.value !== '' ? field.value : '-'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendees;
