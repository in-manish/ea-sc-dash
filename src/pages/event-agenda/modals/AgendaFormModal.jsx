import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Plus, Trash2, Users, Upload, Image as ImageIcon, Mail } from 'lucide-react';
import Sortable from 'sortablejs';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { agendaService } from '../../../services/agendaService';

const AgendaFormModal = ({ isOpen, onClose, agenda, eventId, token, onSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
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
    const [, setPartnerLogo] = useState(null);
    const [imageBlobs, setImageBlobs] = useState(new Map());

    const [isCropping, setIsCropping] = useState(false);
    const [croppingTarget, setCroppingTarget] = useState(null);

    const speakerListRef = useRef(null);
    const speakerSortableRef = useRef(null);
    const cropperRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (agenda) {
                setIsEditing(true);
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
            setImageBlobs(new Map());
        }
    }, [isOpen, agenda]);

    useEffect(() => {
        if (isOpen && speakerListRef.current && !formData.speaker_default_alpha_sort) {
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
    }, [isOpen, formData.speaker_default_alpha_sort, speakers]);

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

    useEffect(() => {
        if (isCropping && imageRef.current) {
            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: croppingTarget.type === 'logo' ? NaN : 1,
                viewMode: 1,
            });
        }
        return () => {
            if (cropperRef.current) {
                cropperRef.current.destroy();
                cropperRef.current = null;
            }
        };
    }, [isCropping, croppingTarget]);

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
            }, 'image/jpeg', 0.8);
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

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            data.append('speaker', JSON.stringify(speakers));
            data.append('moderator', JSON.stringify(moderators));
            imageBlobs.forEach((blob, key) => {
                data.append(key, blob.blob, blob.filename);
            });

            if (isEditing) {
                await agendaService.updateAgenda(eventId, agenda.id, token, data);
            } else {
                await agendaService.createAgenda(eventId, token, data);
            }

            onSuccess();
            onClose();
        } catch (err) {
            alert('Save failed: ' + err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-md animate-backdrop-smooth" onClick={onClose} />

            <div className="relative bg-bg-primary rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-modal-smooth mesh-bg border border-white/50 my-auto">
                <div className="p-6 border-b border-border flex justify-between items-center bg-white/40 backdrop-blur-sm relative z-10">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-black text-text-primary tracking-tight">
                            {isEditing ? 'Update Session' : 'Deploy New Session'}
                        </h2>
                        <p className="text-text-tertiary text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <Calendar size={14} className="text-accent" /> Agenda Configuration Portal
                        </p>
                    </div>
                    <button className="p-2.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-all" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 max-h-[calc(90vh-140px)] overflow-y-auto relative z-10 custom-scrollbar">
                    <form id="agendaForm" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 pb-4">
                        <div className="space-y-6 lg:pr-10 lg:border-r border-border/50">
                            <div className="flex items-center gap-3.5 p-4 bg-accent/5 rounded-2xl border border-accent/10">
                                <div className="p-2.5 rounded-lg bg-accent text-white shadow-lg shadow-accent/20">
                                    <Calendar size={18} />
                                </div>
                                <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.15em]">Primary Details</h3>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">Session Title</label>
                                <input
                                    type="text" className="w-full px-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-xl text-xs font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner" required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter session title..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">Venue / Location</label>
                                <div className="relative group">
                                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="text" className="w-full pl-10 pr-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-xl text-xs font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Grand Ballroom"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">Track & Category</label>
                                <input
                                    type="text" className="w-full px-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-xl text-xs font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
                                    placeholder="e.g. Main Track, Workshop"
                                    value={formData.track_title}
                                    onChange={(e) => setFormData({ ...formData, track_title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">Date</label>
                                <input
                                    type="date" className="w-full px-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-xl text-xs font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner" required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">Start</label>
                                    <input
                                        type="time" className="w-full px-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-xl text-xs font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner" required
                                        value={formData.start}
                                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">End</label>
                                    <input
                                        type="time" className="w-full px-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-xl text-xs font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner" required
                                        value={formData.end}
                                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">Access Control</label>
                                <div className="grid grid-cols-1 gap-2.5">
                                    <label className="group flex items-center justify-between p-3.5 bg-bg-secondary/50 rounded-xl border-2 border-border/50 cursor-pointer transition-all hover:bg-white hover:border-success/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">Joinable Session</span>
                                        </div>
                                        <input type="checkbox" className="w-4 h-4 rounded-md accent-success cursor-pointer" checked={formData.enrollable} onChange={(e) => setFormData({ ...formData, enrollable: e.target.checked })} />
                                    </label>
                                    <label className="group flex items-center justify-between p-3.5 bg-bg-secondary/50 rounded-xl border-2 border-border/50 cursor-pointer transition-all hover:bg-white hover:border-accent/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(15,23,42,0.5)]" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">Admin Visibility Only</span>
                                        </div>
                                        <input type="checkbox" className="w-4 h-4 rounded-md accent-accent cursor-pointer" checked={formData.admin} onChange={(e) => setFormData({ ...formData, admin: e.target.checked })} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-accent py-4 px-8 rounded-2xl flex justify-between items-center text-white shadow-xl shadow-accent/10 border border-white/10 mesh-bg-cosmic relative overflow-hidden">
                                <div className="absolute inset-0 glossy-overlay" />
                                <div className="relative z-10 flex items-center gap-3.5">
                                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
                                        <Users size={18} />
                                    </div>
                                    <div className="space-y-0">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Speaker Roster</h3>
                                        <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest">Manage session contributors</p>
                                    </div>
                                </div>
                                <button type="button" className="relative z-10 bg-white text-accent px-5 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95" onClick={() => handleAddPerson('speaker')}>
                                    <Plus size={14} className="inline mr-1" /> Add Speaker
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" ref={speakerListRef}>
                                {speakers.map((s, idx) => (
                                    <div key={idx} className="bg-bg-primary border-2 border-border/30 rounded-2xl p-5 space-y-5 relative transition-all duration-300 hover:shadow-premium hover:border-accent/10 group">
                                        <button type="button" className="absolute top-3 right-3 text-text-tertiary hover:text-danger p-1.5 rounded-lg transition-all" onClick={() => handleRemovePerson('speaker', idx)}>
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="flex items-center gap-5">
                                            <div className="relative group/avatar">
                                                <div className="w-20 h-20 rounded-2xl bg-bg-secondary overflow-hidden border-[3px] border-white shadow-premium cursor-pointer relative" onClick={() => handleImageClick('speaker', idx)}>
                                                    {s.speaker_image_preview || s.speaker_image ? (
                                                        <img src={s.speaker_image_preview || s.speaker_image} alt="Speaker" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                                                            <ImageIcon size={28} />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-accent/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Upload className="text-white" size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <input
                                                    type="text" className="w-full bg-transparent border-b-2 border-border/50 focus:border-accent text-xs font-black placeholder:text-text-tertiary transition-all pb-0.5 focus:outline-none" placeholder="Name"
                                                    value={s.speaker_name} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_name', e.target.value)}
                                                />
                                                <input
                                                    type="text" className="w-full bg-transparent border-b-2 border-border/50 focus:border-accent text-[10px] font-bold uppercase tracking-widest placeholder:text-text-tertiary transition-all pb-0.5 focus:outline-none" placeholder="Designation"
                                                    value={s.speaker_designation} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_designation', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="relative">
                                                <Mail size={12} className="absolute left-0 top-1/2 -translate-y-1/2 text-text-tertiary" />
                                                <input
                                                    type="email" className="w-full pl-5 bg-transparent border-b border-border/50 focus:border-accent text-[10px] font-medium placeholder:text-text-tertiary transition-all py-1.5 focus:outline-none text-text-secondary" placeholder="Email Address"
                                                    value={s.speaker_email} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_email', e.target.value)}
                                                />
                                            </div>
                                            <textarea
                                                className="w-full bg-bg-secondary/50 border-2 border-border/50 rounded-xl p-2.5 text-[11px] font-medium placeholder:text-text-tertiary transition-all focus:outline-none focus:border-accent focus:bg-white" rows="2" placeholder="Professional Biography..."
                                                value={s.speaker_bio || ''} onChange={(e) => handlePersonChange('speaker', idx, 'speaker_bio', e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">Additional Information</label>
                                <textarea
                                    className="w-full p-4 bg-bg-secondary/50 border-2 border-border/50 rounded-2xl text-xs font-medium focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner" rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Markdown supported description of the session..."
                                ></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="p-6 bg-white/40 backdrop-blur-md border-t border-border flex justify-end gap-3.5 relative z-10">
                    <button className="px-8 py-3 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] text-text-secondary hover:bg-bg-tertiary transition-all" onClick={onClose}>Discard</button>
                    <button type="submit" form="agendaForm" className="px-10 py-3 bg-accent text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-accent/10 hover:scale-105 active:scale-95 transition-all">
                        {isEditing ? 'Sync Changes' : 'Initialize Session'}
                    </button>
                </div>
            </div>

            {/* Cropper Modal */}
            {isCropping && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-text-primary/60 backdrop-blur-xl animate-fade-in">
                    <div className="bg-bg-primary rounded-[3rem] shadow-2xl overflow-hidden animate-[modalPop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] max-w-xl w-full border border-white/30 mesh-bg">
                        <div className="p-8 border-b border-border flex justify-between items-center bg-white/40 backdrop-blur-sm">
                            <h2 className="text-2xl font-black text-text-primary tracking-tight">Precision Crop</h2>
                            <button className="p-2 rounded-2xl text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-all" onClick={() => setIsCropping(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-10 flex flex-col items-center">
                            <div className="rounded-3xl overflow-hidden border-2 border-border shadow-inner bg-bg-secondary p-2 max-w-full">
                                <img ref={imageRef} src={croppingTarget.url} alt="To crop" className="max-w-full block rounded-2xl" />
                            </div>
                            <p className="mt-8 text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] text-center">Adjust frame to focus on the contributor</p>
                        </div>
                        <div className="p-8 bg-white/40 backdrop-blur-md border-t border-border flex justify-end gap-4">
                            <button className="px-8 py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] text-text-secondary hover:bg-bg-tertiary transition-all" onClick={() => setIsCropping(false)}>Cancel</button>
                            <button className="px-10 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all" onClick={handleSaveCrop}>Apply Selection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendaFormModal;
