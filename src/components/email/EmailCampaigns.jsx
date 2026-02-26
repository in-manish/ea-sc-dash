import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { emailService } from '../../services/emailService';
import { Loader2, Calendar, Clock, Users, X, Check, XCircle, AlertCircle, PlayCircle, Send, List, Grid } from 'lucide-react';
import { useParams } from 'react-router-dom';

const EmailCampaigns = () => {
    const { token, selectedEvent } = useAuth();
    const { id } = useParams();
    const eventId = id || selectedEvent?.id;

    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list');

    // Reschedule Modal
    const [rescheduleCampaign, setRescheduleCampaign] = useState(null);
    const [newDatetime, setNewDatetime] = useState('');
    const [isRescheduling, setIsRescheduling] = useState(false);

    // Cancel State
    const [isCancelling, setIsCancelling] = useState(null); // id of campaign being cancelled

    const fetchCampaigns = async () => {
        if (!eventId) return;
        setIsLoading(true);
        try {
            const data = await emailService.getCampaigns(eventId, token);
            setCampaigns(data.results || []);
        } catch (error) {
            console.error('Error fetching email campaigns:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && eventId) {
            fetchCampaigns();
        }
    }, [token, eventId]);

    const handleRescheduleSubmit = async () => {
        if (!newDatetime) {
            alert('Please select a valid date and time.');
            return;
        }

        setIsRescheduling(true);
        try {
            // Format datetime if needed (API expects valid date string)
            // e.g., "YYYY-MM-DD HH:MM:SS" or ISO
            const d = new Date(newDatetime);
            const formattedDate = d.toISOString().slice(0, 19).replace('T', ' ');

            await emailService.rescheduleCampaign(eventId, rescheduleCampaign.id, token, formattedDate);
            await fetchCampaigns();
            setRescheduleCampaign(null);
            setNewDatetime('');
        } catch (error) {
            console.error('Error rescheduling expected:', error);
            alert('Failed to reschedule campaign. Check if status allows it.');
        } finally {
            setIsRescheduling(false);
        }
    };

    const handleCancel = async (campaignId) => {
        if (!window.confirm("Are you sure you want to cancel this campaign? This action cannot be undone.")) return;

        setIsCancelling(campaignId);
        try {
            await emailService.cancelCampaign(eventId, campaignId, token);
            await fetchCampaigns();
        } catch (error) {
            console.error("Error cancelling:", error);
            alert("Failed to cancel campaign.");
        } finally {
            setIsCancelling(null);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200",
            IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
            COMPLETE: "bg-green-50 text-green-700 border-green-200",
            CANCELED: "bg-gray-100 text-gray-700 border-gray-300",
            FAILED: "bg-red-50 text-red-700 border-red-200",
        };

        const icons = {
            SCHEDULED: <Clock size={12} className="mr-1" />,
            IN_PROGRESS: <PlayCircle size={12} className="mr-1" />,
            COMPLETE: <Check size={12} className="mr-1" />,
            CANCELED: <XCircle size={12} className="mr-1" />,
            FAILED: <AlertCircle size={12} className="mr-1" />,
        };

        const currentStyle = styles[status] || "bg-gray-50 text-gray-600 border-gray-200";

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStyle}`}>
                {icons[status] || null}
                {status}
            </span>
        );
    };

    return (
        <div className="animate-fade-in relative min-h-[400px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Email Campaigns</h3>
                    <p className="text-sm text-gray-500">Monitor and manage your scheduled bulk email campaigns.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                            title="List View"
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                            title="Grid View"
                        >
                            <Grid size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-8 text-gray-400">
                        <Loader2 className="animate-spin" size={24} />
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Send size={24} className="text-gray-400" />
                        </div>
                        <h4 className="text-base font-medium text-gray-900 mb-1">No campaigns found</h4>
                        <p className="text-sm text-gray-500">Scheduled campaigns will appear here.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 animate-fade-in">
                                {campaigns.map(campaign => (
                                    <div key={campaign.id} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all flex flex-col overflow-hidden">
                                        <div className="p-4 border-b border-gray-50 flex flex-col gap-3">
                                            <div className="flex justify-between items-start w-full">
                                                <h3 className="font-semibold text-gray-800 leading-tight text-base truncate pr-2" title={campaign.name}>
                                                    {campaign.name || 'Unnamed Campaign'}
                                                </h3>
                                                <StatusBadge status={campaign.status} />
                                            </div>
                                            <div className="text-sm text-gray-600 font-medium line-clamp-1" title={campaign.subject}>
                                                <span className="text-gray-400 font-normal mr-1">Subj:</span>
                                                {campaign.subject || '(No Subject)'}
                                            </div>
                                        </div>

                                        <div className="p-4 flex-1 bg-gray-50/30 flex flex-col gap-3">
                                            <div className="flex items-center text-sm text-gray-700 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                                <Calendar size={16} className="text-blue-500 mr-2" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Scheduled For</span>
                                                    <span>{campaign.scheduled_time ? new Date(campaign.scheduled_time).toLocaleString() : 'Immediate'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-700 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                                <Users size={16} className="text-indigo-500 mr-2" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Recipients</span>
                                                    <span>{campaign.number_recipients || 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="px-4 py-3 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                                            {campaign.status === 'SCHEDULED' && (
                                                <>
                                                    <button
                                                        onClick={() => setRescheduleCampaign(campaign)}
                                                        className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                                                    >
                                                        Reschedule
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(campaign.id)}
                                                        disabled={isCancelling === campaign.id}
                                                        className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors flex items-center gap-1"
                                                    >
                                                        {isCancelling === campaign.id && <Loader2 size={12} className="animate-spin" />}
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            {campaign.status !== 'SCHEDULED' && (
                                                <span className="text-xs text-gray-400 italic py-1">No actions available</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 animate-fade-in">
                                {campaigns.map(campaign => (
                                    <div key={campaign.id} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all flex flex-col sm:flex-row items-stretch overflow-hidden min-h-[5rem] relative">

                                        <div className="w-full sm:w-1/3 p-4 border-b sm:border-b-0 sm:border-r border-gray-50 flex flex-col shrink-0 justify-center bg-gray-50/30">
                                            <div className="flex items-center justify-between mb-1 text-sm">
                                                <h3 className="font-semibold text-gray-800 leading-tight text-base truncate pr-2 w-full" title={campaign.name}>
                                                    {campaign.name || 'Unnamed Campaign'}
                                                </h3>
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1.5 flex items-center gap-2">
                                                <span>Subject: {campaign.subject || '(No Subject)'}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 px-4 py-3 flex flex-row items-center justify-between min-w-0">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm text-gray-700 gap-4 sm:gap-6">
                                                <div className="flex flex-col items-start min-w-[120px]">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center"><Calendar size={12} className="mr-1 inline text-blue-500" /> Scheduled</span>
                                                    <span className="font-medium text-xs text-gray-800">{campaign.scheduled_time ? new Date(campaign.scheduled_time).toLocaleString() : 'Immediate'}</span>
                                                </div>
                                                <div className="flex flex-col items-start min-w-[80px]">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center"><Users size={12} className="mr-1 inline text-indigo-500" /> Recipients</span>
                                                    <span className="font-medium text-xs text-gray-800">{campaign.number_recipients || 0}</span>
                                                </div>
                                            </div>
                                            <div className="px-4">
                                                <StatusBadge status={campaign.status} />
                                            </div>
                                        </div>

                                        <div className="px-4 py-3 sm:w-[220px] shrink-0 flex items-center justify-end gap-2 border-t sm:border-t-0 sm:border-l border-gray-50 bg-gray-50/50 sm:bg-transparent min-h-full">
                                            {campaign.status === 'SCHEDULED' ? (
                                                <div className="flex items-center gap-2 w-full justify-end">
                                                    <button
                                                        onClick={() => setRescheduleCampaign(campaign)}
                                                        className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors text-center"
                                                    >
                                                        Reschedule
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(campaign.id)}
                                                        disabled={isCancelling === campaign.id}
                                                        className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-red-700 bg-white hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                                                    >
                                                        {isCancelling === campaign.id && <Loader2 size={12} className="animate-spin" />}
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic text-right w-full">No actions available</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Reschedule Modal */}
            {rescheduleCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100 mt-[-10vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar size={18} className="text-blue-600" />
                                Reschedule Campaign
                            </h3>
                            <button
                                onClick={() => {
                                    setRescheduleCampaign(null);
                                    setNewDatetime('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Select a new date and time for <strong>{rescheduleCampaign.name}</strong>.</p>
                                <p className="text-xs text-gray-500 bg-blue-50 text-blue-800 p-2 rounded border border-blue-100 inline-block mb-4">
                                    Current schedule: {new Date(rescheduleCampaign.scheduled_time).toLocaleString()}
                                </p>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">New Date & Time</label>
                            <input
                                type="datetime-local"
                                value={newDatetime}
                                onChange={(e) => setNewDatetime(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm mb-6"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setRescheduleCampaign(null);
                                        setNewDatetime('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleRescheduleSubmit}
                                    disabled={isRescheduling || !newDatetime}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                                >
                                    {isRescheduling && <Loader2 size={16} className="animate-spin" />}
                                    Confirm Reschedule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailCampaigns;
