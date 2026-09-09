import React, { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Video, Play, X } from 'lucide-react';
import { SectionHeader, FormField } from './components/SharedComponents';

const IMAGE_FIELDS = [
    { name: 'logo', label: 'Logo', description: 'Primary event logo.' },
    { name: 'logo2', label: 'Logo (Secondary)', description: 'Secondary/alternate logo, used where the primary logo does not fit.' },
    { name: 'event_background_image', label: 'Event Background Image', description: 'Background image used across event pages.' },
    { name: 'event_banner_logo', label: 'Event Banner Logo', description: 'Logo shown on the event banner.' },
    { name: 'meetingdiary_portal_bg_image', label: 'Meeting Diary Portal Background', description: 'Background image for the meeting diary portal.' },
];

const MediaField = ({ label, description, name, kind, eventData, handleFileChange, isFieldModified, posterUrl }) => {
    const value = eventData[name];
    const isFile = value instanceof File;
    const stringUrl = typeof value === 'string' ? value : '';
    const inputId = `media-field-${name}`;

    const previewUrl = useMemo(
        () => (isFile ? URL.createObjectURL(value) : stringUrl),
        [isFile, value, stringUrl]
    );
    useEffect(() => {
        if (!isFile) return undefined;
        return () => URL.revokeObjectURL(previewUrl);
    }, [isFile, previewUrl]);

    const modified = isFieldModified(name);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const isVideo = kind === 'video';

    return (
        <FormField label={label} description={description}>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div
                    className={`relative flex items-center justify-center w-32 h-20 rounded-lg border border-border bg-bg-secondary overflow-hidden shrink-0 ${isVideo && previewUrl ? 'group cursor-pointer' : ''}`}
                    onClick={() => {
                        if (isVideo && previewUrl) setIsPlayerOpen(true);
                    }}
                >
                    {previewUrl ? (
                        isVideo ? (
                            <>
                                <video src={previewUrl} poster={posterUrl || undefined} className="w-full h-full object-cover" muted playsInline />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-black shadow group-hover:scale-110 transition-transform">
                                        <Play size={14} fill="currentColor" className="ml-0.5" />
                                    </span>
                                </div>
                            </>
                        ) : (
                            <img src={previewUrl} alt="" className="w-full h-full object-contain" />
                        )
                    ) : (
                        <span className="text-[10px] text-text-tertiary px-2 text-center">No {kind}</span>
                    )}
                </div>

                <div className="flex-1 w-full min-w-0 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <input
                            id={inputId}
                            type="file"
                            accept={kind === 'video' ? 'video/*' : 'image/*'}
                            className="sr-only"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileChange(name, file);
                                e.target.value = '';
                            }}
                        />
                        <label
                            htmlFor={inputId}
                            className={`btn btn-secondary text-xs cursor-pointer ${modified ? 'border-amber-500 text-amber-700' : ''}`}
                        >
                            {value ? `Replace ${kind}` : `Upload ${kind}`}
                        </label>
                        {value && (
                            <button
                                type="button"
                                onClick={() => handleFileChange(name, '')}
                                className="text-xs text-red-600 hover:underline"
                            >
                                Clear
                            </button>
                        )}
                        {modified && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded">
                                Modified
                            </span>
                        )}
                    </div>
                    {stringUrl && (
                        <p className="text-[10px] text-text-tertiary truncate max-w-full break-all">{stringUrl}</p>
                    )}
                    {isFile && (
                        <p className="text-[10px] text-text-tertiary truncate">{value.name} (new upload, saved on submit)</p>
                    )}
                </div>
            </div>

            {isVideo && isPlayerOpen && previewUrl && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="fixed inset-0 bg-text-primary/40 backdrop-blur-md animate-backdrop-smooth"
                        onClick={() => setIsPlayerOpen(false)}
                    />
                    <div className="relative bg-bg-primary rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-modal-smooth resize overflow-auto min-w-[320px] min-h-[220px]">
                        <button
                            type="button"
                            onClick={() => setIsPlayerOpen(false)}
                            className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                            aria-label="Close video"
                        >
                            <X size={16} />
                        </button>
                        <video
                            src={previewUrl}
                            poster={posterUrl || undefined}
                            className="w-full h-full max-h-[80vh] bg-black"
                            controls
                            autoPlay
                            playsInline
                        />
                    </div>
                </div>
            )}
        </FormField>
    );
};

const EventBrandingImages = ({ eventData, handleFileChange, isFieldModified }) => {
    const posterValue = eventData.event_banner_video_poster;
    const posterPreviewUrl = useMemo(
        () => (posterValue instanceof File ? URL.createObjectURL(posterValue) : (typeof posterValue === 'string' ? posterValue : '')),
        [posterValue]
    );
    useEffect(() => {
        if (!(posterValue instanceof File)) return undefined;
        return () => URL.revokeObjectURL(posterPreviewUrl);
    }, [posterValue, posterPreviewUrl]);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                <SectionHeader icon={ImageIcon} title="Images" />
                <div className="space-y-6">
                    {IMAGE_FIELDS.map((field) => (
                        <MediaField
                            key={field.name}
                            {...field}
                            kind="image"
                            eventData={eventData}
                            handleFileChange={handleFileChange}
                            isFieldModified={isFieldModified}
                        />
                    ))}
                </div>
            </div>

            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                <SectionHeader icon={Video} title="Video" colorClass="text-success" borderClass="bg-success" />
                <div className="space-y-6">
                    <MediaField
                        name="event_banner_video"
                        label="Event Banner Video"
                        description="Video for the event banner."
                        kind="video"
                        eventData={eventData}
                        handleFileChange={handleFileChange}
                        isFieldModified={isFieldModified}
                        posterUrl={posterPreviewUrl}
                    />
                    <MediaField
                        name="event_banner_video_poster"
                        label="Event Banner Video Poster"
                        description="Poster/placeholder image shown before the event banner video plays."
                        kind="image"
                        eventData={eventData}
                        handleFileChange={handleFileChange}
                        isFieldModified={isFieldModified}
                    />
                </div>
            </div>
        </div>
    );
};

export default EventBrandingImages;
