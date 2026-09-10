import React, { useEffect, useMemo } from 'react';
import { Image as ImageIcon, Video } from 'lucide-react';
import { SectionHeader } from './components/SharedComponents';
import { EVENT_IMAGE_FIELDS, EVENT_VIDEO_POSTER_EDITOR } from './domain/eventImageFields';
import { useEventImageEdit } from './hooks/useEventImageEdit';
import EventImageUploadField from './EventImageUploadField';

const EventBrandingImages = ({ eventData, handleFileChange, isFieldModified }) => {
  const { onPickFile, onEditExisting } = useEventImageEdit({ eventData, handleFileChange });
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
          {EVENT_IMAGE_FIELDS.map((field) => (
            <EventImageUploadField
              key={field.name}
              {...field}
              kind="image"
              eventData={eventData}
              onPickFile={(name, file, kind) => onPickFile(name, file, kind, field.editorConfig)}
              onEdit={() => onEditExisting(field.name, field.editorConfig)}
              onClear={(name) => handleFileChange(name, '')}
              isFieldModified={isFieldModified}
            />
          ))}
        </div>
      </div>

      <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
        <SectionHeader icon={Video} title="Video" colorClass="text-success" borderClass="bg-success" />
        <div className="space-y-6">
          <EventImageUploadField
            name="event_banner_video"
            label="Event Banner Video"
            description="Video for the event banner."
            kind="video"
            eventData={eventData}
            onPickFile={onPickFile}
            onClear={(name) => handleFileChange(name, '')}
            isFieldModified={isFieldModified}
            posterUrl={posterPreviewUrl}
          />
          <EventImageUploadField
            name="event_banner_video_poster"
            label="Event Banner Video Poster"
            description="Poster/placeholder image shown before the event banner video plays."
            kind="image"
            eventData={eventData}
            onPickFile={(name, file, kind) => onPickFile(name, file, kind, EVENT_VIDEO_POSTER_EDITOR)}
            onEdit={() => onEditExisting('event_banner_video_poster', EVENT_VIDEO_POSTER_EDITOR)}
            onClear={(name) => handleFileChange(name, '')}
            isFieldModified={isFieldModified}
            editorConfig={EVENT_VIDEO_POSTER_EDITOR}
          />
        </div>
      </div>
    </div>
  );
};

export default EventBrandingImages;
