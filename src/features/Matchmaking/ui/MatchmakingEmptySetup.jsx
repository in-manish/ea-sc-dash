import React from 'react';
import { Plus, Copy, Layout } from 'lucide-react';

const MatchmakingEmptySetup = ({ onCreate, onCopy }) => (
    <div className="col-span-full py-24 px-10 text-center bg-white rounded-[3rem] border-2 border-dashed border-border/60 flex flex-col items-center">
        <div className="mb-8 p-8 bg-bg-secondary rounded-[2rem] text-text-tertiary">
            <Layout size={48} />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3 tracking-tight">
            Matchmaking form not found
        </h3>
        <p className="text-sm text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
            This event has no matchmaking form yet. Create a new form, or copy questions from another event.
            Copy is only available while this event has no form.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
                type="button"
                onClick={onCreate}
                className="btn btn-primary py-3 px-8 rounded-xl gap-2 shadow-lg shadow-accent/10 font-bold text-[11px] border-none"
            >
                <Plus size={18} /> Create new form
            </button>
            <button
                type="button"
                onClick={onCopy}
                className="btn btn-secondary py-3 px-8 rounded-xl gap-2 font-bold text-[11px]"
            >
                <Copy size={18} /> Copy from another event
            </button>
        </div>
    </div>
);

export default MatchmakingEmptySetup;
