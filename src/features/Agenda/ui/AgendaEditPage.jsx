import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAlert } from '../../../contexts/AlertContext';
import { agendaService } from '../../../services/agendaService';
import { useAgendaForm } from '../hooks/useAgendaForm';
import { usePersonImageCrop } from '../hooks/usePersonImageCrop';
import ImageCropModal from './ImageCropModal';
import ModeratorRosterSection from './ModeratorRosterSection';
import SessionDetailsFields from './SessionDetailsFields';
import SpeakerRosterSection from './SpeakerRosterSection';

const AgendaEditPage = () => {
  const { id: eventId, agendaId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showAlert } = useAlert();
  const isNew = !agendaId || agendaId === 'new';

  const [agenda, setAgenda] = useState(isNew ? null : location.state?.agenda || null);
  const [loading, setLoading] = useState(!isNew && !location.state?.agenda);

  useEffect(() => {
    if (isNew || agenda || !token) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await agendaService.getAgendas(eventId, token, 1, 200, '');
        const found = (data.results || []).find((a) => String(a.id) === String(agendaId));
        if (!cancelled) {
          if (!found) showAlert('Session not found', 'error');
          setAgenda(found || null);
        }
      } catch (err) {
        if (!cancelled) showAlert(err.message || 'Failed to load session', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isNew, agenda, token, eventId, agendaId, showAlert]);

  const goBack = () => navigate(`/event/${eventId}/agenda`);

  const form = useAgendaForm({
    agenda: isNew ? null : agenda,
    eventId,
    token,
    onSuccess: () => {
      showAlert(isNew ? 'Session created' : 'Session updated', 'success');
      goBack();
    },
  });

  const crop = usePersonImageCrop({
    speakers: form.speakers,
    setSpeakers: form.setSpeakers,
    moderators: form.moderators,
    setModerators: form.setModerators,
    imageBlobs: form.imageBlobs,
    setImageBlobs: form.setImageBlobs,
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-accent" size={36} />
        <p className="text-xs font-black uppercase tracking-widest text-text-tertiary">Loading session...</p>
      </div>
    );
  }

  if (!isNew && !agenda) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-text-secondary">Session not found.</p>
        <button type="button" className="text-accent font-bold text-sm" onClick={goBack}>Back to agenda</button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-[1100px] mx-auto min-h-screen animate-fade-in space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer p-0"
            onClick={goBack}
          >
            <ArrowLeft size={16} /> Back to agenda
          </button>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            {form.isEditing ? 'Edit session' : 'New session'}
          </h1>
          <p className="text-sm text-text-secondary font-medium">Manage details, speakers, and moderators</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-text-secondary hover:bg-bg-tertiary"
            onClick={goBack}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="agendaEditForm"
            disabled={form.saving}
            className="px-8 py-3 bg-accent text-white rounded-xl font-black uppercase tracking-widest text-[10px] disabled:opacity-60"
          >
            {form.saving ? 'Saving...' : form.isEditing ? 'Save changes' : 'Create session'}
          </button>
        </div>
      </div>

      {form.error && (
        <div className="p-4 rounded-xl border border-danger/30 bg-danger/5 text-danger text-sm whitespace-pre-wrap">
          {form.error}
        </div>
      )}

      <form id="agendaEditForm" onSubmit={form.save} className="space-y-10 pb-16">
        <SessionDetailsFields formData={form.formData} updateField={form.updateField} />
        <SpeakerRosterSection
          speakers={form.speakers}
          alphaSort={form.formData.speaker_default_alpha_sort}
          onToggleAlphaSort={(v) => form.updateField('speaker_default_alpha_sort', v)}
          onAdd={() => form.addPerson('speaker')}
          onChange={form.changePerson}
          onRemove={form.removePerson}
          onPickImage={crop.pickImage}
        />
        <ModeratorRosterSection
          moderators={form.moderators}
          onAdd={() => form.addPerson('moderator')}
          onChange={form.changePerson}
          onRemove={form.removePerson}
          onPickImage={crop.pickImage}
        />
      </form>

      {crop.isCropping && crop.croppingTarget && (
        <ImageCropModal
          url={crop.croppingTarget.url}
          imageRef={crop.imageRef}
          cropMeta={crop.cropMeta}
          onCancel={crop.cancelCrop}
          onSave={crop.saveCrop}
          onZoomIn={crop.zoomIn}
          onZoomOut={crop.zoomOut}
          onRotateLeft={crop.rotateLeft}
          onRotateRight={crop.rotateRight}
        />
      )}
    </div>
  );
};

export default AgendaEditPage;
