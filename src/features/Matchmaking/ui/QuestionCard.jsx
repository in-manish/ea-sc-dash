import React from 'react';
import { Filter, Star, Hash } from 'lucide-react';
import OptionList from './OptionList';

const QuestionCard = ({ question }) => {
    return (
        <div className="card p-5 transition-all duration-200 hover:shadow-md hover:border-border-hover animate-fade-in">
            <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-accent/5 text-accent px-2 py-0.5 rounded uppercase tracking-wider">
                            ID: {question.id}
                        </span>
                        {question.is_filter && (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-status-success/10 text-status-success px-2 py-0.5 rounded uppercase tracking-wider border border-status-success/20">
                                <Filter size={10} /> Filter
                            </span>
                        )}
                        {question.is_mandatory && (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-status-danger/10 text-status-danger px-2 py-0.5 rounded uppercase tracking-wider border border-status-danger/20">
                                <Star size={10} /> Mandatory
                            </span>
                        )}
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary leading-snug">
                        {question.title}
                    </h3>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                        <Hash size={10} /> Step {question.sort_key}
                    </span>
                    <span className="text-[11px] font-medium text-text-secondary bg-bg-secondary px-2 py-0.5 rounded border border-border">
                        {question.type === 'array' ? 'Multiple Selection' : question.type}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {question.attendee_types?.map(attendeeTypeId => (
                    <span key={attendeeTypeId} className="text-[10px] font-medium text-text-tertiary">
                        Attendee Type: {attendeeTypeId}
                    </span>
                ))}
            </div>

            <OptionList options={question.options} />
        </div>
    );
};

export default QuestionCard;
