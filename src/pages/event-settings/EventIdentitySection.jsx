import React from 'react';
import { Globe } from 'lucide-react';
import { SectionHeader, FormField, getInputClass } from './components/SharedComponents';
import ThemeColorCodeField from './ThemeColorCodeField';

const EventIdentitySection = ({ eventData, handleInputChange, isFieldModified }) => (
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
                <ThemeColorCodeField
                    eventData={eventData}
                    handleInputChange={handleInputChange}
                    isFieldModified={isFieldModified}
                />
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
);

export default EventIdentitySection;
