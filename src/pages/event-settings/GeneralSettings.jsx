import React from 'react';
import { Globe, Calendar, MapPin } from 'lucide-react';
import { SectionHeader, FormField, getInputClass } from './components/SharedComponents';

const GeneralSettings = ({ eventData, handleInputChange, isFieldModified }) => {
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
        </div>
    );
};

export default GeneralSettings;
