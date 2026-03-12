import React, { useState, useEffect } from 'react';
import { Globe, Code, Layout, Info, Eye, ExternalLink, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { SectionHeader } from './components/SharedComponents';

const LocalizationSettings = ({ eventData, handleInputChange, isFieldModified }) => {
    const defaultTemplate = {
        visitor_registration: {
            default_locale: "en",
            locales: {
                en: {
                    date_block: { label: "DATE", value: "October 27–28, 2026" },
                    venue_block: {
                        label: "VENUE",
                        line1: "Miami Beach Convention Center, Convention Center Drive, Miami Beach, FL, USA",
                        line2: "Miami, USA"
                    },
                    contact_block: {
                        label: "GET IN TOUCH",
                        website: "wtemiami.org",
                        email: "contact@wtemiami.org",
                        phone: "+1 786-384-8161"
                    },
                    footer_block: {
                        website_ownership_text: "This website is owned and operated by Fairfest Inc, organizers of WTE Miami."
                    },
                    registration_box: {
                        title: "GET STARTED!",
                        primary_field: {
                            key: "login_identifier",
                            label: "Enter Email or WhatsApp number",
                            placeholder: "Enter Email or WhatsApp number"
                        },
                        updates_field: {
                            key: "updates_contact",
                            label: "Event updates may be sent via email or WhatsApp",
                            placeholder: "Enter Email or WhatsApp number for quick event updates"
                        },
                        request_otp_button: { label: "Get Verification Code" },
                        otp_field: {
                            key: "otp",
                            label: "Enter One-Time-Password",
                            placeholder: "Enter the verification code"
                        },
                        resend_otp: { label: "Resend code", countdown_text: "Resend code in {mm}:{ss}" },
                        verify_otp_button: { label: "Verify Code" },
                        already_registered: {
                            label: "Already Registered?",
                            download_badge_link_label: "Download badge",
                            check_status_link_label: "Check status"
                        }
                    },
                    personal_details_form: {
                        title: "Your Details",
                        fields: {
                            designation: { label: "Job Title" },
                            pincode: { label: "Zip/Postal Code" }
                        }
                    }
                }
            }
        }
    };

    const [jsonEditMode, setJsonEditMode] = useState('preview-ui'); // 'raw' or 'preview-ui'
    const [intlData, setIntlData] = useState(eventData.intl_meta || null);
    const [jsonString, setJsonString] = useState(eventData.intl_meta ? JSON.stringify(eventData.intl_meta, null, 2) : '');
    const [jsonError, setJsonError] = useState(null);

    const isInitialized = intlData !== null && typeof intlData === 'object' && Object.keys(intlData).length > 0;

    useEffect(() => {
        if (intlData) {
            setJsonString(JSON.stringify(intlData, null, 2));
            // Update parent state
            handleInputChange({
                target: {
                    name: 'intl_meta',
                    value: intlData,
                    type: 'text'
                }
            });
        }
    }, [intlData]);

    const handleInitialize = () => {
        setIntlData(defaultTemplate);
    };

    const handleJsonChange = (e) => {
        const val = e.target.value;
        setJsonString(val);
        try {
            const parsed = JSON.parse(val);
            setIntlData(parsed);
            setJsonError(null);
        } catch (err) {
            setJsonError(err.message);
        }
    };

    const currentLocale = intlData?.visitor_registration?.default_locale || 'en';
    const content = intlData?.visitor_registration?.locales?.[currentLocale] || {};

    const PreviewUI = () => (
        <div className="bg-[#f8fafc] border border-border rounded-xl overflow-hidden shadow-inner flex flex-col min-h-[600px]">
            {/* Header / Banner Mockup */}
            <div className="bg-white p-4 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">WTE</div>
                    <span className="font-bold text-sm text-[#0f172a]">VISITOR REGISTRATION</span>
                </div>
                <div className="flex gap-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Upcoming Events</span>
                </div>
            </div>

            <div className="flex-1 p-8 flex flex-col md:flex-row gap-8">
                {/* Left Column: Event Info */}
                <div className="flex-1 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">WTE MIAMI 2026</h2>
                        <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                    </div>

                    <div className="space-y-4">
                        <div className="group relative">
                            <div className="absolute -left-2 -top-1 -right-2 -bottom-1 border-2 border-dashed border-transparent group-hover:border-yellow-400/50 rounded pointer-events-none transition-all"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{content.date_block?.label || 'DATE'}</span>
                            <p className="font-bold text-slate-700">{content.date_block?.value || '---'}</p>
                        </div>

                        <div className="group relative">
                            <div className="absolute -left-2 -top-1 -right-2 -bottom-1 border-2 border-dashed border-transparent group-hover:border-yellow-400/50 rounded pointer-events-none transition-all"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{content.venue_block?.label || 'VENUE'}</span>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-xs">
                                {content.venue_block?.line1 || '---'}<br />
                                {content.venue_block?.line2 || '---'}
                            </p>
                        </div>

                        <div className="group relative pt-4 space-y-3">
                            <div className="absolute -left-2 -top-1 -right-2 -bottom-1 border-2 border-dashed border-transparent group-hover:border-yellow-400/50 rounded pointer-events-none transition-all"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{content.contact_block?.label || 'GET IN TOUCH'}</span>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                                    <Globe size={14} /> {content.contact_block?.website || '---'}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                    <Mail size={14} /> {content.contact_block?.email || '---'}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                    <Phone size={14} /> {content.contact_block?.phone || '---'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Registration Box */}
                <div className="w-full max-w-[380px]">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6 relative group overflow-hidden">
                        <div className="absolute -left-2 -top-2 -right-2 -bottom-2 border-2 border-dashed border-transparent group-hover:border-yellow-400/50 rounded-2xl pointer-events-none transition-all z-20"></div>
                        
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-[#0f172a]">{content.registration_box?.title || 'GET STARTED!'}</h3>
                            <div className="h-1 w-8 bg-blue-600 mx-auto rounded-full"></div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{content.registration_box?.primary_field?.label || 'Email/WA'}</label>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-xs italic">
                                    {content.registration_box?.primary_field?.placeholder || 'Enter details'}
                                </div>
                            </div>

                            <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wider">
                                {content.registration_box?.request_otp_button?.label || 'Get Code'}
                            </button>
                        </div>

                        <div className="pt-4 border-t border-slate-100 text-center space-y-3">
                            <p className="text-xs font-bold text-slate-500">{content.registration_box?.already_registered?.label || 'Already Registered?'}</p>
                            <div className="flex justify-center gap-3 divide-x divide-slate-200">
                                <button className="text-[11px] font-bold text-blue-600 uppercase tracking-wide hover:underline">
                                    {content.registration_box?.already_registered?.download_badge_link_label || 'Badge'}
                                </button>
                                <button className="pl-3 text-[11px] font-bold text-blue-600 uppercase tracking-wide hover:underline">
                                    {content.registration_box?.already_registered?.check_status_link_label || 'Status'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-white/50 border border-dashed border-slate-200 rounded-xl text-center group relative">
                        <div className="absolute -left-1 -top-1 -right-1 -bottom-1 border-2 border-dashed border-transparent group-hover:border-yellow-400/50 rounded-xl pointer-events-none transition-all"></div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                            {content.footer_block?.website_ownership_text || '---'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                <SectionHeader icon={Globe} title="Event Internationalization" colorClass="text-indigo-600" borderClass="bg-indigo-600" />
                
                <div className="flex flex-col gap-6">
                    {!isInitialized ? (
                        <div className="flex flex-col gap-6 py-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                                    <Globe size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-slate-800">Localization Not Configured</h3>
                                    <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                                        This event does not have any internationalization data set. You can apply the standard template below to get started with translating your registration form.
                                    </p>
                                </div>
                                <button 
                                    className="btn btn-primary px-8 py-2.5 shadow-lg shadow-blue-500/20"
                                    onClick={handleInitialize}
                                >
                                    Apply Registration Template
                                </button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Template to copy</label>
                                <div className="relative group">
                                    <pre className="p-4 bg-slate-900 text-slate-300 rounded-lg text-[11px] font-mono leading-relaxed overflow-x-auto border border-slate-800 max-h-[400px]">
                                        {JSON.stringify(defaultTemplate, null, 2)}
                                    </pre>
                                    <button 
                                        className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                        onClick={() => {
                                            navigator.clipboard.writeText(JSON.stringify(defaultTemplate, null, 2));
                                            alert('Template copied to clipboard!');
                                        }}
                                        title="Copy to clipboard"
                                    >
                                        <Code size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-text-secondary max-w-md">
                                    Manage localized content for your event registration form. Switch to <strong>RAW</strong> mode to edit JSON directly.
                                </p>
                                <div className="flex bg-bg-secondary p-1 rounded-lg border border-border">
                                    <button
                                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${jsonEditMode === 'raw' ? 'bg-white shadow-sm text-accent' : 'text-text-tertiary hover:text-text-primary'}`}
                                        onClick={() => setJsonEditMode('raw')}
                                    >
                                        <Code size={14} /> RAW JSON
                                    </button>
                                    <button
                                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${jsonEditMode === 'preview-ui' ? 'bg-white shadow-sm text-accent' : 'text-text-tertiary hover:text-text-primary'}`}
                                        onClick={() => setJsonEditMode('preview-ui')}
                                    >
                                        <Eye size={14} /> VISUAL PREVIEW
                                    </button>
                                </div>
                            </div>

                            {jsonEditMode === 'raw' ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <textarea
                                            className={`w-full p-4 border rounded-lg h-[500px] font-mono text-[12px] leading-relaxed bg-[#1e293b] text-[#e2e8f0] focus:ring-2 focus:ring-accent/30 transition-all ${jsonError ? 'border-red-500' : 'border-slate-800'}`}
                                            value={jsonString}
                                            onChange={handleJsonChange}
                                            spellCheck={false}
                                        />
                                        {jsonError && (
                                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-[11px] text-red-600 font-medium">
                                                <Info size={14} className="shrink-0 mt-0.5" />
                                                <span>Invalid JSON: {jsonError}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <PreviewUI />
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                                        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">Preview Tips</p>
                                            <p className="text-[12px] text-amber-800 leading-relaxed">
                                                Hover over sections in the preview to see which parts of the localization JSON they represent. 
                                                To update the text, switch to <strong>RAW JSON</strong> mode and modify the values in the <code>visitor_registration</code> object.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocalizationSettings;
