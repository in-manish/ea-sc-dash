import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { agendaService } from '../services/agendaService';
import {
    Loader2, Search, Plus, Calendar, Clock, MapPin,
    MoreVertical, Edit2, Eye, Trash2, X, ChevronLeft,
    ChevronRight, Upload, GripVertical, Image as ImageIcon,
    LayoutGrid, List
} from 'lucide-react';
import Sortable from 'sortablejs';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './Agenda.css';

const Agenda = () => {
    const { id: eventId } = useParams();
    const { selectedEvent, token } = useAuth();
    const [agendas, setAgendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [search, setSearch] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'row'

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        description: '',
        information: '',
        date: '',
        start: '',
        end: '',
        track_title: '',
        enrollable: false,
        admin: false,
        force_attendance: false,
        speaker_default_alpha_sort: true
    });
    const [speakers, setSpeakers] = useState([]);
    const [moderators, setModerators] = useState([]);
    const [partnerLogo, setPartnerLogo] = useState(null); // File or URL
    const [imageBlobs, setImageBlobs] = useState(new Map());

    const [isCropping, setIsCropping] = useState(false);
    const [croppingTarget, setCroppingTarget] = useState(null); // { type, index, previewUrl }

    // Refs
    const speakerListRef = useRef(null);
    const speakerSortableRef = useRef(null);
    const cropperRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        if (token) {
            fetchAgendas();
        }
    }, [eventId, page, search, token]);

    const handleImageClick = (type, index = null) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                setCroppingTarget({ type, index, url, originalFilename: file.name });
                setIsCropping(true);
            }
        };
        input.click();
    };

    const initCropper = () => {
        if (imageRef.current) {
            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: croppingTarget.type === 'logo' ? NaN : 1,
                viewMode: 1,
            });
        }
    };

    const handleSaveCrop = () => {
        if (cropperRef.current) {
            const canvas = cropperRef.current.getCroppedCanvas({
                width: croppingTarget.type === 'logo' ? 800 : 400,
                height: croppingTarget.type === 'logo' ? 400 : 400,
            });

            canvas.toBlob((blob) => {
                const { type, index, originalFilename } = croppingTarget;
                const extension = blob.type === 'image/png' ? 'png' : 'jpg';
                const filename = originalFilename ? originalFilename.replace(/\.[^/.]+$/, '') + '.' + extension : (type === 'logo' ? 'partner_logo.' : 'image.') + extension;

                const blobKey = type === 'logo' ? 'partner_logo' : `${type}_image_${index}`;
                const newImageBlobs = new Map(imageBlobs);
                newImageBlobs.set(blobKey, { blob, filename });
                setImageBlobs(newImageBlobs);

                const previewUrl = URL.createObjectURL(blob);
                if (type === 'logo') {
                    setPartnerLogo(previewUrl);
                } else if (type === 'speaker') {
                    const newSpeakers = [...speakers];
                    newSpeakers[index].speaker_image_preview = previewUrl;
                    setSpeakers(newSpeakers);
                } else if (type === 'moderator') {
                    const newModerators = [...moderators];
                    newModerators[index].moderator_image_preview = previewUrl;
                    setModerators(newModerators);
                }

                setIsCropping(false);
                cropperRef.current.destroy();
            }, 'image/jpeg', 0.8);
        }
    };

    const fetchAgendas = async () => {
        setLoading(true);
        try {
            // Token from context
            const data = await agendaService.getAgendas(eventId, token, page, pageSize, search);
            setAgendas(data.results || []);
            setTotal(data.count || 0);
        } catch (err) {
            console.error('Fetch Agendas Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPerson = (type) => {
        if (type === 'speaker') {
            setSpeakers([...speakers, { speaker_name: '', speaker_company: '', speaker_designation: '', speaker_email: '' }]);
        } else {
            setModerators([...moderators, { moderator_name: '', moderator_company: '', moderator_designation: '', moderator_uuid: '' }]);
        }
    };

    const handleRemovePerson = (type, index) => {
        if (type === 'speaker') {
            setSpeakers(speakers.filter((_, i) => i !== index));
        } else {
            setModerators(moderators.filter((_, i) => i !== index));
        }
    };

    const handlePersonChange = (type, index, field, value) => {
        if (type === 'speaker') {
            const newSpeakers = [...speakers];
            newSpeakers[index][field] = value;
            setSpeakers(newSpeakers);
        } else {
            const newModerators = [...moderators];
            newModerators[index][field] = value;
            setModerators(newModerators);
        }
    };

    // Sortable JS Init
    useEffect(() => {
        if (isFormModalOpen && speakerListRef.current && !formData.speaker_default_alpha_sort) {
            speakerSortableRef.current = new Sortable(speakerListRef.current, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'dragging',
                onEnd: (evt) => {
                    const newSpeakers = [...speakers];
                    const [movedItem] = newSpeakers.splice(evt.oldIndex, 1);
                    newSpeakers.splice(evt.newIndex, 0, movedItem);
                    setSpeakers(newSpeakers);
                }
            });
        } else if (speakerSortableRef.current) {
            speakerSortableRef.current.destroy();
            speakerSortableRef.current = null;
        }
    }, [isFormModalOpen, formData.speaker_default_alpha_sort]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Token from context
            const data = new FormData();

            // Append basic fields
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            // Speakers & Moderators JSON
            data.append('speaker', JSON.stringify(speakers));
            data.append('moderator', JSON.stringify(moderators));

            // Image Blobs
            imageBlobs.forEach((blob, key) => {
                data.append(key, blob.blob, blob.filename);
            });

            if (isEditing) {
                await agendaService.updateAgenda(eventId, selectedAgenda.id, token, data);
            } else {
                await agendaService.createAgenda(eventId, token, data);
            }

            setIsFormModalOpen(false);
            fetchAgendas();
        } catch (err) {
            alert('Save failed: ' + err.message);
        }
    };

    const handleOpenForm = (agenda = null) => {
        if (agenda) {
            setIsEditing(true);
            setSelectedAgenda(agenda);
            setFormData({
                title: agenda.title || '',
                location: agenda.location || '',
                description: agenda.description || '',
                information: agenda.information || '',
                date: agenda.date || '',
                start: agenda.start || '',
                end: agenda.end || '',
                track_title: agenda.track_title || '',
                enrollable: agenda.enrollable || false,
                admin: agenda.admin || false,
                force_attendance: agenda.force_attendance || false,
                speaker_default_alpha_sort: agenda.speaker_default_alpha_sort ?? true
            });
            setSpeakers(agenda.speaker || []);
            setModerators(agenda.moderator || []);
            setPartnerLogo(agenda.partner_logo || null);
        } else {
            setIsEditing(false);
            setSelectedAgenda(null);
            setFormData({
                title: '',
                location: '',
                description: '',
                information: '',
                date: '',
                start: '',
                end: '',
                track_title: '',
                enrollable: false,
                admin: false,
                force_attendance: false,
                speaker_default_alpha_sort: true
            });
            setSpeakers([{ speaker_name: '', speaker_company: '', speaker_designation: '', speaker_email: '' }]);
            setModerators([{ moderator_name: '', moderator_company: '', moderator_designation: '', moderator_uuid: '' }]);
            setPartnerLogo(null);
        }
        setIsFormModalOpen(true);
    };

    const handleOpenView = (agenda) => {
        setSelectedAgenda(agenda);
        setIsViewModalOpen(true);
    };

    const deleteAgenda = async (agendaId) => {
        if (!window.confirm('Are you sure you want to delete this session?')) return;
        try {
            // Token from context
            await agendaService.deleteAgenda(eventId, agendaId, token);
            fetchAgendas();
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    useEffect(() => {
        if (isCropping) {
            initCropper();
        }
    }, [isCropping]);

    return (
        <div className="agenda-page animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b-2 border-slate-100">
                <div className="flex-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Agenda</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage sessions, speakers, and schedule</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50">
                        <button
                            className={`flex items-center justify-center p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                            onClick={() => setViewMode('card')}
                            title="Card View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`flex items-center justify-center p-2 rounded-lg transition-all ${viewMode === 'row' ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                            onClick={() => setViewMode('row')}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <div className="relative min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
                            placeholder="Search sessions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 hover:translate-y-[-2px] active:translate-y-0 transition-all shadow-lg shadow-blue-500/30" onClick={() => handleOpenForm()}>
                        <Plus size={18} />
                        <span>Add Session</span>
                    </button>
                </div>
            </div>

            {loading && agendas.length === 0 ? (
                <div className="loading-container">
                    <Loader2 className="spinner" size={40} />
                    <p>Loading agenda sessions...</p>
                </div>
            ) : (
                <>
                    <div className={viewMode === 'card' ? 'agenda-grid' : 'agenda-list-rows'}>
                        {agendas.map((item) => (
                            <div key={item.id} className={viewMode === 'card' ? 'agenda-card' : 'agenda-row'}>
                                {viewMode === 'card' ? (
                                    <>
                                        <div className="card-header">
                                            <span className="track-badge">{item.track_title || 'General'}</span>
                                            <button className="icon-btn-small" onClick={() => handleOpenForm(item)}>
                                                <Edit2 size={14} />
                                            </button>
                                        </div>

                                        <h3 className="card-title">{item.title}</h3>

                                        <div className="card-details">
                                            <div className="detail-item">
                                                <MapPin size={16} />
                                                <span>{item.location || 'Waitlist'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <Clock size={16} />
                                                <span>{item.date} • {item.start} - {item.end}</span>
                                            </div>
                                        </div>

                                        <div className="card-actions-row flex gap-2 mb-4">
                                            <button className="icon-btn-small" onClick={() => handleOpenView(item)}>
                                                <Eye size={14} />
                                            </button>
                                            <button className="icon-btn-small text-red-500" onClick={() => deleteAgenda(item.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="card-footer">
                                            <div className="speaker-avatars">
                                                {item.speaker && item.speaker.slice(0, 3).map((s, i) => (
                                                    <img
                                                        key={i}
                                                        src={s.speaker_image || 'https://via.placeholder.com/40'}
                                                        className="speaker-avatar-mini"
                                                        style={{ marginLeft: i > 0 ? '-8px' : '0' }}
                                                        alt="Speaker"
                                                    />
                                                ))}
                                            </div>
                                            {item.enrollable && <span className="joinable-badge">Joinable</span>}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center w-full gap-8">
                                        <div className="w-24 flex-shrink-0">
                                            <span className="track-badge !text-[10px] !px-2 !py-1 text-center block truncate border-blue-100/50">{item.track_title || 'General'}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-extrabold text-slate-900 text-base truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.title}</h3>
                                            <div className="flex flex-wrap items-center gap-y-1 gap-x-6 mt-1.5 text-xs text-slate-500 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-blue-500">
                                                        <MapPin size={12} />
                                                    </div>
                                                    <span>{item.location || 'Waitlist'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-blue-500">
                                                        <Clock size={12} />
                                                    </div>
                                                    <span>{item.date} • {item.start} - {item.end}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="speaker-avatars">
                                                {item.speaker && item.speaker.slice(0, 4).map((s, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-200"
                                                        style={{ marginLeft: i > 0 ? '-10px' : '0', zIndex: 10 - i }}
                                                    >
                                                        <img
                                                            src={s.speaker_image || 'https://via.placeholder.com/40'}
                                                            className="w-full h-full object-cover"
                                                            alt="Speaker"
                                                        />
                                                    </div>
                                                ))}
                                                {item.speaker && item.speaker.length > 4 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm" style={{ marginLeft: '-10px', zIndex: 5 }}>
                                                        +{item.speaker.length - 4}
                                                    </div>
                                                )}
                                            </div>

                                            {item.enrollable && (
                                                <span className="bg-green-50 text-green-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-green-100">
                                                    Joinable
                                                </span>
                                            )}

                                            <div className="flex gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-200/50">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-400 hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all" onClick={() => handleOpenView(item)} title="View Detail">
                                                    <Eye size={14} />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-400 hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all" onClick={() => handleOpenForm(item)} title="Edit Session">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-400 hover:text-red-500 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all" onClick={() => deleteAgenda(item.id)} title="Delete Session">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <span className="page-info">
                            Page {page} of {Math.ceil(total / pageSize) || 1}
                        </span>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={page >= Math.ceil(total / pageSize)}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </>
            )}

            {/* Form Modal (Create/Edit) */}
            {isFormModalOpen && (
                <div className="modal-overlay" onClick={() => setIsFormModalOpen(false)}>
                    <div className="modal-content form-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{isEditing ? 'Edit Agenda Session' : 'Create Agenda Session'}</h2>
                            <button className="icon-btn" onClick={() => setIsFormModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form id="agendaForm" onSubmit={handleSave} className="agenda-form-split">
                                <div className="form-left">
                                    <div className="form-section-header blue">
                                        <Plus size={20} />
                                        <h3>Basic Information</h3>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text" className="form-input" required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter session title..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text" className="form-input"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Lotus Ballroom, 3rd floor"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-textarea" rows="4"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Description of the session..."
                                        ></textarea>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Information</label>
                                        <textarea
                                            className="form-textarea" rows="3"
                                            value={formData.information}
                                            onChange={(e) => setFormData({ ...formData, information: e.target.value })}
                                            placeholder="Additional information..."
                                        ></textarea>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date" className="form-input" required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Track Title</label>
                                            <input
                                                type="text" className="form-input"
                                                placeholder="e.g. Panel, Workshop"
                                                value={formData.track_title}
                                                onChange={(e) => setFormData({ ...formData, track_title: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Start Time</label>
                                            <input
                                                type="time" className="form-input" required
                                                value={formData.start}
                                                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">End Time</label>
                                            <input
                                                type="time" className="form-input" required
                                                value={formData.end}
                                                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Options</label>
                                        <div className="grid grid-cols-2 gap-3 mt-1">
                                            <label className="form-checkbox-group">
                                                <input type="checkbox" checked={formData.enrollable} onChange={(e) => setFormData({ ...formData, enrollable: e.target.checked })} />
                                                <span className="text-xs font-bold uppercase">Joinable</span>
                                            </label>
                                            <label className="form-checkbox-group">
                                                <input type="checkbox" checked={formData.admin} onChange={(e) => setFormData({ ...formData, admin: e.target.checked })} />
                                                <span className="text-xs font-bold uppercase">Admin Only</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-right">
                                    <div className="speakers-list-header">
                                        <h3>Speakers List</h3>
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => handleAddPerson('speaker')}>
                                            <Plus size={14} /> Add Speaker
                                        </button>
                                    </div>
                                    <div className="speakers-list-container">
                                        <div className="sorting-options">
                                            <label className="sorting-option">
                                                <input
                                                    type="radio" name="speakerSort"
                                                    checked={formData.speaker_default_alpha_sort}
                                                    onChange={() => setFormData({ ...formData, speaker_default_alpha_sort: true })}
                                                />
                                                Sort By Alpha (Default)
                                            </label>
                                            <label className="sorting-option">
                                                <input
                                                    type="radio" name="speakerSort"
                                                    checked={!formData.speaker_default_alpha_sort}
                                                    onChange={() => setFormData({ ...formData, speaker_default_alpha_sort: false })}
                                                />
                                                Sort By Order (Manual)
                                            </label>
                                        </div>

                                        <div className="speakers-grid" ref={speakerListRef}>
                                            {speakers.map((s, idx) => (
                                                <div key={idx} className="speaker-card-compact">
                                                    {!formData.speaker_default_alpha_sort && (
                                                        <div className="drag-handle absolute left-1 top-1/2 -translate-y-1/2 text-slate-300">
                                                            <GripVertical size={16} />
                                                        </div>
                                                    )}
                                                    <div className="remove-speaker-x" onClick={() => handleRemovePerson('speaker', idx)}>
                                                        <X size={16} />
                                                    </div>

                                                    <div className="speaker-img-upload-group">
                                                        <div className="speaker-avatar-circle" onClick={() => handleImageClick('speaker', idx)}>
                                                            {s.speaker_image_preview || s.speaker_image ? (
                                                                <img src={s.speaker_image_preview || s.speaker_image} alt="Speaker" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <ImageIcon size={32} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="upload-pill" onClick={() => handleImageClick('speaker', idx)}>Upload</div>
                                                    </div>

                                                    <div className="speaker-form-fields">
                                                        <div className="speaker-field-grid">
                                                            <input
                                                                type="text" className="form-input" placeholder="Name"
                                                                value={s.speaker_name} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_name', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="form-input" placeholder="Company"
                                                                value={s.speaker_company} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_company', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="form-input full" placeholder="Designation"
                                                                value={s.speaker_designation} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_designation', e.target.value)}
                                                            />
                                                            <input
                                                                type="email" className="form-input full" placeholder="Email"
                                                                value={s.speaker_email} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_email', e.target.value)}
                                                            />
                                                            <textarea
                                                                className="form-textarea full" rows="1" placeholder="Bio"
                                                                value={s.speaker_bio || ''} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_bio', e.target.value)}
                                                            ></textarea>
                                                        </div>
                                                        <div className="speaker-card-footer">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Order</span>
                                                            <input
                                                                type="number" className="form-input order-input"
                                                                value={s.speaker_sort_order || 0}
                                                                onChange={(e) => handlePersonChange('speaker', idx, 'speaker_sort_order', parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="speakers-list-header mt-8">
                                        <h3>Moderators List</h3>
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => handleAddPerson('moderator')}>
                                            <Plus size={14} /> Add Moderator
                                        </button>
                                    </div>
                                    <div className="speakers-list-container">
                                        <div className="speakers-grid">
                                            {moderators.map((m, idx) => (
                                                <div key={idx} className="speaker-card-compact">
                                                    <div className="remove-speaker-x" onClick={() => handleRemovePerson('moderator', idx)}>
                                                        <X size={16} />
                                                    </div>

                                                    <div className="speaker-img-upload-group">
                                                        <div className="speaker-avatar-circle" onClick={() => handleImageClick('moderator', idx)}>
                                                            {m.moderator_image_preview || m.moderator_image ? (
                                                                <img src={m.moderator_image_preview || m.moderator_image} alt="Moderator" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <ImageIcon size={32} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="upload-pill" onClick={() => handleImageClick('moderator', idx)}>Upload</div>
                                                    </div>

                                                    <div className="speaker-form-fields">
                                                        <div className="speaker-field-grid">
                                                            <input
                                                                type="text" className="form-input" placeholder="Name"
                                                                value={m.moderator_name} onChange={(e) => handlePersonChange('moderator', idx, 'moderator_name', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="form-input" placeholder="Company"
                                                                value={m.moderator_company} onChange={(e) => handlePersonChange('moderator', idx, 'moderator_company', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="form-input full" placeholder="Designation"
                                                                value={m.moderator_designation} onChange={(e) => handlePersonChange('moderator', idx, 'moderator_designation', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="form-input full" placeholder="UUID (Optional)"
                                                                value={m.moderator_uuid} onChange={(e) => handlePersonChange('moderator', idx, 'moderator_uuid', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setIsFormModalOpen(false)}>Cancel</button>
                            <button type="submit" form="agendaForm" className="btn btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cropper Modal */}
            {
                isCropping && (
                    <div className="modal-overlay" style={{ zIndex: 1100 }}>
                        <div className="modal-content cropper-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Crop Image</h2>
                                <button className="icon-btn" onClick={() => setIsCropping(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="cropper-container">
                                    <img ref={imageRef} src={croppingTarget.url} alt="To crop" style={{ maxWidth: '100%', display: 'block' }} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setIsCropping(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSaveCrop}>Apply Crop</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Read-only View Modal */}
            {
                isViewModalOpen && selectedAgenda && (
                    <div className="modal-overlay" onClick={() => setIsViewModalOpen(false)}>
                        <div className="modal-content view-modal-container" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Session Details</h2>
                                <button className="icon-btn" onClick={() => setIsViewModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="view-session-header-premium">
                                    <span className="track-badge mb-4 inline-block">{selectedAgenda.track_title || 'General Session'}</span>
                                    <h1 className="text-3xl font-black text-slate-900 leading-tight mb-8">{selectedAgenda.title}</h1>

                                    <div className="view-meta-row">
                                        <div className="view-info-pill">
                                            <div className="view-info-pill-icon"><Calendar size={20} /></div>
                                            <div className="view-info-pill-text">
                                                <label>Date</label>
                                                <div className="val">{selectedAgenda.date}</div>
                                            </div>
                                        </div>
                                        <div className="view-info-pill">
                                            <div className="view-info-pill-icon"><Clock size={20} /></div>
                                            <div className="view-info-pill-text">
                                                <label>Timing</label>
                                                <div className="val">{selectedAgenda.start} - {selectedAgenda.end}</div>
                                            </div>
                                        </div>
                                        {selectedAgenda.location && (
                                            <div className="view-info-pill">
                                                <div className="view-info-pill-icon"><MapPin size={20} /></div>
                                                <div className="view-info-pill-text">
                                                    <label>Location</label>
                                                    <div className="val">{selectedAgenda.location}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedAgenda.description && (
                                    <div className="mb-12">
                                        <h4 className="view-section-title-small font-black">About Session</h4>
                                        <div className="view-description-text">{selectedAgenda.description}</div>
                                    </div>
                                )}

                                {selectedAgenda.speaker && selectedAgenda.speaker.length > 0 && (
                                    <div className="mb-12">
                                        <h4 className="view-section-title-small font-black">Distinguished Speakers</h4>
                                        <div className="speaker-view-grid">
                                            {selectedAgenda.speaker.map((s, idx) => (
                                                <div key={idx} className="speaker-view-item">
                                                    <div className="speaker-view-img">
                                                        {s.speaker_image ? <img src={s.speaker_image} alt={s.speaker_name} /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><Users size={24} className="text-slate-300" /></div>}
                                                    </div>
                                                    <div className="speaker-view-info">
                                                        <div className="name">{s.speaker_name}</div>
                                                        <div className="title">{s.speaker_designation}</div>
                                                        <div className="comp">{s.speaker_company}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>Close Window</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Agenda;
