import React from 'react';
import { Plus, Loader2, Users, Edit2, Trash2, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

const AttendeeTypeListView = ({
    isLoading,
    attendeeTypes,
    message,
    handleOpenAttendeeModal,
    handleDeleteAttendeeType,
    handleSelectType
}) => {
    return (
        <div className="animate-fade-in w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-1">Attendee Types</h1>
                    <p className="text-sm text-text-secondary">Manage attendee categories for this event</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => handleOpenAttendeeModal()}
                >
                    <Plus size={16} className="mr-2" /> Add Attendee Type
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-md mb-6 text-sm font-medium border animate-fade-in ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-bg-primary border border-border rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin mx-auto text-accent mb-2" />
                        <span className="text-sm text-text-secondary">Loading attendee types...</span>
                    </div>
                ) : attendeeTypes.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary">
                            <Users size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">No Attendee Types</h3>
                        <p className="text-text-secondary text-sm max-w-xs">You haven't added any attendee types yet. Create one to get started.</p>
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={() => handleOpenAttendeeModal()}
                        >
                            <Plus size={16} className="mr-2" /> Create First Type
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {attendeeTypes.map(type => (
                            <div key={type.id} className="p-5 flex justify-between items-center hover:bg-bg-secondary transition-colors group cursor-pointer" onClick={() => handleSelectType(type)}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[15px] font-bold text-text-primary">{type.name}</span>
                                        {type.id && <span className="text-[10px] font-mono text-text-tertiary bg-bg-secondary px-1.5 py-0.5 rounded border border-border">#{type.id}</span>}
                                        {type.is_special && (
                                            <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-tight">Special Category</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        {type.email_saved ? (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                <CheckCircle2 size={10} /> Email Template Saved
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-text-tertiary bg-bg-tertiary px-2 py-0.5 rounded border border-border">
                                                <AlertCircle size={10} /> No Email Template
                                            </span>
                                        )}
                                        {type.sms_saved && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                <CheckCircle2 size={10} /> SMS Saved
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="p-2 text-text-secondary hover:text-accent hover:bg-bg-tertiary rounded-lg transition-colors"
                                            onClick={(e) => { e.stopPropagation(); handleOpenAttendeeModal(type); }}
                                            title="Quick Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                                            onClick={(e) => { e.stopPropagation(); handleDeleteAttendeeType(type.id); }}
                                            title="Delete Type"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <ChevronRight size={20} className="text-text-tertiary" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendeeTypeListView;
