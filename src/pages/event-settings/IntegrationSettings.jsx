import React from 'react';
import { Database, TrendingUp, Droplet } from 'lucide-react';
import { SectionHeader, FormField, getInputClass } from './components/SharedComponents';

const IntegrationSettings = ({ eventData, handleInputChange, isFieldModified }) => {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={TrendingUp} title="Neodove Integration" colorClass="text-green-600" borderClass="bg-green-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <FormField label="Neodove Event Label" description="Neodove integration event label. Defaults to event name if not set.">
                            <input
                                type="text"
                                name="neodove_event"
                                value={eventData.neodove_event || ''}
                                onChange={handleInputChange}
                                className={getInputClass('neodove_event', isFieldModified('neodove_event'))}
                                placeholder="OTM 2026"
                            />
                        </FormField>
                    </div>
                    <div>
                        <FormField label="Neodove Datasource" description="Neodove integration datasource identifier.">
                            <input
                                type="text"
                                name="neodove_datasource"
                                value={eventData.neodove_datasource || ''}
                                onChange={handleInputChange}
                                className={getInputClass('neodove_datasource', isFieldModified('neodove_datasource'))}
                                placeholder="otm-2026-source"
                            />
                        </FormField>
                    </div>
                </div>
            </div>

            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Droplet} title="Water Coupon Configuration" colorClass="text-blue-400" borderClass="bg-blue-400" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <FormField label="Default Water Coupon Limit" description="Base water coupon limit per exhibitor.">
                            <input
                                type="number"
                                name="water_coupon_limit_default"
                                value={eventData.water_coupon_limit_default || ''}
                                onChange={handleInputChange}
                                className={getInputClass('water_coupon_limit_default', isFieldModified('water_coupon_limit_default'))}
                                placeholder="1"
                            />
                        </FormField>
                    </div>
                    <div>
                        <FormField label="Water Coupon Formula Divisor" description="Divisor for calculating water coupon limits from space.">
                            <input
                                type="number"
                                name="water_coupon_limit_default_formula"
                                value={eventData.water_coupon_limit_default_formula || ''}
                                onChange={handleInputChange}
                                className={getInputClass('water_coupon_limit_default_formula', isFieldModified('water_coupon_limit_default_formula'))}
                                placeholder="3"
                            />
                        </FormField>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationSettings;
