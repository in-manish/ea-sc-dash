import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { celeryService } from '../../services/celeryService';
import { RefreshCw, Play, Pause, Clock, CheckCircle2, XCircle, Info, Edit2, X, Save, Loader2, ChevronDown, Calendar } from 'lucide-react';

const TaskEditModal = ({ isOpen, onClose, onSave, task, isSaving }) => {
    const [formData, setFormData] = useState({
        name: '',
        queue: 'Default',
        schedule_type: 'interval',
        enabled: true,
        interval: { every: 60, period: 'seconds' },
        crontab: { minute: '*', hour: '*', day_of_week: '*', day_of_month: '*', month_of_year: '*' }
    });

    useEffect(() => {
        if (task) {
            setFormData({
                name: task.name || '',
                queue: task.queue || 'Default',
                enabled: task.enabled ?? true,
                schedule_type: task.schedule_type?.type || 'interval',
                interval: task.schedule_type?.interval || { every: 60, period: 'seconds' },
                crontab: task.schedule_type?.crontab || { minute: '*', hour: '*', day_of_week: '*', day_of_month: '*', month_of_year: '*' }
            });
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const QUEUES = ['PRIMARY', 'SECONDARY', 'TERTIARY', 'ALFA', 'LONGHAUL', 'Default'];
    const PERIODS = ['seconds', 'minutes', 'hours', 'days'];

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
            <div className="bg-bg-primary w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border animate-slide-up">
                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary/30">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Edit Beat Task</h3>
                        <p className="text-xs text-text-tertiary mt-1">Configure schedule and execution settings</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Task Name</label>
                        <input
                            type="text"
                            readOnly
                            className="w-full p-3 bg-bg-tertiary border border-border rounded-xl text-sm font-medium text-text-secondary cursor-not-allowed"
                            value={formData.name}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Queue</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                                    value={formData.queue}
                                    onChange={(e) => setFormData({ ...formData, queue: e.target.value })}
                                >
                                    {QUEUES.map(q => <option key={q} value={q}>{q}</option>)}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Schedule Type</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                                    value={formData.schedule_type}
                                    onChange={(e) => setFormData({ ...formData, schedule_type: e.target.value })}
                                >
                                    <option value="interval">Interval</option>
                                    <option value="crontab">Crontab</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-secondary/50 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${formData.enabled ? 'bg-success/10 text-success' : 'bg-text-tertiary/10 text-text-tertiary'}`}>
                                {formData.enabled ? <Play size={18} /> : <Pause size={18} />}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-text-primary">Status</h4>
                                <p className="text-[11px] text-text-tertiary">Enable or disable this periodic task</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shadow-inner ${formData.enabled ? 'bg-success' : 'bg-slate-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${formData.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {formData.schedule_type === 'interval' ? (
                        <div className="p-4 bg-bg-secondary rounded-xl border border-border space-y-4">
                            <div className="flex items-center gap-2 text-accent">
                                <Clock size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Interval Settings</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-tertiary uppercase">Every</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 bg-bg-primary border border-border rounded-lg text-sm"
                                        value={formData.interval.every}
                                        onChange={(e) => setFormData({ ...formData, interval: { ...formData.interval, every: parseInt(e.target.value) } })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-tertiary uppercase">Period</label>
                                    <select
                                        className="w-full p-2 bg-bg-primary border border-border rounded-lg text-sm"
                                        value={formData.interval.period}
                                        onChange={(e) => setFormData({ ...formData, interval: { ...formData.interval, period: e.target.value } })}
                                    >
                                        {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-bg-secondary rounded-xl border border-border space-y-4">
                            <div className="flex items-center gap-2 text-accent">
                                <Calendar size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Crontab Settings</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {['minute', 'hour', 'day_of_week', 'day_of_month', 'month_of_year'].map(field => (
                                    <div key={field} className="space-y-1">
                                        <label className="text-[9px] font-bold text-text-tertiary uppercase truncate">{field.replace(/_/g, ' ')}</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-bg-primary border border-border rounded-lg text-xs text-center"
                                            value={formData.crontab[field]}
                                            onChange={(e) => setFormData({ ...formData, crontab: { ...formData.crontab, [field]: e.target.value } })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-bg-tertiary text-text-primary rounded-xl font-bold text-sm hover:bg-border transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-accent text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:opacity-90 transition-all disabled:opacity-50"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CeleryManage = () => {
    const { token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await celeryService.getCeleryBeatTasks(token);
            if (response.status === 'success') {
                setTasks(response.data || []);
            } else {
                setError(response.message || 'Failed to fetch tasks');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load Celery beat tasks. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTasks();
    }, [token]);

    const handleToggleStatus = async (task) => {
        const newStatus = !task.enabled;
        try {
            const response = await celeryService.updateTaskStatus(token, task.name, newStatus);
            if (response.status === 'success') {
                setTasks(prev => prev.map(t => t.name === task.name ? { ...t, enabled: newStatus, periodic_task: { ...t.periodic_task, enabled: newStatus } } : t));
                showSuccess(`Task ${newStatus ? 'enabled' : 'disabled'} successfully.`);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to update task status.');
        }
    };

    const handleSaveTask = async (formData) => {
        setIsSaving(true);
        try {
            const taskId = selectedTask.periodic_task?.id;
            if (!taskId) throw new Error('Task ID not found');

            const payload = {
                schedule_type: formData.schedule_type,
                schedule_value: formData.schedule_type === 'interval' ? formData.interval : formData.crontab,
                queue: formData.queue,
                enabled: formData.enabled,
                args: JSON.parse(selectedTask.periodic_task?.args || '[]'),
                kwargs: JSON.parse(selectedTask.periodic_task?.kwargs || '{}'),
                description: selectedTask.periodic_task?.description || '',
                one_off: selectedTask.periodic_task?.one_off || false,
                priority: selectedTask.periodic_task?.priority || 0,
                headers: JSON.parse(selectedTask.periodic_task?.headers || '{}')
            };

            const response = await celeryService.updateTask(token, taskId, payload);
            if (response.status === 'success') {
                // Update local state with the returned task data
                setTasks(prev => prev.map(t => t.periodic_task?.id === taskId ? response.data : t));
                showSuccess('Task settings updated successfully.');
                setIsEditModalOpen(false);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to save task settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const getScheduleText = (task) => {
        if (!task.schedule_type) return 'N/A';
        if (task.schedule_type.type === 'interval') {
            const { every, period } = task.schedule_type.interval;
            return `Every ${every} ${period}`;
        }
        if (task.schedule_type.type === 'crontab') {
            const { minute, hour, day_of_week, day_of_month, month_of_year } = task.schedule_type.crontab;
            return `Cron: ${minute} ${hour} ${day_of_week} ${day_of_month} ${month_of_year}`;
        }
        return task.schedule_type.type;
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Celery Manage</h1>
                    <p className="text-text-secondary text-sm">Manage periodic tasks and background workers</p>
                </div>
                <button
                    onClick={fetchTasks}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-primary border border-border rounded-lg text-sm font-semibold hover:bg-bg-secondary transition-all disabled:opacity-50 shadow-sm"
                >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Notifications */}
            {error && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-center gap-3 animate-fade-in relative">
                    <XCircle size={18} />
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError(null)} className="p-1 hover:bg-danger/20 rounded">
                        <X size={14} />
                    </button>
                </div>
            )}
            {successMessage && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 size={18} />
                    {successMessage}
                </div>
            )}

            {/* Tasks Table */}
            <div className="bg-bg-primary border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-secondary/50 border-b border-border">
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Task Detail</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Schedule</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Queue</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Last Run</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-48 mb-2"></div><div className="h-3 bg-bg-tertiary rounded w-32 opacity-50"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-bg-tertiary rounded w-12"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-28"></div></td>
                                        <td className="px-6 py-4"><div className="flex justify-end gap-2"><div className="w-8 h-8 bg-bg-tertiary rounded"></div><div className="w-8 h-8 bg-bg-tertiary rounded"></div></div></td>
                                    </tr>
                                ))
                            ) : tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <tr key={index} className="hover:bg-bg-secondary/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col max-w-xs md:max-w-md">
                                                <span className="text-sm font-bold text-text-primary break-all group-hover:text-accent transition-colors">{task.name}</span>
                                                <span className="text-[11px] text-text-tertiary mt-1 font-medium">{task.periodic_task?.task}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                                                <Clock size={14} className="text-text-tertiary" />
                                                {getScheduleText(task)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                task.queue === 'PRIMARY' ? 'bg-accent/10 text-accent border border-accent/20' : 
                                                task.queue === 'ALFA' ? 'bg-warning/10 text-warning border border-warning/20' :
                                                'bg-bg-tertiary text-text-secondary border border-border'
                                            }`}>
                                                {task.queue || 'Default'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => handleToggleStatus(task)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shadow-inner ${task.enabled ? 'bg-success' : 'bg-slate-200'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${task.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] text-text-secondary font-medium">
                                                    {task.periodic_task?.last_run_at 
                                                        ? new Date(task.periodic_task.last_run_at).toLocaleDateString() 
                                                        : 'Never'}
                                                </span>
                                                {task.periodic_task?.last_run_at && (
                                                    <span className="text-[11px] text-text-tertiary">
                                                        {new Date(task.periodic_task.last_run_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => { setSelectedTask(task); setIsEditModalOpen(true); }}
                                                    className="p-2 text-text-tertiary hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                                                    title="Edit Configuration"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all"
                                                    title="View Metadata"
                                                >
                                                    <Info size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-text-tertiary">
                                            <Clock size={48} strokeWidth={1} />
                                            <p className="text-sm font-medium">No Celery beat tasks found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TaskEditModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                task={selectedTask}
                onSave={handleSaveTask}
                isSaving={isSaving}
            />
        </div>
    );
};

export default CeleryManage;
