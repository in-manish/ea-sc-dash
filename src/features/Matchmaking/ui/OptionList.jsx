import { Layout } from 'lucide-react';

const OptionList = ({ options, type }) => {
    if (!options || options.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-bg-secondary/30 rounded-xl border border-dashed border-border/80 text-text-tertiary/40 mt-4 mx-auto w-full group-hover:bg-bg-secondary/50 transition-all duration-500">
                <Layout size={24} className="mb-2 opacity-10 group-hover:opacity-20 transition-opacity" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-center">No configurations defined</p>
                <p className="text-[8px] font-medium mt-1 text-center opacity-60">Click edit to build this step</p>
            </div>
        );
    }

    const isGrouped = type === 'grouped_array';

    return (
        <div className="mt-6">
            <h4 className="flex items-center gap-2 text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
                <span className="w-1 h-1 rounded-full bg-accent/40" />
                {isGrouped ? 'Grouped Configurations' : `Available Options (${options.length})`}
            </h4>
            <div className="space-y-3">
                {isGrouped ? (
                    <div className="grid grid-cols-1 gap-3">
                        {options.map((group, idx) => (
                            <div key={idx} className="bg-bg-secondary/40 p-4 rounded-xl border border-border/60 hover:border-border transition-colors">
                                <p className="text-[10px] font-bold text-text-primary mb-2 flex items-center justify-between">
                                    {group.name}
                                    <span className="text-[8px] bg-bg-tertiary px-1.5 py-0.5 rounded text-text-tertiary font-medium">{group.values?.length || 0} values</span>
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {group.values?.map((opt) => (
                                        <span key={opt.id} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white text-[10px] font-semibold text-text-secondary border border-border shadow-sm">
                                            {opt.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {options.map((option) => (
                            <span key={option.id} className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold bg-bg-secondary text-text-secondary border border-border/80 transition-all hover:border-accent/30 hover:bg-white hover:shadow-sm">
                                {option.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OptionList;
