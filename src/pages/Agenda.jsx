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

const Agenda = () => {
    const { id: eventId } = useParams();
    const { token } = useAuth();
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
    const [, setPartnerLogo] = useState(null); // File or URL
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
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto bg-slate-50 min-h-[calc(100vh-64px)] animate-fade-in">
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

                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(37,99,235,0.25)] active:scale-95 transition-all" onClick={() => handleOpenForm()}>
                        <Plus size={18} />
                        <span>Add Session</span>
                    </button>
                </div>
            </div>

            {loading && agendas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p>Loading agenda sessions...</p>
                </div>
            ) : (
                <>
                    <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12 animate-fade-in' : 'flex flex-col gap-4 mb-12 animate-fade-in'}>
                        {agendas.map((item) => (
                            <div key={item.id} className={viewMode === 'card' ? 'bg-white p-6 rounded-[1.25rem] border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_20px_-5px_rgba(0,0,0,0.03)] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative overflow-hidden flex flex-col group hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)] hover:-translate-y-1.5 hover:border-blue-600/10' : 'bg-white py-5 px-8 rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center relative cursor-pointer group hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:border-blue-600/40 hover:z-10'}>
                                {viewMode === 'card' ? (
                                    <>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.1em] py-2 px-4 bg-blue-50 text-blue-600 rounded-full border border-blue-600/10 transition-all duration-300">{item.track_title || 'General'}</span>
                                            <button className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 transition-all duration-200 hover:text-blue-600 hover:bg-white hover:border-blue-600 hover:scale-110" onClick={() => handleOpenForm(item)}>
                                                <Edit2 size={14} />
                                            </button>
                                        </div>

                                        <h3 className="text-lg font-extrabold text-slate-900 mb-4 leading-relaxed line-clamp-2 h-[3.1rem]">{item.title}</h3>

                                        <div className="flex flex-col gap-2.5 mb-6">
                                            <div className="flex items-center gap-3.5 text-sm text-slate-500 font-medium [&>svg]:text-slate-400">
                                                <MapPin size={16} />
                                                <span>{item.location || 'Waitlist'}</span>
                                            </div>
                                            <div className="flex items-center gap-3.5 text-sm text-slate-500 font-medium [&>svg]:text-slate-400">
                                                <Clock size={16} />
                                                <span>{item.date} • {item.start} - {item.end}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mb-4 opacity-0 -translate-x-2.5 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:opacity-100 group-hover:translate-x-0">
                                            <button className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 transition-all duration-200 hover:text-blue-600 hover:bg-white hover:border-blue-600 hover:scale-110" onClick={() => handleOpenView(item)}>
                                                <Eye size={14} />
                                            </button>
                                            <button className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 transition-all duration-200 hover:!text-red-500 hover:bg-white hover:!border-red-500 hover:scale-110" onClick={() => deleteAgenda(item.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="pt-5 border-t border-slate-100 mt-auto flex justify-between items-center">
                                            <div className="flex items-center">
                                                {item.speaker && item.speaker.slice(0, 3).map((s, i) => (
                                                    <img
                                                        key={i}
                                                        src={s.speaker_image || 'https://via.placeholder.com/40'}
                                                        className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 object-cover"
                                                        style={{ marginLeft: i > 0 ? '-8px' : '0' }}
                                                        alt="Speaker"
                                                    />
                                                ))}
                                            </div>
                                            {item.enrollable && <span className="bg-green-50 text-green-800 text-[0.625rem] font-extrabold py-1.5 px-3.5 rounded-xl uppercase tracking-wider">Joinable</span>}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center w-full gap-8">
                                        <div className="w-24 flex-shrink-0">
                                            <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.1em] py-2 px-4 bg-blue-50 text-blue-600 rounded-full border border-blue-600/10 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 !text-[10px] !px-2 !py-1 text-center block truncate border-blue-100/50">{item.track_title || 'General'}</span>
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
                                            <div className="flex items-center">
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

                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            className="inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed !py-1.5 !px-3.5 !text-xs !rounded-lg font-extrabold"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <span className="text-sm font-semibold text-slate-600">
                            Page {page} of {Math.ceil(total / pageSize) || 1}
                        </span>
                        <button
                            className="inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed !py-1.5 !px-3.5 !text-xs !rounded-lg font-extrabold"
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
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-6 animate-fade-in" onClick={() => setIsFormModalOpen(false)}>
                    <div className="bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden animate-[modalPop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] max-w-[1100px] w-[95vw]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-[1.375rem] font-black text-slate-900 tracking-[-0.02em]">{isEditing ? 'Edit Agenda Session' : 'Create Agenda Session'}</h2>
                            <button className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center" onClick={() => setIsFormModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 max-h-[calc(90vh-160px)] overflow-y-auto">
                            <form id="agendaForm" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 lg:gap-10">
                                <div className="lg:pr-6 lg:border-r-0 lg:border-b-0 border-b-2 border-slate-100 pb-8 lg:pb-0">
                                    <div className="flex items-center gap-3.5 mb-8 text-blue-600">
                                        <Plus size={20} />
                                        <h3 className="text-lg font-extrabold text-slate-900">Basic Information</h3>
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-[0.6875rem] font-extrabold uppercase text-slate-400 tracking-[0.08em] mb-1.5">Title</label>
                                        <input
                                            type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter session title..."
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-[0.6875rem] font-extrabold uppercase text-slate-400 tracking-[0.08em] mb-1.5">Location</label>
                                        <input
                                            type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Lotus Ballroom, 3rd floor"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-[0.6875rem] font-extrabold uppercase text-slate-400 tracking-[0.08em] mb-1.5">Description</label>
                                        <textarea
                                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" rows="4"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Description of the session..."
                                        ></textarea>
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-[0.6875rem] font-extrabold uppercase text-slate-400 tracking-[0.08em] mb-1.5">Information</label>
                                        <textarea
                                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" rows="3"
                                            value={formData.information}
                                            onChange={(e) => setFormData({ ...formData, information: e.target.value })}
                                            placeholder="Additional information..."
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="mb-5">
                                            <label className="block text-[0.6875rem] font-extrabold uppercase text-slate-400 tracking-[0.08em] mb-1.5">Date</label>
                                            <input
                                                type="date" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label className="block text-[0.6875rem] font-extrabold uppercase text-slate-400 tracking-[0.08em] mb-1.5">Track Title</label>
                                            <input
                                                type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                                                placeholder="e.g. Panel, Workshop"
                                                value={formData.track_title}
                                                onChange={(e) => setFormData({ ...formData, track_title: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="mb-5">
                                            <label className="block text-[0.6875rem] font-extrabold uppercase text-slate-400 tracking-[0.08em] mb-1.5">Start Time</label>
                                            <input
                                                type="time" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" required
                                                value={formData.start}
                                                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label className="block text-[0.6875rem] font-extrabold uppercase text-slate-400 tracking-[0.08em] mb-1.5">End Time</label>
                                            <input
                                                type="time" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" required
                                                value={formData.end}
                                                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-[0.6875rem] font-extrabold uppercase text-slate-400 tracking-[0.08em] mb-1.5">Options</label>
                                        <div className="grid grid-cols-2 gap-3 mt-1">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={formData.enrollable} onChange={(e) => setFormData({ ...formData, enrollable: e.target.checked })} />
                                                <span className="text-xs font-bold uppercase">Joinable</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={formData.admin} onChange={(e) => setFormData({ ...formData, admin: e.target.checked })} />
                                                <span className="text-xs font-bold uppercase">Admin Only</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="bg-slate-800 py-4 px-6 rounded-t-2xl flex justify-between items-center text-white">
                                        <h3 className="text-[0.8125rem] font-extrabold uppercase tracking-[0.1em]">Speakers List</h3>
                                        <button type="button" className="inline-flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 whitespace-nowrap bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(37,99,235,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed !py-1.5 !px-3.5 !text-xs !rounded-lg font-extrabold" onClick={() => handleAddPerson('speaker')}>
                                            <Plus size={14} /> Add Speaker
                                        </button>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 border-t-0 rounded-b-2xl p-6">
                                        <div className="flex gap-6 mb-6 pb-4 border-b border-slate-200">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                                                <input
                                                    type="radio" name="speakerSort" className="w-3.5 h-3.5 m-0"
                                                    checked={formData.speaker_default_alpha_sort}
                                                    onChange={() => setFormData({ ...formData, speaker_default_alpha_sort: true })}
                                                />
                                                Sort By Alpha (Default)
                                            </label>
                                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                                                <input
                                                    type="radio" name="speakerSort" className="w-3.5 h-3.5 m-0"
                                                    checked={!formData.speaker_default_alpha_sort}
                                                    onChange={() => setFormData({ ...formData, speaker_default_alpha_sort: false })}
                                                />
                                                Sort By Order (Manual)
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4" ref={speakerListRef}>
                                            {speakers.map((s, idx) => (
                                                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 relative transition-all duration-300 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
                                                    {!formData.speaker_default_alpha_sort && (
                                                        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-300 cursor-move">
                                                            <GripVertical size={16} />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2.5 right-2.5 text-red-500 cursor-pointer opacity-50 transition-opacity duration-200 hover:opacity-100" onClick={() => handleRemovePerson('speaker', idx)}>
                                                        <X size={16} />
                                                    </div>

                                                    <div className="w-16 flex flex-col items-center gap-2">
                                                        <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-[0_0_0_1px_#e2e8f0] cursor-pointer" onClick={() => handleImageClick('speaker', idx)}>
                                                            {s.speaker_image_preview || s.speaker_image ? (
                                                                <img src={s.speaker_image_preview || s.speaker_image} alt="Speaker" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <ImageIcon size={32} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="bg-slate-800 text-white text-[0.625rem] font-extrabold uppercase py-0.5 px-2.5 rounded-full cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => handleImageClick('speaker', idx)}>Upload</div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="grid grid-cols-2 gap-2.5">
                                                            <input
                                                                type="text" className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" placeholder="Name"
                                                                value={s.speaker_name} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_name', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" placeholder="Company"
                                                                value={s.speaker_company} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_company', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="col-span-2 w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" placeholder="Designation"
                                                                value={s.speaker_designation} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_designation', e.target.value)}
                                                            />
                                                            <input
                                                                type="email" className="col-span-2 w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" placeholder="Email"
                                                                value={s.speaker_email} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_email', e.target.value)}
                                                            />
                                                            <textarea
                                                                className="col-span-2 w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" rows="1" placeholder="Bio"
                                                                value={s.speaker_bio || ''} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_bio', e.target.value)}
                                                            ></textarea>
                                                        </div>
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Order</span>
                                                            <input
                                                                type="number" className="w-16 py-1.5 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                                                                value={s.speaker_sort_order || 0}
                                                                onChange={(e) => handlePersonChange('speaker', idx, 'speaker_sort_order', parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-800 py-4 px-6 rounded-t-2xl flex justify-between items-center text-white mt-8">
                                        <h3 className="text-[0.8125rem] font-extrabold uppercase tracking-[0.1em]">Moderators List</h3>
                                        <button type="button" className="inline-flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 whitespace-nowrap bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(37,99,235,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed !py-1.5 !px-3.5 !text-xs !rounded-lg font-extrabold" onClick={() => handleAddPerson('moderator')}>
                                            <Plus size={14} /> Add Moderator
                                        </button>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 border-t-0 rounded-b-2xl p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                                            {moderators.map((m, idx) => (
                                                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 relative transition-all duration-300 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
                                                    <div className="absolute top-2.5 right-2.5 text-red-500 cursor-pointer opacity-50 transition-opacity duration-200 hover:opacity-100" onClick={() => handleRemovePerson('moderator', idx)}>
                                                        <X size={16} />
                                                    </div>

                                                    <div className="w-16 flex flex-col items-center gap-2">
                                                        <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-[0_0_0_1px_#e2e8f0] cursor-pointer" onClick={() => handleImageClick('moderator', idx)}>
                                                            {m.moderator_image_preview || m.moderator_image ? (
                                                                <img src={m.moderator_image_preview || m.moderator_image} alt="Moderator" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <ImageIcon size={32} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="bg-slate-800 text-white text-[0.625rem] font-extrabold uppercase py-0.5 px-2.5 rounded-full cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => handleImageClick('moderator', idx)}>Upload</div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="grid grid-cols-2 gap-2.5">
                                                            <input
                                                                type="text" className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" placeholder="Name"
                                                                value={m.moderator_name} onChange={(e) => handlePersonChange('moderator', idx, 'moderator_name', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" placeholder="Company"
                                                                value={m.moderator_company} onChange={(e) => handlePersonChange('moderator', idx, 'moderator_company', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="col-span-2 w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" placeholder="Designation"
                                                                value={m.moderator_designation} onChange={(e) => handlePersonChange('moderator', idx, 'moderator_designation', e.target.value)}
                                                            />
                                                            <input
                                                                type="text" className="col-span-2 w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" placeholder="UUID (Optional)"
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
                        <div className="py-6 px-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                            <button className="inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap bg-white text-slate-600 py-2.5 px-5 rounded-xl font-extrabold text-sm border border-slate-200 hover:bg-slate-50 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setIsFormModalOpen(false)}>Cancel</button>
                            <button type="submit" form="agendaForm" className="inline-flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 whitespace-nowrap bg-blue-600 text-white py-2.5 px-5 rounded-xl font-extrabold text-sm shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(37,99,235,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cropper Modal */}
            {
                isCropping && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in" style={{ zIndex: 1100 }}>
                        <div className="bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden animate-[modalPop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] max-w-lg w-[95vw]" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-[1.375rem] font-black text-slate-900 tracking-[-0.02em]">Crop Image</h2>
                                <button className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center" onClick={() => setIsCropping(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 max-h-[calc(90vh-160px)] overflow-y-auto">
                                <div className="max-w-[400px] w-full mx-auto">
                                    <img ref={imageRef} src={croppingTarget.url} alt="To crop" style={{ maxWidth: '100%', display: 'block' }} />
                                </div>
                            </div>
                            <div className="py-6 px-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                                <button className="inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap bg-white text-slate-600 py-2.5 px-5 rounded-xl font-extrabold text-sm border border-slate-200 hover:bg-slate-50 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setIsCropping(false)}>Cancel</button>
                                <button className="inline-flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 whitespace-nowrap bg-blue-600 text-white py-2.5 px-5 rounded-xl font-extrabold text-sm shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(37,99,235,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSaveCrop}>Apply Crop</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Read-only View Modal */}
            {
                isViewModalOpen && selectedAgenda && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-6 animate-fade-in" onClick={() => setIsViewModalOpen(false)}>
                        <div className="bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden animate-[modalPop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] max-w-3xl w-[95vw]" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-[1.375rem] font-black text-slate-900 tracking-[-0.02em]">Session Details</h2>
                                <button className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center" onClick={() => setIsViewModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 max-h-[calc(90vh-160px)] overflow-y-auto">
                                <div className="text-center py-10 px-6 border-b border-slate-100 bg-slate-50 relative overflow-hidden mb-8">
                                    <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.1em] py-2 px-4 bg-blue-50 text-blue-600 rounded-full border border-blue-600/10 transition-all duration-300 mb-4 inline-block">{selectedAgenda.track_title || 'General Session'}</span>
                                    <h1 className="text-3xl font-black text-slate-900 leading-tight mb-8">{selectedAgenda.title}</h1>

                                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                                        <div className="bg-white border border-slate-200 py-3 px-5 rounded-2xl flex items-center gap-4 text-left shadow-sm min-w-[200px]">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Calendar size={20} /></div>
                                            <div className="flex-1">
                                                <label className="block text-[0.625rem] font-extrabold uppercase text-slate-400 tracking-widest mb-1">Date</label>
                                                <div className="font-bold text-slate-900 text-sm">{selectedAgenda.date}</div>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-slate-200 py-3 px-5 rounded-2xl flex items-center gap-4 text-left shadow-sm min-w-[200px]">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Clock size={20} /></div>
                                            <div className="flex-1">
                                                <label className="block text-[0.625rem] font-extrabold uppercase text-slate-400 tracking-widest mb-1">Timing</label>
                                                <div className="font-bold text-slate-900 text-sm">{selectedAgenda.start} - {selectedAgenda.end}</div>
                                            </div>
                                        </div>
                                        {selectedAgenda.location && (
                                            <div className="bg-white border border-slate-200 py-3 px-5 rounded-2xl flex items-center gap-4 text-left shadow-sm min-w-[200px]">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><MapPin size={20} /></div>
                                                <div className="flex-1">
                                                    <label className="block text-[0.625rem] font-extrabold uppercase text-slate-400 tracking-widest mb-1">Location</label>
                                                    <div className="font-bold text-slate-900 text-sm">{selectedAgenda.location}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedAgenda.description && (
                                    <div className="mb-12">
                                        <h4 className="text-[0.6875rem] font-black uppercase text-slate-400 tracking-[0.1em] mb-4 flex items-center gap-3 after:content-[''] after:h-px after:flex-1 after:bg-slate-100">About Session</h4>
                                        <div className="text-slate-600 leading-relaxed text-[0.9375rem]">{selectedAgenda.description}</div>
                                    </div>
                                )}

                                {selectedAgenda.speaker && selectedAgenda.speaker.length > 0 && (
                                    <div className="mb-12">
                                        <h4 className="text-[0.6875rem] font-black uppercase text-slate-400 tracking-[0.1em] mb-4 flex items-center gap-3 after:content-[''] after:h-px after:flex-1 after:bg-slate-100">Distinguished Speakers</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {selectedAgenda.speaker.map((s, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-slate-50 transition-colors">
                                                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-slate-100">
                                                        {s.speaker_image ? <img src={s.speaker_image} alt={s.speaker_name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><Users size={24} className="text-slate-300" /></div>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-extrabold text-slate-900 text-sm truncate">{s.speaker_name}</div>
                                                        <div className="text-[0.6875rem] font-bold text-blue-600 truncate mb-0.5">{s.speaker_designation}</div>
                                                        <div className="text-xs text-slate-500 truncate">{s.speaker_company}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="py-6 px-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                                <button className="inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap bg-white text-slate-600 py-2.5 px-5 rounded-xl font-extrabold text-sm border border-slate-200 hover:bg-slate-50 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setIsViewModalOpen(false)}>Close Window</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Agenda;
