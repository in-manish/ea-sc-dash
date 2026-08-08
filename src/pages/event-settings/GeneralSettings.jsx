import React from 'react';
import { Globe, Calendar, MapPin, Clock, Plus, Trash2, CalendarClock } from 'lucide-react';
import { SectionHeader, FormField, getInputClass } from './components/SharedComponents';

const to12h = (time24) => {
    if (!time24) return '';
    const [hrs, mins] = time24.split(':');
    const h = parseInt(hrs, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    const mm = mins || '00';
    return `${hh}:${mm}${ampm}`;
};

const to24h = (time12) => {
    if (!time12) return '10:00';
    const match = time12.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return '10:00';
    let [_, hrs, mins, ampm] = match;
    let h = parseInt(hrs, 10);
    if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
    if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${mins}`;
};

const GeneralSettings = ({ eventData, handleInputChange, isFieldModified, handleShowHoursChange, originalShowHours }) => {
    return (
        <div className="animate-fade-in space-y-6">
            {/* Section 1: Event Identity */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                <SectionHeader icon={Globe} title="Event Identity" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <FormField label="Event Name">
                            <input
                                type="text"
                                name="name"
                                value={eventData.name || ''}
                                onChange={handleInputChange}
                                className={getInputClass('name', isFieldModified('name'))}
                                placeholder="Enter event name"
                            />
                        </FormField>
                    </div>
                    <div className="md:col-span-1">
                        <FormField label="Official Website">
                            <div className="relative flex items-center">
                                <Globe size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                <input
                                    type="url"
                                    name="website"
                                    value={eventData.website || ''}
                                    onChange={handleInputChange}
                                    className={getInputClass('website', isFieldModified('website'), true)}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </FormField>
                    </div>
                    <div className="md:col-span-2">
                        <FormField label="Event Description">
                            <textarea
                                name="description"
                                value={eventData.description || ''}
                                onChange={handleInputChange}
                                className={getInputClass('description', isFieldModified('description'))}
                                rows={4}
                                placeholder="Briefly describe the event..."
                            />
                        </FormField>
                    </div>
                </div>
            </div>

            {/* Section 2: Venue & Schedule */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                <SectionHeader icon={Calendar} title="Venue & Schedule" colorClass="text-success" borderClass="bg-success" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <FormField label="Start Date">
                            <input
                                type="date"
                                name="start_date"
                                value={eventData.start_date || ''}
                                onChange={handleInputChange}
                                className={getInputClass('start_date', isFieldModified('start_date'))}
                            />
                        </FormField>
                    </div>
                    <div>
                        <FormField label="End Date">
                            <input
                                type="date"
                                name="end_date"
                                value={eventData.end_date || ''}
                                onChange={handleInputChange}
                                className={getInputClass('end_date', isFieldModified('end_date'))}
                            />
                        </FormField>
                    </div>
                    <div>
                        <FormField label="Start Time">
                            <input
                                type="time"
                                step="1"
                                name="start_time"
                                value={eventData.start_time || '00:00:00'}
                                onChange={handleInputChange}
                                className={getInputClass('start_time', isFieldModified('start_time'))}
                            />
                        </FormField>
                    </div>
                    <div>
                        <FormField label="End Time">
                            <div className="flex flex-col gap-2">
                                <input
                                    type="time"
                                    step="1"
                                    name="end_time"
                                    value={eventData.end_time || '18:59:00'}
                                    onChange={handleInputChange}
                                    className={getInputClass('end_time', isFieldModified('end_time'))}
                                />
                                <button 
                                    type="button"
                                    onClick={() => {
                                        handleInputChange({ target: { name: 'start_time', value: '10:00:00' } });
                                        handleInputChange({ target: { name: 'end_time', value: '20:00:00' } });
                                    }}
                                    className="text-[10px] bg-bg-secondary hover:bg-bg-tertiary border border-border px-2 py-1 rounded text-accent font-semibold transition-all w-fit"
                                >
                                    Set Default (10 AM - 8 PM)
                                </button>
                            </div>
                        </FormField>
                    </div>
                    <div className="md:col-span-2">
                        <FormField label="Venue Address">
                            <div className="relative flex items-center">
                                <MapPin size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                <input
                                    type="text"
                                    name="address"
                                    value={eventData.address || ''}
                                    onChange={handleInputChange}
                                    className={getInputClass('address', isFieldModified('address'), true)}
                                    placeholder="Street address, building name..."
                                />
                            </div>
                        </FormField>
                    </div>
                    <div>
                        <FormField label="City / Location">
                            <input
                                type="text"
                                name="city"
                                value={eventData.city || ''}
                                onChange={handleInputChange}
                                className={getInputClass('city', isFieldModified('city'))}
                                placeholder="City name"
                            />
                        </FormField>
                    </div>
                    
                    {/* New Fields: State, Country, Zipcode */}
                    <div>
                        <FormField label="State / Region">
                            <input
                                type="text"
                                name="state"
                                value={eventData.state || ''}
                                onChange={handleInputChange}
                                className={getInputClass('state', isFieldModified('state'))}
                                placeholder="e.g. Maharashtra"
                            />
                        </FormField>
                    </div>
                    <div>
                        <FormField label="Country">
                            <input
                                type="text"
                                name="country"
                                value={eventData.country || ''}
                                onChange={handleInputChange}
                                className={getInputClass('country', isFieldModified('country'))}
                                placeholder="e.g. India"
                            />
                        </FormField>
                    </div>
                    <div>
                        <FormField label="Postal / ZIP Code">
                            <input
                                type="text"
                                name="zipcode"
                                value={eventData.zipcode || ''}
                                onChange={handleInputChange}
                                className={getInputClass('zipcode', isFieldModified('zipcode'))}
                                placeholder="e.g. 400001"
                            />
                        </FormField>
                    </div>
                </div>
            </div>

            {/* Section 3: Show Hours */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
                    <div className="flex items-center gap-2">
                        <CalendarClock size={18} className="text-accent" />
                        <h3 className="text-base font-semibold text-text-primary m-0">Show Hours Schedule</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            let defaultDate = '';
                            const showHours = eventData.show_hours || {};
                            if (eventData.start_date) {
                                defaultDate = eventData.start_date;
                                let candidate = new Date(defaultDate);
                                while (showHours[candidate.toISOString().split('T')[0]]) {
                                    candidate.setDate(candidate.getDate() + 1);
                                }
                                defaultDate = candidate.toISOString().split('T')[0];
                            } else {
                                defaultDate = new Date().toISOString().split('T')[0];
                                while (showHours[defaultDate]) {
                                    const next = new Date(defaultDate);
                                    next.setDate(next.getDate() + 1);
                                    defaultDate = next.toISOString().split('T')[0];
                                }
                            }

                            const updated = {
                                ...showHours,
                                [defaultDate]: {
                                    start_time: '10:00AM',
                                    end_time: '6:00PM',
                                    display_text: 'Show hours {{start_time}}-{{end_time}}'
                                }
                            };
                            handleShowHoursChange(updated);
                        }}
                        className="btn btn-sm btn-primary flex items-center gap-1.5"
                    >
                        <Plus size={14} /> Add Show Hours
                    </button>
                </div>

                <div className="space-y-6">
                    {!eventData.show_hours || Object.keys(eventData.show_hours).length === 0 ? (
                        <div className="text-center py-8 text-text-tertiary border border-dashed border-border rounded-lg bg-bg-secondary flex flex-col items-center justify-center gap-2">
                            <Clock size={28} className="text-text-tertiary opacity-60" />
                            <p className="text-sm font-medium">No show hours configured</p>
                            <p className="text-xs">Add date-specific hours to define event timings for visitors.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    let defaultDate = '';
                                    const showHours = eventData.show_hours || {};
                                    if (eventData.start_date) {
                                        defaultDate = eventData.start_date;
                                        let candidate = new Date(defaultDate);
                                        while (showHours[candidate.toISOString().split('T')[0]]) {
                                            candidate.setDate(candidate.getDate() + 1);
                                        }
                                        defaultDate = candidate.toISOString().split('T')[0];
                                    } else {
                                        defaultDate = new Date().toISOString().split('T')[0];
                                        while (showHours[defaultDate]) {
                                            const next = new Date(defaultDate);
                                            next.setDate(next.getDate() + 1);
                                            defaultDate = next.toISOString().split('T')[0];
                                        }
                                    }

                                    const updated = {
                                        ...showHours,
                                        [defaultDate]: {
                                            start_time: '10:00AM',
                                            end_time: '6:00PM',
                                            display_text: 'Show hours {{start_time}}-{{end_time}}'
                                        }
                                    };
                                    handleShowHoursChange(updated);
                                }}
                                className="mt-2 text-xs bg-accent text-white font-semibold px-3 py-1.5 rounded hover:bg-accent/90 transition-colors shadow-sm"
                            >
                                Add First Date
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.keys(eventData.show_hours).sort().map((date) => {
                                const showHours = eventData.show_hours || {};
                                const config = showHours[date] || {};
                                const hasTimes = config.start_time !== undefined && config.end_time !== undefined;
                                
                                const isDateModified = (() => {
                                    if (!originalShowHours) return true;
                                    const current = showHours[date];
                                    const original = originalShowHours[date];
                                    if (!original) return true;
                                    return JSON.stringify(current) !== JSON.stringify(original);
                                })();

                                const isFieldModifiedLocal = (field) => {
                                    if (!originalShowHours) return true;
                                    const current = showHours[date]?.[field];
                                    const original = originalShowHours[date]?.[field];
                                    return current !== original;
                                };

                                const getPreviewText = (cfg) => {
                                    let text = cfg.display_text || '';
                                    if (!text) return 'No display text';
                                    const start = cfg.start_time || '10:00AM';
                                    const end = cfg.end_time || '6:00PM';
                                    return text
                                        .replace(/\{\{\s*start_time\s*\}\}/g, start)
                                        .replace(/\{\{\s*end_time\s*\}\}/g, end);
                                };

                                return (
                                    <div 
                                        key={date} 
                                        className={`p-5 rounded-lg border bg-bg-secondary relative transition-all duration-200 ${
                                            isDateModified 
                                                ? 'border-amber-400 bg-amber-50/10 shadow-sm' 
                                                : 'border-border'
                                        }`}
                                    >
                                        {isDateModified && (
                                            <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded">
                                                Modified
                                            </span>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                            {/* Date Selector */}
                                            <div className="md:col-span-3">
                                                <FormField label="Date">
                                                    <input
                                                        type="date"
                                                        value={date}
                                                        onChange={(e) => {
                                                            const newDate = e.target.value;
                                                            if (!newDate) return;
                                                            if (date === newDate) return;
                                                            if (showHours[newDate]) {
                                                                alert(`Show hours for ${newDate} are already configured.`);
                                                                return;
                                                            }
                                                            const updated = { ...showHours };
                                                            const cfg = updated[date];
                                                            delete updated[date];
                                                            updated[newDate] = cfg;
                                                            handleShowHoursChange(updated);
                                                        }}
                                                        className={getInputClass('show_hours_date_' + date, isFieldModifiedLocal('date'))}
                                                    />
                                                </FormField>
                                            </div>

                                            {/* Time Config & Controls */}
                                            <div className="md:col-span-8 space-y-4">
                                                {/* Enable Time Pickers Switch */}
                                                <div className="flex items-center gap-3 bg-bg-primary p-2.5 rounded border border-border w-fit">
                                                    <label className="relative inline-block w-9 h-5 cursor-pointer m-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={hasTimes}
                                                            onChange={(e) => {
                                                                const includeTimes = e.target.checked;
                                                                const updated = { ...showHours };
                                                                const cfg = { ...updated[date] };
                                                                if (includeTimes) {
                                                                    cfg.start_time = '10:00AM';
                                                                    cfg.end_time = '6:00PM';
                                                                } else {
                                                                    delete cfg.start_time;
                                                                    delete cfg.end_time;
                                                                }
                                                                updated[date] = cfg;
                                                                handleShowHoursChange(updated);
                                                            }}
                                                            className="peer sr-only"
                                                        />
                                                        <span className={`block absolute inset-0 rounded-full transition-all duration-300 ${
                                                            isFieldModifiedLocal('start_time') || isFieldModifiedLocal('end_time')
                                                                ? 'bg-amber-500' 
                                                                : 'bg-slate-300 peer-checked:bg-success'
                                                        }`}></span>
                                                        <span className="absolute left-[2px] bottom-[2px] bg-white w-[16px] h-[16px] rounded-full transition-all duration-300 peer-checked:translate-x-[16px]"></span>
                                                    </label>
                                                    <span className="text-xs font-semibold text-text-secondary">Include Start & End Times</span>
                                                </div>

                                                {/* Time Pickers */}
                                                {hasTimes && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                                                        <FormField label="Start Time">
                                                            <input
                                                                type="time"
                                                                value={to24h(config.start_time)}
                                                                onChange={(e) => {
                                                                    const updated = { ...showHours };
                                                                    const cfg = { ...updated[date], start_time: to12h(e.target.value) };
                                                                    updated[date] = cfg;
                                                                    handleShowHoursChange(updated);
                                                                }}
                                                                className={getInputClass('show_hours_start_' + date, isFieldModifiedLocal('start_time'))}
                                                            />
                                                        </FormField>
                                                        <FormField label="End Time">
                                                            <input
                                                                type="time"
                                                                value={to24h(config.end_time)}
                                                                onChange={(e) => {
                                                                    const updated = { ...showHours };
                                                                    const cfg = { ...updated[date], end_time: to12h(e.target.value) };
                                                                    updated[date] = cfg;
                                                                    handleShowHoursChange(updated);
                                                                }}
                                                                className={getInputClass('show_hours_end_' + date, isFieldModifiedLocal('end_time'))}
                                                            />
                                                        </FormField>
                                                    </div>
                                                )}

                                                {/* Custom Display Text */}
                                                <div className="space-y-2">
                                                    <FormField 
                                                        label="Display Text" 
                                                        description="Define how hours appear to attendees. Placeholders {{start_time}} and {{end_time}} are supported."
                                                    >
                                                        <input
                                                            type="text"
                                                            value={config.display_text || ''}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                const updated = { ...showHours };
                                                                const cfg = { ...updated[date] };
                                                                if (val === '') {
                                                                    delete cfg.display_text;
                                                                } else {
                                                                    cfg.display_text = val;
                                                                }
                                                                updated[date] = cfg;
                                                                handleShowHoursChange(updated);
                                                            }}
                                                            placeholder="e.g. Show hours {{start_time}}-{{end_time}}"
                                                            className={getInputClass('show_hours_text_' + date, isFieldModifiedLocal('display_text'))}
                                                        />
                                                    </FormField>

                                                    {/* Presets */}
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        <span className="text-[10px] text-text-tertiary flex items-center mr-1">Presets:</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = { ...showHours };
                                                                updated[date] = { ...updated[date], display_text: 'Show hours {{start_time}}-{{end_time}}' };
                                                                handleShowHoursChange(updated);
                                                            }}
                                                            className="text-[9px] bg-bg-primary hover:bg-bg-tertiary border border-border px-1.5 py-0.5 rounded text-text-secondary transition-all cursor-pointer"
                                                        >
                                                            Show hours...
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = { ...showHours };
                                                                updated[date] = { ...updated[date], display_text: 'Open {{start_time}} to {{end_time}}' };
                                                                handleShowHoursChange(updated);
                                                            }}
                                                            className="text-[9px] bg-bg-primary hover:bg-bg-tertiary border border-border px-1.5 py-0.5 rounded text-text-secondary transition-all cursor-pointer"
                                                        >
                                                            Open...to...
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = { ...showHours };
                                                                updated[date] = { ...updated[date], display_text: 'Closed' };
                                                                handleShowHoursChange(updated);
                                                            }}
                                                            className="text-[9px] bg-bg-primary hover:bg-bg-tertiary border border-border px-1.5 py-0.5 rounded text-text-secondary transition-all cursor-pointer"
                                                        >
                                                            Closed
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = { ...showHours };
                                                                const index = Object.keys(showHours).sort().indexOf(date) + 1;
                                                                updated[date] = { ...updated[date], display_text: `Day ${index}: {{start_time}}-{{end_time}}` };
                                                                handleShowHoursChange(updated);
                                                            }}
                                                            className="text-[9px] bg-bg-primary hover:bg-bg-tertiary border border-border px-1.5 py-0.5 rounded text-text-secondary transition-all cursor-pointer"
                                                        >
                                                            Day N...
                                                        </button>
                                                    </div>

                                                    {/* Live Preview Display */}
                                                    {config.display_text && (
                                                        <div className="mt-2.5 p-2 bg-[#f8fafc] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded text-xs flex items-center gap-2">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preview:</span>
                                                            <span className="font-semibold text-accent">{getPreviewText(config)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons (Delete) */}
                                            <div className="md:col-span-1 flex justify-end md:justify-center pt-5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = { ...showHours };
                                                        delete updated[date];
                                                        handleShowHoursChange(updated);
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 flex items-center justify-center transition-all cursor-pointer border-none"
                                                    title="Delete this show hour entry"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
