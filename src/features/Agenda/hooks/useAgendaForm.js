import { useEffect, useState } from 'react';
import { agendaService } from '../../../services/agendaService';
import { EMPTY_MODERATOR, EMPTY_SESSION, EMPTY_SPEAKER } from '../constants';
import { buildAgendaFormData } from '../domain/buildAgendaFormData';
import { normalizeModerators, normalizeSpeakers } from '../domain/normalizePeople';

export function useAgendaForm({ agenda, eventId, token, onSuccess }) {
  const isEditing = Boolean(agenda?.id);
  const [formData, setFormData] = useState(EMPTY_SESSION);
  const [speakers, setSpeakers] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [imageBlobs, setImageBlobs] = useState(new Map());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (agenda) {
      setFormData({
        ...EMPTY_SESSION,
        title: agenda.title || '',
        location: agenda.location || '',
        description: agenda.description || '',
        information: agenda.information || '',
        date: agenda.date || '',
        start: agenda.start || '',
        end: agenda.end || '',
        track_title: agenda.track_title || '',
        enrollable: Boolean(agenda.enrollable),
        admin: Boolean(agenda.admin),
        force_attendance: Boolean(agenda.force_attendance),
        speaker_default_alpha_sort: agenda.speaker_default_alpha_sort ?? true,
      });
      setSpeakers(normalizeSpeakers(agenda.speaker || []));
      setModerators(normalizeModerators(agenda.moderator || []));
    } else {
      setFormData({ ...EMPTY_SESSION });
      setSpeakers([EMPTY_SPEAKER()]);
      setModerators([EMPTY_MODERATOR()]);
    }
    setImageBlobs(new Map());
    setError('');
  }, [agenda]);

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const addPerson = (type) => {
    if (type === 'speaker') setSpeakers((prev) => [...prev, EMPTY_SPEAKER()]);
    else setModerators((prev) => [...prev, EMPTY_MODERATOR()]);
  };

  const removePerson = (type, index) => {
    if (type === 'speaker') setSpeakers((prev) => prev.filter((_, i) => i !== index));
    else setModerators((prev) => prev.filter((_, i) => i !== index));

    setImageBlobs((prev) => {
      const next = new Map();
      prev.forEach((value, key) => {
        const match = key.match(/^(speaker|moderator)_image_(\d+)$/);
        if (!match || match[1] !== type) {
          next.set(key, value);
          return;
        }
        const i = Number(match[2]);
        if (i === index) return;
        const newIndex = i > index ? i - 1 : i;
        next.set(`${type}_image_${newIndex}`, value);
      });
      return next;
    });
  };

  const changePerson = (type, index, field, value) => {
    if (type === 'speaker') {
      setSpeakers((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    } else {
      setModerators((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
    }
  };

  const save = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    setError('');
    try {
      const data = buildAgendaFormData({ formData, speakers, moderators, imageBlobs });
      if (isEditing) {
        await agendaService.updateAgenda(eventId, agenda.id, token, data);
      } else {
        await agendaService.createAgenda(eventId, token, data);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return {
    isEditing,
    formData,
    speakers,
    setSpeakers,
    moderators,
    setModerators,
    imageBlobs,
    setImageBlobs,
    saving,
    error,
    updateField,
    addPerson,
    removePerson,
    changePerson,
    save,
  };
}
