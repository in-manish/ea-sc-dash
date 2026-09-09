import React, { useEffect, useMemo } from 'react';
import { Image as ImageIcon, Video } from 'lucide-react';
import { SectionHeader, FormField } from './components/SharedComponents';

const IMAGE_FIELDS = [
    { name: 'logo', label: 'Logo', description: 'Primary event logo.' },
    { name: 'logo2', label: 'Logo (Secondary)', description: 'Secondary/alternate logo, used where the primary logo does not fit.' },
    { name: 'event_background_image', label: 'Event Background Image', description: 'Background image used across event pages.' },
    { name: 'event_banner_logo', label: 'Event Banner Logo', description: 'Logo shown on the event banner.' },
    { name: 'meetingdiary_portal_bg_image', label: 'Meeting Diary Portal Background', description: 'Background image for the meeting diary portal.' },
];

const MediaField = ({ label, description, name, kind, eventData, handleFileChange, isFieldModified }) => {
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

    return (
        <FormField label={label} description={description}>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex items-center justify-center w-32 h-20 rounded-lg border border-border bg-bg-secondary overflow-hidden shrink-0">
                    {previewUrl ? (
                        kind === 'video' ? (
                            <video src={previewUrl} className="w-full h-full object-cover" muted playsInline />
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
        </FormField>
    );
};

const EventBrandingImages = ({ eventData, handleFileChange, isFieldModified }) => {
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
                <MediaField
                    name="event_banner_video"
                    label="Event Banner Video"
                    description="Video for the event banner."
                    kind="video"
                    eventData={eventData}
                    handleFileChange={handleFileChange}
                    isFieldModified={isFieldModified}
                />
            </div>
        </div>
    );
};

export default EventBrandingImages;
