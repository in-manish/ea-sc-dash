import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { meetingService } from '../../services/meetingService';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Play, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const RestoreMeeting = () => {
    const { id: eventId } = useParams();
    const { token } = useAuth();
    
    const [filters, setFilters] = useState({
        meeting_ids: '',
        sender_email: '',
        receiver_email: '',
        sender_evc_id: '',
        receiver_evc_id: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [previewData, setPreviewData] = useState(null);
    const [actionResult, setActionResult] = useState(null);
    const [selectedMeetingIds, setSelectedMeetingIds] = useState([]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getCleanFilters = () => {
        const clean = {};
        Object.keys(filters).forEach(k => {
            if (filters[k]) clean[k] = filters[k].trim();
        });
        return clean;
    };

    const handlePreview = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        setPreviewData(null);
        setActionResult(null);
        setSelectedMeetingIds([]);
        try {
            const data = await meetingService.getRestorePreview(token, eventId, getCleanFilters());
            setPreviewData(data);
        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.detail || 'Failed to fetch preview');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedMeetingIds(previewData.results.map(item => item.meeting_id));
        } else {
            setSelectedMeetingIds([]);
        }
    };

    const handleSelectOne = (meetingId) => {
        setSelectedMeetingIds(prev => {
            if (prev.includes(meetingId)) {
                return prev.filter(id => id !== meetingId);
            } else {
                return [...prev, meetingId];
            }
        });
    };

    const getTargetMeetingIds = () => {
        if (selectedMeetingIds.length > 0) {
            return selectedMeetingIds;
        } else if (filters.meeting_ids) {
            return filters.meeting_ids.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
        } else if (previewData?.results?.length > 0) {
            // fallback: if they just hit preview but didn't select, we can use all of them
            // or we could require selection. The prompt implies we want them to select, but previously it was auto.
            // Let's use selection if available, else all previewed.
            return previewData.results.map(item => item.meeting_id);
        }
        return [];
    };

    const handleDryRun = async () => {
        const meetingIds = getTargetMeetingIds();

        if (meetingIds.length === 0) {
            setError("Please select at least one meeting from the list or provide comma-separated meeting_ids.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');
        setPreviewData(null);
        setActionResult(null);
        try {
            const data = await meetingService.dispatchRestoreAction(token, eventId, {
                action: 'dry_run',
                meeting_ids: meetingIds
            });
            setActionResult(data);
        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.detail || 'Failed to perform dry run');
        } finally {
            setLoading(false);
        }
    };

    const handleAutoApply = async () => {
        const meetingIds = getTargetMeetingIds();

        if (meetingIds.length === 0) {
            setError("Please select at least one meeting from the list or provide comma-separated meeting_ids.");
            return;
        }

        if (!window.confirm(`Are you sure you want to auto-apply high confidence restores for ${meetingIds.length} meeting(s)?`)) {
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const data = await meetingService.dispatchRestoreAction(token, eventId, {
                action: 'apply',
                meeting_ids: meetingIds,
                auto_apply_high_confidence: true
            });
            setSuccessMessage(`Restored: ${data.restored_count}, Skipped: ${data.skipped_count}. Actor: ${data.actor}`);
            if (data.errors && data.errors.length > 0) {
                setError(`Some errors occurred: ${JSON.stringify(data.errors)}`);
            }
        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.detail || 'Failed to apply restore');
        } finally {
            setLoading(false);
        }
    };

    const renderRestoreInfo = (restoreInfo) => {
        if (!restoreInfo) return <span className="text-text-tertiary text-xs">No Candidate</span>;
        
        return (
            <div className="flex flex-col gap-2 min-w-[200px]">
                {restoreInfo.manual_review_required && (
                    <div className="text-orange-600 text-[11px] font-bold bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 w-fit uppercase tracking-wider">Manual Review</div>
                )}
                {restoreInfo.auto_candidate && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded p-2 text-xs">
                        <div className="font-semibold text-green-700 flex justify-between">
                            <span>Auto Candidate</span>
                            <span className="opacity-70 capitalize">{restoreInfo.auto_candidate.confidence} Conf</span>
                        </div>
                        <div className="mt-1 space-y-0.5">
                            <div className="font-medium text-text-primary">{restoreInfo.auto_candidate.badge?.name || 'Unknown Name'}</div>
                            <div className="text-text-secondary truncate">{restoreInfo.auto_candidate.badge?.email || 'No email'}</div>
                            <div className="text-text-tertiary text-[10px]">
                                EVC: {restoreInfo.auto_candidate.badge?.evc_id} | ID: {restoreInfo.auto_candidate.candidate_id}
                            </div>
                        </div>
                    </div>
                )}
                {restoreInfo.ambiguous_badges && restoreInfo.ambiguous_badges.length > 0 && (
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded p-2 text-xs">
                        <div className="font-semibold text-orange-700 mb-1">Ambiguous Badges ({restoreInfo.ambiguous_badges.length})</div>
                        <div className="max-h-24 overflow-y-auto flex flex-col gap-1.5 pr-1">
                            {restoreInfo.ambiguous_badges.map((b, i) => (
                                <div key={i} className="pb-1.5 border-b border-orange-500/10 last:border-0 last:pb-0">
                                    <div className="font-medium text-text-primary">{b.name}</div>
                                    <div className="text-text-secondary truncate">{b.email}</div>
                                    <div className="text-text-tertiary text-[10px]">EVC: {b.evc_id} | {b.company}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSnapshotInfo = (snapshot) => {
        if (!snapshot || !snapshot.name) return <span className="text-text-tertiary text-xs italic">Empty</span>;
        return (
            <div className="flex flex-col gap-0.5 text-xs min-w-[150px]">
                <div className="font-semibold text-text-primary">{snapshot.name}</div>
                <div className="text-text-secondary truncate" title={snapshot.email}>{snapshot.email}</div>
                <div className="text-text-secondary truncate" title={snapshot.company}>{snapshot.company}</div>
                <div className="text-text-tertiary text-[10px] mt-1">EVC: {snapshot.evc_id || 'N/A'}</div>
            </div>
        );
    };

    const isAllSelected = previewData?.results?.length > 0 && selectedMeetingIds.length === previewData.results.length;

    return (
        <div className="flex flex-col gap-6">
            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Meeting IDs (comma-separated)</label>
                    <input
                        type="text"
                        name="meeting_ids"
                        value={filters.meeting_ids}
                        onChange={handleFilterChange}
                        placeholder="e.g. 101, 102"
                        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Sender Email</label>
                    <input
                        type="email"
                        name="sender_email"
                        value={filters.sender_email}
                        onChange={handleFilterChange}
                        placeholder="e.g. alice@example.com"
                        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Receiver Email</label>
                    <input
                        type="email"
                        name="receiver_email"
                        value={filters.receiver_email}
                        onChange={handleFilterChange}
                        placeholder="e.g. bob@example.com"
                        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Sender EVC ID</label>
                    <input
                        type="text"
                        name="sender_evc_id"
                        value={filters.sender_evc_id}
                        onChange={handleFilterChange}
                        placeholder="e.g. 9001"
                        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Receiver EVC ID</label>
                    <input
                        type="text"
                        name="receiver_evc_id"
                        value={filters.receiver_evc_id}
                        onChange={handleFilterChange}
                        placeholder="e.g. 9002"
                        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 border-b border-border pb-6">
                <button
                    onClick={handlePreview}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-secondary text-text-primary border border-border rounded-lg font-medium hover:bg-bg-tertiary transition-colors disabled:opacity-50"
                >
                    <Search size={16} />
                    Preview List
                </button>
                <div className="h-6 w-px bg-border mx-1"></div>
                <button
                    onClick={handleDryRun}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg font-medium hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                >
                    <Play size={16} />
                    Dry Run {selectedMeetingIds.length > 0 && `(${selectedMeetingIds.length})`}
                </button>
                <button
                    onClick={handleAutoApply}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50"
                >
                    <CheckCircle size={16} />
                    Auto Apply High Confidence {selectedMeetingIds.length > 0 && `(${selectedMeetingIds.length})`}
                </button>
                
                {loading && <RefreshCw size={20} className="animate-spin text-text-secondary ml-2" />}
            </div>

            {/* Status Messages */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-red-600 text-sm whitespace-pre-wrap">{error}</div>
                </div>
            )}

            {successMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-green-600 text-sm whitespace-pre-wrap">{successMessage}</div>
                </div>
            )}

            {/* Preview / Results Area */}
            {previewData && (
                <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-text-primary">Preview Results</h3>
                        <div className="flex gap-4 text-sm bg-bg-secondary px-4 py-2 rounded-lg border border-border">
                            <span className="text-text-secondary">Total: <strong className="text-text-primary">{previewData.total}</strong></span>
                            <span className="text-orange-600">Manual Review Required: <strong>{previewData.manual_review_required_count}</strong></span>
                            <span className="text-accent border-l border-border pl-4 ml-2">Selected: <strong>{selectedMeetingIds.length}</strong></span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto border border-border rounded-lg bg-bg-primary shadow-sm">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-bg-secondary text-text-secondary uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 border-b border-border w-10 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded border-border text-accent cursor-pointer accent-accent"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-3 border-b border-border">Meeting ID</th>
                                    <th className="px-4 py-3 border-b border-border">Status / Date</th>
                                    <th className="px-4 py-3 border-b border-border">Sender Snapshot</th>
                                    <th className="px-4 py-3 border-b border-border">Receiver Snapshot</th>
                                    <th className="px-4 py-3 border-b border-border bg-bg-secondary/50">Sender Restore</th>
                                    <th className="px-4 py-3 border-b border-border bg-bg-secondary/50">Receiver Restore</th>
                                </tr>
                            </thead>
                            <tbody className="align-top">
                                {(previewData.results || []).map((item) => (
                                    <tr key={item.meeting_id} className={`border-b border-border last:border-0 transition-colors ${selectedMeetingIds.includes(item.meeting_id) ? 'bg-accent/5' : 'hover:bg-bg-secondary/30'}`}>
                                        <td className="px-4 py-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-border text-accent cursor-pointer accent-accent"
                                                checked={selectedMeetingIds.includes(item.meeting_id)}
                                                onChange={() => handleSelectOne(item.meeting_id)}
                                            />
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-text-primary">{item.meeting_id}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-bold text-[11px] px-2 py-0.5 rounded bg-bg-secondary text-text-primary inline-block mb-1">{item.status}</div>
                                            <div className="text-xs text-text-secondary">{item.meeting_date}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {renderSnapshotInfo(item.sender_snapshot)}
                                        </td>
                                        <td className="px-4 py-4">
                                            {renderSnapshotInfo(item.receiver_snapshot)}
                                        </td>
                                        <td className="px-4 py-4 bg-bg-secondary/10">
                                            {renderRestoreInfo(item.sender_restore)}
                                        </td>
                                        <td className="px-4 py-4 bg-bg-secondary/10">
                                            {renderRestoreInfo(item.receiver_restore)}
                                        </td>
                                    </tr>
                                ))}
                                {(!previewData.results || previewData.results.length === 0) && (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-12 text-center text-text-tertiary">No records found matching your filters</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {actionResult && (
                <div className="flex flex-col gap-4 animate-fade-in mt-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-text-primary">Dry Run Results</h3>
                        <div className="flex gap-4 text-sm bg-bg-secondary px-4 py-2 rounded-lg border border-border">
                            <span className="text-text-secondary">Total Processed: <strong className="text-text-primary">{actionResult.total}</strong></span>
                            <span className="text-orange-600">Ambiguous: <strong>{actionResult.ambiguous_count}</strong></span>
                        </div>
                    </div>
                    
                    <div className="bg-bg-secondary rounded-lg p-4 font-mono text-xs overflow-x-auto border border-border">
                        <pre className="text-text-primary">
                            {JSON.stringify(actionResult.results, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestoreMeeting;
