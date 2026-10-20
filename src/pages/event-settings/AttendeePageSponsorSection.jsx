import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { FormField, SectionHeader, getInputClass } from './components/SharedComponents';
import {
    buildSponsorDetail,
    parseSponsorExtras,
    sponsorDetailOf,
    sponsorExtras,
} from './domain/attendeePageSponsorDetail';

/** Edit event.attendee_page_sponsor_detail (stored in addl_data; any keys allowed, not validated). */
const AttendeePageSponsorSection = ({ eventData, handleInputChange, isFieldModified }) => {
    const detail = sponsorDetailOf(eventData.attendee_page_sponsor_detail);
    const modified = isFieldModified('attendee_page_sponsor_detail');
    const extras = sponsorExtras(detail);
    const extrasJson = JSON.stringify(extras);
    const [extraText, setExtraText] = useState(() => (extrasJson === '{}' ? '' : JSON.stringify(extras, null, 2)));
    const [extraError, setExtraError] = useState('');

    // Keep the textarea in step when the data changes from outside (load, reset).
    useEffect(() => {
        const typed = parseSponsorExtras(extraText);
        if (typed !== null && JSON.stringify(typed) === extrasJson) return;
        if (typed === null && extraError) return; // user is mid-edit with invalid JSON
        setExtraText(extrasJson === '{}' ? '' : JSON.stringify(extras, null, 2));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [extrasJson]);

    const save = (value) =>
        handleInputChange({ target: { name: 'attendee_page_sponsor_detail', value, type: 'text' } });

    const handleKnownChange = (key, value) => {
        save(buildSponsorDetail({ ...detail, [key]: value }, extras));
    };

    const handleExtrasChange = (text) => {
        setExtraText(text);
        const parsed = parseSponsorExtras(text);
        if (parsed === null) {
            setExtraError('Must be a JSON object, e.g. {"tagline": "Hello"}');
            return;
        }
        setExtraError('');
        save(buildSponsorDetail(detail, parsed));
    };

    const imageUrl = String(detail.background_image || '').trim();

    return (
        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm space-y-6">
            <SectionHeader icon={Award} title="Attendee Page Sponsor" colorClass="text-amber-500" borderClass="bg-amber-500" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Title" description="Sponsor heading shown on the attendee page.">
                    <input
                        type="text"
                        value={detail.title || ''}
                        onChange={(e) => handleKnownChange('title', e.target.value)}
                        className={getInputClass('attendee_page_sponsor_detail', modified)}
                        placeholder="Presented by ..."
                    />
                </FormField>
                <FormField label="Website" description="Where the sponsor block links to.">
                    <input
                        type="url"
                        value={detail.website || ''}
                        onChange={(e) => handleKnownChange('website', e.target.value)}
                        className={getInputClass('attendee_page_sponsor_detail', modified)}
                        placeholder="https://example.com"
                    />
                </FormField>
            </div>

            <FormField label="Background Image" description="Public image URL, then save.">
                <input
                    type="url"
                    value={detail.background_image || ''}
                    onChange={(e) => handleKnownChange('background_image', e.target.value)}
                    className={getInputClass('attendee_page_sponsor_detail', modified)}
                    placeholder="https://example.com/media/sponsor-bg.jpg"
                />
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt=""
                        className="mt-2 h-28 rounded-lg border border-border object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        onLoad={(e) => { e.currentTarget.style.display = ''; }}
                    />
                )}
            </FormField>

            <FormField
                label="Other fields (JSON)"
                description="Optional extra keys, any names and values, saved as is. Leave empty if not needed."
            >
                <textarea
                    value={extraText}
                    onChange={(e) => handleExtrasChange(e.target.value)}
                    rows={4}
                    spellCheck={false}
                    className={`${getInputClass('attendee_page_sponsor_detail', modified)} font-mono text-xs`}
                    placeholder={'{"tagline": "Hello"}'}
                />
                {extraError && <p className="text-[11px] text-danger mt-1 m-0">{extraError}</p>}
            </FormField>
        </div>
    );
};

export default AttendeePageSponsorSection;
