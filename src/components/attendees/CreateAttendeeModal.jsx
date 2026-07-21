import React, { useState, useEffect, useCallback } from 'react';
import { eventService } from '../../services/eventService';
import { Loader2, X, Plus, Trash2, UserPlus, AlertCircle, CheckCircle2, Building2 } from 'lucide-react';

const generateUuid = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const emptyAttendee = () => ({
    name: '',
    email: '',
    country_code: '',
    phone_number: '',
    designation: '',
    uuid: generateUuid(),
});

const initialShared = {
    attendee_type: '',
    reg_type: 'ON_SPOT',
    company: '',
    company_address: '',
    city: '',
    state: '',
    country: '',
    website: '',
    exhibitor_id: '',
    created_location: '',
    printNow: false,
};

const nullIfEmpty = (v) => {
    const t = typeof v === 'string' ? v.trim() : v;
    return t === '' || t === undefined ? null : t;
};

const CreateAttendeeModal = ({ eventId, token, onClose, onCreated }) => {
    const [shared, setShared] = useState(initialShared);
    const [attendees, setAttendees] = useState([emptyAttendee()]);
    const [attendeeTypes, setAttendeeTypes] = useState([]);
    const [typesLoading, setTypesLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState(null);
    const [success, setSuccess] = useState(null);
    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

    useEffect(() => {
        let active = true;
        const loadTypes = async () => {
            setTypesLoading(true);
            try {
                const data = await eventService.getAttendeeTypes(eventId, token);
                if (active) setAttendeeTypes(data.attendee_types || []);
            } catch (err) {
                if (active) setError('Failed to load attendee types.');
            } finally {
                if (active) setTypesLoading(false);
            }
        };
        loadTypes();
        return () => { active = false; };
    }, [eventId, token]);

    const updateShared = (key, value) => setShared((prev) => ({ ...prev, [key]: value }));

    const updateAttendee = (index, key, value) => {
        setAttendees((prev) => prev.map((a, i) => (i === index ? { ...a, [key]: value } : a)));
    };

    const addAttendee = () => setAttendees((prev) => [...prev, emptyAttendee()]);
    const removeAttendee = (index) => setAttendees((prev) => prev.filter((_, i) => i !== index));

    const isExhibitor = (shared.attendee_type || '').toLowerCase().includes('exhibitor');

    useEffect(() => {
        if (!isExhibitor || !showCompanySuggestions) return undefined;
        const query = (shared.company || '').trim();
        if (query.length < 1) {
            setCompanySuggestions([]);
            return undefined;
        }
        let active = true;
        setCompanyLoading(true);
        const timer = setTimeout(async () => {
            try {
                const data = await eventService.getCompanies(eventId, token, 1, 8, 'obf_number', 'desc', query, {});
                if (active) setCompanySuggestions(data.results || []);
            } catch (err) {
                if (active) setCompanySuggestions([]);
            } finally {
                if (active) setCompanyLoading(false);
            }
        }, 350);
        return () => { active = false; clearTimeout(timer); };
    }, [shared.company, isExhibitor, showCompanySuggestions, eventId, token]);

    const selectCompany = (company) => {
        setShared((prev) => ({
            ...prev,
            company: company.company_name || '',
            exhibitor_id: company.id != null ? String(company.id) : prev.exhibitor_id,
        }));
        setShowCompanySuggestions(false);
        setCompanySuggestions([]);
    };

    const buildPayload = useCallback(() => {
        const now = new Date().toISOString();
        const payload = {
            company: nullIfEmpty(shared.company),
            company_address: nullIfEmpty(shared.company_address),
            city: nullIfEmpty(shared.city),
            attendee_type: shared.attendee_type,
            reg_type: shared.reg_type,
            created_at: now,
            source_metadata: { source_type: 'dashboard' },
            attendees: attendees.map((a) => ({
                name: a.name.trim(),
                uuid: a.uuid,
                country_code: nullIfEmpty(a.country_code),
                phone_number: nullIfEmpty(a.phone_number),
                email: nullIfEmpty(a.email),
                designation: nullIfEmpty(a.designation),
            })),
        };

        if (nullIfEmpty(shared.state)) payload.state = shared.state.trim();
        if (nullIfEmpty(shared.country)) payload.country = shared.country.trim();
        if (nullIfEmpty(shared.website)) payload.website = shared.website.trim();
        if (nullIfEmpty(shared.created_location)) payload.created_location = shared.created_location.trim();
        if (nullIfEmpty(shared.exhibitor_id)) payload.exhibitor_id = Number(shared.exhibitor_id);
        if (shared.printNow) payload.printed_at = now;

        return payload;
    }, [shared, attendees]);

    const validate = () => {
        if (!shared.attendee_type) return 'Please select an attendee type.';
        if (!shared.reg_type) return 'Please select a registration type.';
        if (attendees.length === 0) return 'Add at least one attendee.';
        if (attendees.some((a) => !a.name.trim())) return 'Every attendee needs a name.';
        if (isExhibitor && !nullIfEmpty(shared.exhibitor_id) && !nullIfEmpty(shared.company)) {
            return 'Exhibitors require an Exhibitor ID or a company name.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors(null);
        setSuccess(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        try {
            const result = await eventService.createAttendee(eventId, token, buildPayload());
            const created = Array.isArray(result) ? result.length : attendees.length;
            setSuccess(`${created} attendee${created === 1 ? '' : 's'} processed successfully.`);
            if (onCreated) onCreated(result);
            setTimeout(() => onClose(), 900);
        } catch (err) {
            if (err.data && typeof err.data === 'object') {
                setFieldErrors(err.data);
            }
            setError(err.message || 'Failed to create attendee.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderFieldError = (key) => {
        if (!fieldErrors || !fieldErrors[key]) return null;
        const val = fieldErrors[key];
        const text = Array.isArray(val) ? val.join(', ') : String(val);
        return <p className="text-xs text-status-danger mt-1">{text}</p>;
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1300] animate-fade-in" onClick={onClose}>
            <form
                className="bg-bg-primary rounded-lg border border-border shadow-xl w-[94%] max-w-[760px] max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="p-6 border-b border-border flex items-start justify-between bg-bg-secondary">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1 flex items-center gap-2">
                            <UserPlus size={20} className="text-accent" />
                            Create Attendee
                        </h2>
                        <p className="text-sm text-text-secondary">Add one or more badges. Shared company details apply to all.</p>
                    </div>
                    <button type="button" className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {error && (
                        <div className="p-4 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-start gap-3 text-status-danger text-sm">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="p-4 bg-status-success/5 border border-status-success/10 rounded-lg flex items-center gap-3 text-status-success text-sm">
                            <CheckCircle2 size={16} />
                            {success}
                        </div>
                    )}

                    {/* Shared fields */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Shared Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1">Attendee Type <span className="text-status-danger">*</span></label>
                                <select
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.attendee_type}
                                    onChange={(e) => updateShared('attendee_type', e.target.value)}
                                    disabled={typesLoading}
                                >
                                    <option value="">{typesLoading ? 'Loading…' : 'Select type'}</option>
                                    {attendeeTypes.map((t) => (
                                        <option key={t.id ?? t.name} value={t.name}>{t.name}</option>
                                    ))}
                                </select>
                                {renderFieldError('attendee_type')}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1">Registration Type <span className="text-status-danger">*</span></label>
                                <select
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.reg_type}
                                    onChange={(e) => updateShared('reg_type', e.target.value)}
                                >
                                    <option value="ON_SPOT">On Spot</option>
                                    <option value="PRE_REG">Pre-Registration</option>
                                </select>
                                {renderFieldError('reg_type')}
                            </div>
                            <div className="relative">
                                <label className="text-xs font-medium text-text-secondary block mb-1">Company{isExhibitor && <span className="text-status-danger"> *</span>}</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.company}
                                    onChange={(e) => {
                                        updateShared('company', e.target.value);
                                        if (isExhibitor) {
                                            setShowCompanySuggestions(true);
                                            updateShared('exhibitor_id', '');
                                        }
                                    }}
                                    onFocus={() => { if (isExhibitor && shared.company.trim()) setShowCompanySuggestions(true); }}
                                    onBlur={() => setTimeout(() => setShowCompanySuggestions(false), 150)}
                                    placeholder={isExhibitor ? 'Search exhibitor company…' : 'Company name'}
                                />
                                {isExhibitor && showCompanySuggestions && (companyLoading || companySuggestions.length > 0) && (
                                    <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {companyLoading ? (
                                            <div className="flex items-center gap-2 px-3 py-2.5 text-xs text-text-tertiary">
                                                <Loader2 size={14} className="animate-spin" /> Searching…
                                            </div>
                                        ) : (
                                            companySuggestions.map((company) => (
                                                <button
                                                    key={company.id}
                                                    type="button"
                                                    onMouseDown={(e) => { e.preventDefault(); selectCompany(company); }}
                                                    className="w-full text-left px-3 py-2.5 hover:bg-bg-secondary transition-colors border-none bg-transparent cursor-pointer flex items-center gap-2"
                                                >
                                                    {company.company_logo ? (
                                                        <img src={company.company_logo} alt="" className="w-6 h-6 object-contain bg-white rounded-sm border border-border shrink-0" />
                                                    ) : (
                                                        <span className="w-6 h-6 rounded-sm bg-bg-tertiary flex items-center justify-center text-text-tertiary shrink-0">
                                                            <Building2 size={12} />
                                                        </span>
                                                    )}
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block text-sm text-text-primary truncate">{company.company_name}</span>
                                                        <span className="block text-[11px] text-text-tertiary">
                                                            #{company.id}{company.obf_number ? ` · OBF ${company.obf_number}` : ''}
                                                        </span>
                                                    </span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                                {renderFieldError('company')}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1">
                                    Exhibitor ID{isExhibitor && <span className="text-text-tertiary"> (or company)</span>}
                                </label>
                                <input
                                    type="number"
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.exhibitor_id}
                                    onChange={(e) => updateShared('exhibitor_id', e.target.value)}
                                    placeholder="e.g. 2772"
                                />
                                {renderFieldError('exhibitor_id')}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-medium text-text-secondary block mb-1">Company Address</label>
                                <input
                                    type="text"
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.company_address}
                                    onChange={(e) => updateShared('company_address', e.target.value)}
                                    placeholder="Address"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1">City</label>
                                <input
                                    type="text"
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.city}
                                    onChange={(e) => updateShared('city', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1">State</label>
                                <input
                                    type="text"
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.state}
                                    onChange={(e) => updateShared('state', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1">Country</label>
                                <input
                                    type="text"
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.country}
                                    onChange={(e) => updateShared('country', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1">Website</label>
                                <input
                                    type="text"
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.website}
                                    onChange={(e) => updateShared('website', e.target.value)}
                                    placeholder="https://"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-secondary block mb-1">Print Location</label>
                                <input
                                    type="text"
                                    className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent"
                                    value={shared.created_location}
                                    onChange={(e) => updateShared('created_location', e.target.value)}
                                    placeholder="e.g. Gate 1"
                                />
                                {renderFieldError('created_location')}
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm cursor-pointer w-fit">
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-accent"
                                checked={shared.printNow}
                                onChange={(e) => updateShared('printNow', e.target.checked)}
                            />
                            <span className="text-text-secondary">Mark badge as printed now</span>
                        </label>
                    </div>

                    {/* Per-attendee rows */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Attendees ({attendees.length})</h3>
                            <button type="button" onClick={addAttendee} className="btn btn-secondary btn-sm gap-1.5">
                                <Plus size={14} /> Add Attendee
                            </button>
                        </div>

                        {attendees.map((a, index) => (
                            <div key={a.uuid} className="p-4 bg-bg-secondary rounded-lg border border-border space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-text-secondary">Attendee #{index + 1}</span>
                                    {attendees.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAttendee(index)}
                                            className="text-text-tertiary hover:text-status-danger transition-colors bg-transparent border-none p-1 cursor-pointer"
                                            title="Remove attendee"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-medium text-text-secondary block mb-1">Name <span className="text-status-danger">*</span></label>
                                        <input
                                            type="text"
                                            maxLength={100}
                                            className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-white outline-none focus:border-accent"
                                            value={a.name}
                                            onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-text-secondary block mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-white outline-none focus:border-accent"
                                            value={a.email}
                                            onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-text-secondary block mb-1">Designation</label>
                                        <input
                                            type="text"
                                            className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-white outline-none focus:border-accent"
                                            value={a.designation}
                                            onChange={(e) => updateAttendee(index, 'designation', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-text-secondary block mb-1">Country Code</label>
                                        <input
                                            type="text"
                                            maxLength={4}
                                            className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-white outline-none focus:border-accent"
                                            value={a.country_code}
                                            onChange={(e) => updateAttendee(index, 'country_code', e.target.value.replace(/\D/g, ''))}
                                            placeholder="91"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-text-secondary block mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="w-full py-2.5 px-3 border border-border rounded-md text-sm bg-white outline-none focus:border-accent"
                                            value={a.phone_number}
                                            onChange={(e) => updateAttendee(index, 'phone_number', e.target.value.replace(/\D/g, ''))}
                                            placeholder="10 digit number"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-border flex justify-end gap-3 bg-bg-secondary">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary gap-2" disabled={submitting}>
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                        {submitting ? 'Creating…' : 'Create Attendee'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAttendeeModal;
