import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { exhibitorCertificateService } from '../../services/exhibitorCertificateService';
import { 
    Award, 
    UploadCloud, 
    Send, 
    RefreshCw, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Loader2, 
    Download, 
    AlertTriangle,
    MailOpen,
    Trash2,
    Users,
    Search,
    Filter,
    MailCheck,
    MailWarning
} from 'lucide-react';

const ExhibitorCertificate = () => {
    const { id: eventId } = useParams();
    const { token } = useAuth();
    const { showAlert, showConfirm } = useAlert();

    // Template state
    const [templateUrl, setTemplateUrl] = useState(null);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [templateError, setTemplateError] = useState(null);

    // Test send state
    const [testEmails, setTestEmails] = useState('');
    const [testCompanyName, setTestCompanyName] = useState('');
    const [isSendingTest, setIsSendingTest] = useState(false);

    // Send preview state
    const [previewData, setPreviewData] = useState(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [previewError, setPreviewError] = useState(null);
    const [badgeUuidFilter, setBadgeUuidFilter] = useState('');
    const [activePreviewTab, setActivePreviewTab] = useState('recipients'); // 'recipients' | 'skipped'
    const [selectedBadgeUuids, setSelectedBadgeUuids] = useState([]);

    // Bulk send state
    const [isSendingBulk, setIsSendingBulk] = useState(false);
    const [progressUuid, setProgressUuid] = useState(null);
    const [progressData, setProgressData] = useState(null);
    const [isPolling, setIsPolling] = useState(false);

    const pollIntervalRef = useRef(null);

    // Load initial data and restore any active bulk progress
    useEffect(() => {
        if (eventId && token) {
            fetchTemplate();
            restoreActiveBulkProgress();
        }
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [eventId, token]);

    // Fetch send preview when template is loaded or updated
    useEffect(() => {
        if (eventId && token && templateUrl) {
            fetchPreview();
        } else {
            setPreviewData(null);
        }
    }, [eventId, token, templateUrl]);

    const fetchTemplate = async () => {
        setIsLoadingTemplate(true);
        setTemplateError(null);
        try {
            const data = await exhibitorCertificateService.getTemplate(eventId, token);
            if (data && data.url) {
                setTemplateUrl(data.url);
            }
        } catch (err) {
            console.error('Error fetching template:', err);
            if (err.message.includes('not set')) {
                setTemplateUrl(null);
            } else {
                setTemplateError('Failed to load certificate template');
            }
        } finally {
            setIsLoadingTemplate(false);
        }
    };

    const fetchPreview = async (filterUuids = null) => {
        setIsLoadingPreview(true);
        setPreviewError(null);
        try {
            const parsedFilter = filterUuids 
                ? filterUuids.split(',').map(u => u.trim()).filter(u => u.length > 0)
                : null;
            const data = await exhibitorCertificateService.getSendPreview(eventId, token, parsedFilter);
            setPreviewData(data);
            if (data && data.recipients) {
                setSelectedBadgeUuids(data.recipients.map(r => r.badge_uuid));
            } else {
                setSelectedBadgeUuids([]);
            }
        } catch (err) {
            console.error('Error loading send preview:', err);
            setPreviewError('Failed to generate send list preview');
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const restoreActiveBulkProgress = () => {
        const savedUuid = localStorage.getItem(`exhibitor_cert_progress_${eventId}`);
        if (savedUuid) {
            setProgressUuid(savedUuid);
            setIsSendingBulk(true);
            
            // Reconstruct basic progress state until poll returns actual numbers
            setProgressData({
                sent: 0,
                total: 0,
                percentage: 0,
                status: 'in_progress'
            });

            startPolling(savedUuid);
        }
    };

    // Upload template
    const handleTemplateUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showAlert('Please select a valid image file (PNG/JPG).', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const data = await exhibitorCertificateService.uploadTemplate(eventId, token, formData);
            if (data && data.url) {
                setTemplateUrl(data.url);
                showAlert('Certificate template uploaded successfully!', 'success');
            }
        } catch (err) {
            console.error('Upload Error:', err);
            showAlert('Failed to upload certificate template.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    // Send test certificates
    const handleSendTest = async (e) => {
        e.preventDefault();
        
        if (!templateUrl) {
            showAlert('Please upload a template before sending test certificates.', 'error');
            return;
        }

        const emails = testEmails
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);

        if (emails.length === 0) {
            showAlert('Please enter at least one valid email address.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emails.filter(email => !emailRegex.test(email));
        if (invalidEmails.length > 0) {
            showAlert(`Invalid email formats: ${invalidEmails.join(', ')}`, 'error');
            return;
        }

        setIsSendingTest(true);
        try {
            await exhibitorCertificateService.sendTestCertificate(
                eventId,
                token,
                emails,
                testCompanyName.trim() || undefined
            );
            showAlert('Test certificate emails dispatched successfully!', 'success');
            setTestEmails('');
        } catch (err) {
            console.error('Send Test Error:', err);
            showAlert('Failed to send test certificate emails.', 'error');
        } finally {
            setIsSendingTest(false);
        }
    };

    // Apply filters to preview
    const handleApplyFilter = (e) => {
        e.preventDefault();
        fetchPreview(badgeUuidFilter);
    };

    // Clear filters
    const handleClearFilter = () => {
        setBadgeUuidFilter('');
        fetchPreview(null);
    };

    // Start bulk send
    const handleStartBulkSend = async () => {
        if (!templateUrl) {
            showAlert('Please upload a certificate template before starting bulk send.', 'error');
            return;
        }

        const sendCount = selectedBadgeUuids.length;
        const totalPocsCount = previewData?.total_pocs || 0;
        const skippedCount = previewData?.skipped_no_email || 0;

        if (sendCount === 0) {
            showAlert('Please select at least one recipient to send certificates to.', 'error');
            return;
        }

        const confirm = await showConfirm(
            `Are you sure you want to generate and dispatch certificates to the ${sendCount} selected exhibitors? This action cannot be undone.`,
            {
                title: 'Start Bulk Certificate Dispatch',
                confirmText: `Yes, Dispatch ${sendCount} Emails`,
                cancelText: 'Cancel'
            }
        );

        if (!confirm) return;

        setIsSendingBulk(true);
        setProgressData({ 
            sent: 0, 
            total: sendCount, 
            percentage: 0, 
            status: 'in_progress',
            total_pocs: totalPocsCount,
            will_send: sendCount,
            skipped_no_email: skippedCount
        });

        try {
            const response = await exhibitorCertificateService.sendBulkCertificates(eventId, token, selectedBadgeUuids);
            if (response && response.progress_uuid) {
                const uuid = response.progress_uuid;
                setProgressUuid(uuid);
                localStorage.setItem(`exhibitor_cert_progress_${eventId}`, uuid);
                
                setProgressData({
                    sent: 0,
                    total: response.total || response.will_send || sendCount,
                    percentage: 0,
                    status: 'in_progress',
                    total_pocs: response.total_pocs || totalPocsCount,
                    will_send: response.will_send || sendCount,
                    skipped_no_email: response.skipped_no_email || skippedCount
                });

                startPolling(uuid);
                showAlert('Bulk certificate sending job queued successfully.', 'success');
            } else {
                throw new Error('Missing progress uuid in response');
            }
        } catch (err) {
            console.error('Bulk Send Error:', err);
            showAlert('Failed to start bulk certificate distribution.', 'error');
            setIsSendingBulk(false);
        }
    };

    // Start polling progress
    const startPolling = (uuid) => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
        }

        setIsPolling(true);

        const checkProgress = async () => {
            try {
                const data = await exhibitorCertificateService.getBulkSendProgress(eventId, token, uuid);
                if (data) {
                    // Merge previous state counts with the progress update
                    setProgressData(prev => ({
                        ...prev,
                        ...data,
                        // ensure completed status triggers correctly
                        status: data.status
                    }));
                    
                    if (data.status === 'complete' || data.sent >= data.total) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                        setIsPolling(false);
                        setIsSendingBulk(false);
                        localStorage.removeItem(`exhibitor_cert_progress_${eventId}`);
                        showAlert('Bulk sending job completed successfully!', 'success');
                        // Refresh preview list counts after completion
                        fetchPreview(badgeUuidFilter || null);
                    }
                }
            } catch (err) {
                console.error('Error checking progress:', err);
            }
        };

        checkProgress();
        pollIntervalRef.current = setInterval(checkProgress, 2000);
    };

    // Cancel / Stop active view state of bulk progress
    const handleClearProgressState = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
        setIsPolling(false);
        setIsSendingBulk(false);
        setProgressUuid(null);
        setProgressData(null);
        localStorage.removeItem(`exhibitor_cert_progress_${eventId}`);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Award className="text-accent shrink-0" size={26} />
                        Exhibitor Certificate
                    </h1>
                    <p className="text-text-secondary text-sm">
                        Manage participant certificates and dispatch templates to exhibitor contact persons.
                    </p>
                </div>
                <button
                    onClick={() => {
                        fetchTemplate();
                        if (templateUrl) fetchPreview(badgeUuidFilter || null);
                    }}
                    disabled={isLoadingTemplate || isLoadingPreview}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-primary border border-border rounded-lg text-sm font-semibold hover:bg-bg-secondary transition-all disabled:opacity-50 shadow-sm"
                >
                    <RefreshCw size={16} className={(isLoadingTemplate || isLoadingPreview) ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Warning when no template set */}
            {!isLoadingTemplate && !templateUrl && (
                <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl flex gap-3 animate-fade-in">
                    <AlertTriangle className="text-warning shrink-0 font-medium" size={20} />
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">No Template Configured</h4>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            You must upload a certificate template image (e.g. PNG with dimensions suited for text overlay) before you can send test or bulk certificates. The backend overlays the exhibitor's company name in the center.
                        </p>
                    </div>
                </div>
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Template Manager - Left side (Span 7) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="card p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Certificate Template</h3>
                                <p className="text-xs text-text-tertiary">Image file uploaded for this event</p>
                            </div>
                            {templateUrl && (
                                <a 
                                    href={templateUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="btn btn-secondary px-3 py-1.5 flex items-center gap-1.5 text-xs"
                                >
                                    <Download size={14} />
                                    Download Original
                                </a>
                            )}
                        </div>

                        {/* Image Preview Container */}
                        <div className="border border-border rounded-xl bg-bg-secondary p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
                            {isLoadingTemplate ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="animate-spin text-text-tertiary" size={32} />
                                    <span className="text-sm text-text-secondary">Loading template...</span>
                                </div>
                            ) : templateUrl ? (
                                <div className="relative w-full max-w-md aspect-[1.414] bg-white border border-border shadow-md rounded-lg overflow-hidden flex items-center justify-center group-hover:shadow-lg transition-shadow">
                                    <img 
                                        src={templateUrl} 
                                        alt="Certificate Template" 
                                        className="w-full h-full object-contain"
                                    />
                                    {/* Mock Name Overlay overlay just to show user how it works */}
                                    <div className="absolute inset-x-0 top-[55%] flex justify-center">
                                        <span className="bg-bg-primary/95 text-text-primary px-3 py-1.5 rounded border border-border/80 font-semibold text-[13px] tracking-wide shadow-sm font-mono pointer-events-none uppercase">
                                            [Exhibitor Company Name]
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center gap-3 cursor-pointer p-8 hover:bg-bg-tertiary/40 w-full h-full rounded-xl transition-all border-2 border-dashed border-border hover:border-text-tertiary">
                                    <div className="p-3 bg-bg-primary rounded-xl border border-border text-text-secondary group-hover:text-accent shadow-sm">
                                        <UploadCloud size={28} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-text-primary">Click or drag image here</p>
                                        <p className="text-xs text-text-tertiary mt-1">PNG or JPG formats accepted</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleTemplateUpload}
                                        disabled={isUploading}
                                    />
                                </label>
                            )}

                            {isUploading && (
                                <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                                    <Loader2 className="animate-spin text-accent" size={32} />
                                    <span className="text-sm font-semibold text-text-primary">Uploading template...</span>
                                </div>
                            )}
                        </div>

                        {templateUrl && (
                            <div className="flex gap-2">
                                <label className="btn btn-secondary cursor-pointer flex-1 flex items-center justify-center gap-2">
                                    <UploadCloud size={16} />
                                    Upload New Template
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleTemplateUpload}
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dispatch & Operations Panel - Right side (Span 5) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Test Send Form */}
                    <div className="card p-6 flex flex-col gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                                <MailOpen size={18} className="text-text-secondary" />
                                Send Test Certificate
                            </h3>
                            <p className="text-xs text-text-tertiary">Verify design overlay and email delivery</p>
                        </div>

                        <form onSubmit={handleSendTest} className="space-y-4">
                            <div className="input-group">
                                <label className="input-label">Recipient Emails</label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="organizer@example.com, developer@example.com"
                                    className="input-field min-h-[70px] resize-none"
                                    value={testEmails}
                                    onChange={(e) => setTestEmails(e.target.value)}
                                    disabled={isSendingTest}
                                />
                                <p className="text-[10px] text-text-tertiary">Separate multiple email addresses with commas</p>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Company Name (Override)</label>
                                <input
                                    type="text"
                                    placeholder="Acme Corporation Ltd. (Default: Sample Exhibitor)"
                                    className="input-field"
                                    value={testCompanyName}
                                    onChange={(e) => setTestCompanyName(e.target.value)}
                                    disabled={isSendingTest}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSendingTest || !templateUrl}
                                className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 shadow-md shadow-accent/15"
                            >
                                {isSendingTest ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Send size={16} />
                                )}
                                Send Test Certificate
                            </button>
                        </form>
                    </div>

                    {/* Bulk Sending Controls & Active Progress Tracking */}
                    <div className="card p-6 flex flex-col gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                                <Users size={18} className="text-text-secondary" />
                                Active Dispatch Progress
                            </h3>
                            <p className="text-xs text-text-tertiary">Track active background certificate runner</p>
                        </div>

                        {/* If bulk send is active or progress exists */}
                        {isSendingBulk || progressData ? (
                            <div className="border border-border bg-bg-secondary/40 p-4 rounded-xl space-y-4 animate-fade-in">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider bg-accent/5 text-accent border border-accent/10 px-2 py-0.5 rounded">
                                            {progressData?.status === 'complete' ? 'Completed' : 'Sending'}
                                        </span>
                                        <p className="text-[11px] text-text-tertiary font-mono mt-1 text-ellipsis overflow-hidden max-w-[200px]" title={progressUuid}>
                                            Job: {progressUuid}
                                        </p>
                                    </div>
                                    {progressData?.status === 'complete' && (
                                        <button 
                                            onClick={handleClearProgressState}
                                            className="p-1 hover:bg-bg-tertiary rounded text-text-tertiary hover:text-text-primary transition-all"
                                            title="Clear progress view"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-text-secondary">Progress</span>
                                        <span className="text-text-primary">
                                            {progressData ? `${progressData.sent} / ${progressData.total}` : 'Initializing...'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-border rounded-full h-2 overflow-hidden shadow-inner">
                                        <div 
                                            className="bg-accent h-full rounded-full transition-all duration-300 ease-out"
                                            style={{ width: `${progressData?.percentage || 0}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-text-tertiary">
                                        <span>Percentage</span>
                                        <span>{progressData?.percentage || 0}%</span>
                                    </div>
                                </div>

                                {/* Custom stats breakdown from progress state */}
                                {progressData?.total_pocs !== undefined && (
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                                        <div className="bg-bg-primary p-2 rounded border border-border/40 text-center">
                                            <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider block">Total POCs</span>
                                            <span className="text-sm font-bold text-text-primary">{progressData.total_pocs}</span>
                                        </div>
                                        <div className="bg-bg-primary p-2 rounded border border-border/40 text-center">
                                            <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider block">Skipped (No Email)</span>
                                            <span className="text-sm font-bold text-status-danger">{progressData.skipped_no_email}</span>
                                        </div>
                                    </div>
                                )}

                                {progressData?.status !== 'complete' && (
                                    <div className="flex items-center gap-2 text-xs text-text-secondary bg-bg-primary p-2.5 rounded-lg border border-border shadow-sm">
                                        <Loader2 size={14} className="animate-spin text-accent" />
                                        <span>Dispense in progress. Feel free to navigate away; the task will continue.</span>
                                    </div>
                                )}

                                {progressData?.status === 'complete' && (
                                    <div className="flex items-center gap-2 text-xs text-status-success bg-status-success/5 p-2.5 rounded-lg border border-status-success/20">
                                        <CheckCircle2 size={14} />
                                        <span>All certificates sent successfully!</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-text-tertiary border border-dashed border-border rounded-xl">
                                <Users size={28} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-semibold text-text-secondary">No active dispatch job.</p>
                                <p className="text-[10px] px-4 mt-1">Review the sending list and click "Start Bulk Sending" in the preview section below to trigger deliveries.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Send Preview Section (Stretches Full Width) */}
            {templateUrl && (
                <div className="card p-6 flex flex-col gap-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                        <div>
                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                                <Search size={18} className="text-text-secondary" />
                                Bulk Send Preview & Deliveries
                            </h3>
                            <p className="text-xs text-text-tertiary">Review recipient details and filter subsets before firing bulk certificates.</p>
                        </div>

                        {/* Expandable Badge UUID filter */}
                        <form onSubmit={handleApplyFilter} className="flex items-center gap-2 max-w-md w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="text"
                                    placeholder="Filter Badge UUIDs (comma separated)"
                                    className="input-field py-1.5 pl-8 text-xs font-medium"
                                    value={badgeUuidFilter}
                                    onChange={(e) => setBadgeUuidFilter(e.target.value)}
                                    disabled={isLoadingPreview || isSendingBulk}
                                />
                                <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoadingPreview || isSendingBulk}
                                className="btn btn-primary px-3 py-1.5 text-xs flex items-center gap-1 shrink-0"
                            >
                                Apply
                            </button>
                            {badgeUuidFilter && (
                                <button
                                    type="button"
                                    onClick={handleClearFilter}
                                    disabled={isLoadingPreview || isSendingBulk}
                                    className="btn btn-secondary px-3 py-1.5 text-xs shrink-0"
                                >
                                    Clear
                                </button>
                            )}
                        </form>
                    </div>

                    {isLoadingPreview ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <Loader2 className="animate-spin text-text-tertiary" size={32} />
                            <span className="text-sm text-text-secondary font-medium">Generating send preview...</span>
                        </div>
                    ) : previewError ? (
                        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <XCircle size={18} />
                                <span>{previewError}</span>
                            </div>
                            <button 
                                onClick={() => fetchPreview(badgeUuidFilter || null)}
                                className="text-xs font-bold underline"
                            >
                                Retry
                            </button>
                        </div>
                    ) : previewData ? (
                        <div className="space-y-6">
                            
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-success/5 border border-success/10 rounded-2xl p-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-success uppercase tracking-wider block">Ready to Send</span>
                                        <span className="text-2xl font-black text-success">{previewData.will_send}</span>
                                    </div>
                                    <div className="p-3 bg-success/10 rounded-xl text-success">
                                        <MailCheck size={22} />
                                    </div>
                                </div>
                                <div className="bg-warning/5 border border-warning/10 rounded-2xl p-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-warning uppercase tracking-wider block">Skipped (No Email)</span>
                                        <span className="text-2xl font-black text-warning">{previewData.skipped_no_email}</span>
                                    </div>
                                    <div className="p-3 bg-warning/10 rounded-xl text-warning">
                                        <MailWarning size={22} />
                                    </div>
                                </div>
                                <div className="bg-bg-secondary border border-border rounded-2xl p-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Total Selected POCs</span>
                                        <span className="text-2xl font-black text-text-primary">{previewData.total_pocs}</span>
                                    </div>
                                    <div className="p-3 bg-bg-tertiary rounded-xl text-text-secondary">
                                        <Users size={22} />
                                    </div>
                                </div>
                            </div>

                            {/* Recipients/Skipped List Tabs */}
                            <div className="border border-border rounded-xl bg-bg-primary overflow-hidden">
                                <div className="flex border-b border-border bg-bg-secondary/30">
                                    <button
                                        onClick={() => setActivePreviewTab('recipients')}
                                        className={`px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activePreviewTab === 'recipients' ? 'border-accent text-text-primary' : 'border-transparent text-text-tertiary hover:text-text-secondary'}`}
                                    >
                                        Recipients ({previewData.recipients?.length || 0})
                                    </button>
                                    <button
                                        onClick={() => setActivePreviewTab('skipped')}
                                        className={`px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activePreviewTab === 'skipped' ? 'border-accent text-text-primary' : 'border-transparent text-text-tertiary hover:text-text-secondary'}`}
                                    >
                                        Skipped ({previewData.skipped?.length || 0})
                                    </button>
                                </div>

                                <div className="overflow-y-auto max-h-[300px]">
                                    {activePreviewTab === 'recipients' ? (
                                        previewData.recipients?.length > 0 ? (
                                            <>
                                                {/* Selection Status Bar */}
                                                <div className="flex items-center justify-between px-6 py-2.5 bg-bg-secondary/30 border-b border-border/80 text-xs text-text-secondary font-medium">
                                                    <span>Selected {selectedBadgeUuids.length} of {previewData.recipients.length} recipients</span>
                                                    {selectedBadgeUuids.length > 0 ? (
                                                        <button 
                                                            type="button"
                                                            onClick={() => setSelectedBadgeUuids([])}
                                                            className="text-[11px] text-status-danger hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
                                                        >
                                                            Deselect All
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            type="button"
                                                            onClick={() => setSelectedBadgeUuids(previewData.recipients.map(r => r.badge_uuid))}
                                                            className="text-[11px] text-accent hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
                                                        >
                                                            Select All
                                                        </button>
                                                    )}
                                                </div>
                                                <table className="w-full text-left text-xs border-collapse">
                                                    <thead>
                                                        <tr className="bg-bg-secondary/50 border-b border-border text-text-tertiary uppercase tracking-widest text-[9px] font-bold">
                                                            <th className="px-6 py-3 w-12 text-center">
                                                                <input 
                                                                    type="checkbox"
                                                                    className="rounded border-border text-accent focus:ring-accent w-4 h-4 cursor-pointer align-middle"
                                                                    checked={previewData.recipients.length > 0 && selectedBadgeUuids.length === previewData.recipients.length}
                                                                    ref={input => {
                                                                        if (input) {
                                                                            input.indeterminate = selectedBadgeUuids.length > 0 && selectedBadgeUuids.length < previewData.recipients.length;
                                                                        }
                                                                    }}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedBadgeUuids(previewData.recipients.map(r => r.badge_uuid));
                                                                        } else {
                                                                            setSelectedBadgeUuids([]);
                                                                        }
                                                                    }}
                                                                />
                                                            </th>
                                                            <th className="px-6 py-3">Company</th>
                                                            <th className="px-6 py-3">Email Address</th>
                                                            <th className="px-6 py-3">Badge UUID</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/60">
                                                        {previewData.recipients.map((rec, i) => (
                                                            <tr key={i} className="hover:bg-bg-secondary/20 transition-colors">
                                                                <td className="px-6 py-3 w-12 text-center">
                                                                    <input 
                                                                        type="checkbox"
                                                                        className="rounded border-border text-accent focus:ring-accent w-4 h-4 cursor-pointer align-middle"
                                                                        checked={selectedBadgeUuids.includes(rec.badge_uuid)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedBadgeUuids(prev => [...prev, rec.badge_uuid]);
                                                                            } else {
                                                                                setSelectedBadgeUuids(prev => prev.filter(uuid => uuid !== rec.badge_uuid));
                                                                            }
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-3 font-semibold text-text-primary">{rec.company_name}</td>
                                                                <td className="px-6 py-3 text-text-secondary font-mono">{rec.email}</td>
                                                                <td className="px-6 py-3 text-text-tertiary font-mono">{rec.badge_uuid}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </>
                                        ) : (
                                            <div className="py-12 text-center text-text-tertiary">
                                                <CheckCircle2 className="mx-auto mb-2 opacity-30" size={32} />
                                                <p className="font-semibold text-sm">No valid recipients found.</p>
                                                <p className="text-[11px] mt-1">Make sure you have approved exhibitor POCs with valid emails matching your filter.</p>
                                            </div>
                                        )
                                    ) : (
                                        previewData.skipped?.length > 0 ? (
                                            <table className="w-full text-left text-xs border-collapse">
                                                <thead>
                                                    <tr className="bg-bg-secondary/50 border-b border-border text-text-tertiary uppercase tracking-widest text-[9px] font-bold">
                                                        <th className="px-6 py-3">Company</th>
                                                        <th className="px-6 py-3">Badge UUID</th>
                                                        <th className="px-6 py-3">Skipped Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/60">
                                                    {previewData.skipped.map((skp, i) => (
                                                        <tr key={i} className="hover:bg-bg-secondary/20 transition-colors">
                                                            <td className="px-6 py-3 font-semibold text-text-primary">{skp.company_name}</td>
                                                            <td className="px-6 py-3 text-text-secondary font-mono">{skp.badge_uuid}</td>
                                                            <td className="px-6 py-3 text-status-danger font-medium">
                                                                {skp.reason === 'no_email' ? 'Missing contact email' : skp.reason}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="py-12 text-center text-text-tertiary">
                                                <CheckCircle2 className="mx-auto mb-2 opacity-30 text-success" size={32} />
                                                <p className="font-semibold text-sm text-text-secondary">Excellent! No entries skipped.</p>
                                                <p className="text-[11px] mt-1">Every matching exhibitor has an email address configured.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Start Send block */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-bg-secondary/60 border border-border rounded-xl">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Ready to dispatch?</h4>
                                    <p className="text-xs text-text-secondary">
                                        {selectedBadgeUuids.length > 0 
                                            ? `Clicking the button will queue certificate generation for the ${selectedBadgeUuids.length} selected exhibitors.` 
                                            : 'Please select one or more exhibitors from the recipients list to send certificates.'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleStartBulkSend}
                                    disabled={selectedBadgeUuids.length === 0 || isSendingBulk}
                                    className="btn btn-primary px-6 py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-accent/25 shrink-0"
                                >
                                    <Send size={16} />
                                    Send to {selectedBadgeUuids.length} Selected Exhibitors
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-8 text-text-tertiary">
                            <p className="text-xs">Preview details will appear here once the template is loaded.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExhibitorCertificate;
