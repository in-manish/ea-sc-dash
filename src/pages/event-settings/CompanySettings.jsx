import React from 'react';
import { Building2, MapPin, Users, Save, LayoutGrid } from 'lucide-react';
import { SectionHeader, FormField, ToggleSwitch, getInputClass, LimitStatField } from './components/SharedComponents';
import ScriptEmbedEditor from '../../components/common/ScriptEmbedEditor';
import ComplimentarySection from './ComplimentarySection';
import ExhibitorPreviewModeSection from './ExhibitorPreviewModeSection';

export const STALL_SCHEMA_TYPES = [
    { value: 'BRSP', label: 'Bare space' },
    { value: 'BTUP', label: 'Built Up' },
    { value: 'TURNKEY', label: 'Turnkey' },
];

export const DEFAULT_STALL_SCHEMA_TYPES = ['BRSP', 'BTUP'];

const CompanySettings = ({ 
    eventData, 
    handleInputChange, 
    isFieldModified,
    addInviteeInfo,
    removeInviteeInfo,
    handleInviteeInfoChange,
    togglePreview,
    moveInviteeInfo,
    previewStates,
    addInviteeLink,
    removeInviteeLink,
    handleInviteeLinkChange,
    moveInviteeLink,
    isInviteeLinkModified,
    handleExhibitorStatsChange,
    isExhibitorStatModified,
    handleInterestedInChange,
    isInterestedInModified,
    handleStallSchemaTypeToggle,
    isStallSchemaTypesModified
}) => {
    const selectedStallTypes = Array.isArray(eventData.stall_schem_types) ? eventData.stall_schem_types : [];

    const handleScriptChange = (name, value) => {
        handleInputChange({ target: { name, value, type: 'text' } });
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Section 1: Access Controls */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Building2} title="Platform Access & Controls" colorClass="text-amber-500" borderClass="bg-amber-500" />
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border text-sm">
                        <div>
                            <p className="font-semibold text-text-primary m-0">Company Lock Display</p>
                            <p className="text-xs text-text-tertiary mt-0.5">Restrict display of companies based on specific criteria.</p>
                        </div>
                        <ToggleSwitch
                            name="is_company_lock_display_enabled"
                            checked={eventData.is_company_lock_display_enabled || false}
                            isModified={isFieldModified('is_company_lock_display_enabled')}
                            onChange={handleInputChange}
                        />
                    </div>


                </div>
            </div>

            {/* Section 2: Allocation Limits */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Users} title="Badge Allocation & Limits" colorClass="text-blue-500" borderClass="bg-blue-500" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <LimitStatField
                        label="Default Badge Limit"
                        description="Base maximum per exhibitor"
                        name="badge_limit_default"
                        value={eventData.badge_limit_default || ''}
                        onChange={handleInputChange}
                        isModified={isFieldModified('badge_limit_default')}
                        placeholder="5"
                    />
                    <LimitStatField
                        label="Formula Divisor"
                        description="Derived from space ÷ divisor"
                        name="badge_limit_default_formula"
                        value={eventData.badge_limit_default_formula || ''}
                        onChange={handleInputChange}
                        isModified={isFieldModified('badge_limit_default_formula')}
                        placeholder="2"
                    />
                    <LimitStatField
                        label="Static Value"
                        description="Fixed override limit"
                        name="badge_limit_static_value"
                        value={eventData.badge_limit_static_value ?? ''}
                        onChange={handleInputChange}
                        isModified={isFieldModified('badge_limit_static_value')}
                        placeholder="0"
                    />
                </div>
            </div>

            {/* Section 2.5: Stall Schema Types */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={LayoutGrid} title="Stall Schema Types" colorClass="text-teal-500" borderClass="bg-teal-500" />
                <FormField label="Available Stall Types" description="Select which stall schema types exhibitors can be assigned for this event.">
                    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${isStallSchemaTypesModified() ? 'ring-1 ring-accent/40 rounded-lg p-1' : ''}`}>
                        {STALL_SCHEMA_TYPES.map(({ value, label }) => {
                            const checked = selectedStallTypes.includes(value);
                            return (
                                <label
                                    key={value}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                                        checked
                                            ? 'bg-accent/5 border-accent text-text-primary'
                                            : 'bg-bg-secondary border-border text-text-secondary hover:border-border-hover'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleStallSchemaTypeToggle(value)}
                                        className="w-4 h-4 accent-accent cursor-pointer"
                                    />
                                    <span className="font-medium">{label}</span>
                                </label>
                            );
                        })}
                    </div>
                </FormField>
            </div>

            {/* Section 3: Resources */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={MapPin} title="Exhibitor Resources" colorClass="text-blue-500" borderClass="bg-blue-500" />
                <div className="space-y-4">
                    <FormField label="Floor Plan URL">
                        <div className="relative flex items-center">
                            <Save size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                            <input
                                type="url"
                                name="floor_plan_link"
                                value={eventData.floor_plan_link || ''}
                                onChange={handleInputChange}
                                className={getInputClass('floor_plan_link', isFieldModified('floor_plan_link'), true)}
                                placeholder="https://example.com/floor-plan.pdf"
                            />
                        </div>
                    </FormField>
                    <ScriptEmbedEditor
                        label="FHT / Hotel Map Script"
                        description="Raw Hotelmap embed script. Preview renders the map the same way accommodation pages do."
                        value={eventData.fht_script || ''}
                        onChange={(val) => handleScriptChange('fht_script', val)}
                        placeholder='<script async type="text/javascript" id="hotelmap_script" src="https://hotelmap.com/api/html/v2/listing?m=..."></script>'
                    />
                </div>
            </div>

            {/* Section 4: Exhibitor Preview Mode */}
            <ExhibitorPreviewModeSection
                eventData={eventData}
                handleInputChange={handleInputChange}
                isFieldModified={isFieldModified}
                handleExhibitorStatsChange={handleExhibitorStatsChange}
                isExhibitorStatModified={isExhibitorStatModified}
                handleInterestedInChange={handleInterestedInChange}
                isInterestedInModified={isInterestedInModified}
            />

            {/* Section 5: Complimentary */}
            <ComplimentarySection
                eventData={eventData}
                handleInputChange={handleInputChange}
                isFieldModified={isFieldModified}
                addInviteeInfo={addInviteeInfo}
                removeInviteeInfo={removeInviteeInfo}
                handleInviteeInfoChange={handleInviteeInfoChange}
                togglePreview={togglePreview}
                moveInviteeInfo={moveInviteeInfo}
                previewStates={previewStates}
                addInviteeLink={addInviteeLink}
                removeInviteeLink={removeInviteeLink}
                handleInviteeLinkChange={handleInviteeLinkChange}
                moveInviteeLink={moveInviteeLink}
                isInviteeLinkModified={isInviteeLinkModified}
            />
        </div>
    );
};

export default CompanySettings;
