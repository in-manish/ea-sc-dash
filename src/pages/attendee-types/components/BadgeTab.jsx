import React, { useState, useEffect } from 'react';
import { Upload, Settings, Loader2, Save, Mail, Plus } from 'lucide-react';

const BadgeTab = ({
    selectedType,
    isBadgeFlipped,
    setIsBadgeFlipped,
    setIsFullscreenPreviewOpen,
    setFullscreenPreviewType,
    badgeDesign,
    setBadgeDesign,
    handleUploadBadgeImage,
    handleUploadEmailTemplate,
    handleUpdateDesign,
    isActionLoading,
    getFullUrl,
    handleSelectType
}) => {
    const [templateDims, setTemplateDims] = useState(null);

    useEffect(() => {
        if (!selectedType?.email_badge_template) {
            setTemplateDims(null);
            return;
        }
        
        // Reset dims before fetching new ones
        setTemplateDims(null);
        
        let isMounted = true;
        const img = new Image();
        img.onload = () => {
            if (isMounted) {
                // If the natural dimensions are suspiciously high (e.g., > 2.0x of standard A4/A6 resolution @ 150 DPI),
                // we might be seeing a high-DPI scaling conflict. 
                // However, naturalWidth should theoretically always be the source pixels.
                // We'll trust naturalWidth but will also allow the user to see the badgeDesign values.
                setTemplateDims({ w: img.naturalWidth, h: img.naturalHeight });
            }
        };
        // Use a timestamp to bypass any weird cached dimension metadata in the Image class
        img.src = `${getFullUrl(selectedType.email_badge_template)}?t=${Date.now()}`;
        
        return () => {
            isMounted = false;
        };
    }, [selectedType?.email_badge_template, getFullUrl]);

    return (
        <div className="space-y-10 animate-fade-in pb-10">
            {/* BIG Image Preview */}
            <div className="p-8 lg:p-12 glass rounded-[3rem] border border-white/50 relative overflow-hidden bg-bg-secondary/10 shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 relative z-10">
                    <h4 className="text-xl font-black text-text-primary flex items-center gap-4 tracking-wide">
                        <div className="p-3 rounded-2xl bg-accent/15 shadow-inner">
                            <Mail size={24} className="text-accent" />
                        </div>
                        Email Badge Template
                    </h4>
                    {templateDims && (
                        <div className="px-5 py-2.5 bg-bg-secondary/80 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3 shadow-lg group/dims">
                            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Original Dimension</span>
                            <span className="text-sm font-mono text-text-primary font-bold">
                                {templateDims.w > 2000 ? Math.round(templateDims.w / (window.devicePixelRatio > 1 ? window.devicePixelRatio : 1)) : templateDims.w} &times; {templateDims.h > 3000 ? Math.round(templateDims.h / (window.devicePixelRatio > 1 ? window.devicePixelRatio : 1)) : templateDims.h} px
                            </span>
                            {templateDims.w > 2000 && (
                                <div className="absolute -bottom-8 right-0 bg-black/80 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover/dims:opacity-100 transition-opacity whitespace-nowrap z-50">
                                    Scaled to logical pixels ({templateDims.w} &times; {templateDims.h} source)
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-full xl:w-3/4 mx-auto min-h-[600px] glass-premium rounded-[2.5rem] p-6 relative overflow-hidden group/email mesh-bg animate-mesh">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <label className="w-full min-h-[600px] border-[3px] border-dashed border-white/20 rounded-[2rem] flex flex-col items-center justify-center gap-6 bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                        <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleUploadEmailTemplate(e.target.files[0])} disabled={isActionLoading} />
                        {selectedType.email_badge_template ? (
                            <>
                                <img 
                                    src={getFullUrl(selectedType.email_badge_template)} 
                                    className="w-full h-full object-contain p-8 relative z-5 drop-shadow-2xl transition-transform duration-700 group-hover/email:scale-105" 
                                    alt="Email Badge"
                                />
                                <div className="absolute inset-0 glossy-overlay opacity-30" />
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl opacity-0 group-hover/email:opacity-100 transition-all duration-500 flex items-center justify-center gap-6">
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setFullscreenPreviewType('email');
                                            setIsFullscreenPreviewOpen(true);
                                        }}
                                        className="p-5 bg-white/10 hover:bg-white text-white hover:text-black rounded-3xl backdrop-blur-md transition-all border border-white/20 shadow-2xl scale-90 group-hover/email:scale-100"
                                        title="Preview Fullscreen"
                                    >
                                        <Plus size={32} />
                                    </div>
                                    <div className="px-10 py-4 bg-white text-black rounded-full font-black text-sm shadow-2xl scale-90 group-hover/email:scale-100 transition-all tracking-widest uppercase">
                                        Replace Template
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-8 rounded-full bg-white/10 shadow-inner group-hover/email:scale-110 transition-transform duration-500 border border-white/10">
                                    <Upload size={40} className="text-white/60" />
                                </div>
                                <span className="text-sm font-black text-white/50 uppercase tracking-[0.3em] mt-2">Initialize Template</span>
                                <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 bg-black/20 px-4 py-1.5 rounded-full">Recommended: 1000 &times; 1400 px</span>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Template Dimensions & JSON Options at the bottom */}
            <div className="p-8 lg:p-10 glass rounded-[3rem] border border-white/50 relative overflow-hidden bg-bg-secondary/10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left side: Dimensions */}
                    <div className="lg:w-1/3 flex flex-col gap-8">
                        <div>
                            <h4 className="text-base font-black text-text-primary flex items-center gap-3 mb-2 tracking-wide">
                                <Settings size={20} className="text-accent" /> Template Dimensions
                            </h4>
                            <p className="text-[11px] text-text-tertiary font-medium">Configure the generated badge dimensions.</p>
                        </div>
                        
                        <div className="space-y-6 bg-bg-secondary/40 p-6 rounded-3xl border border-white/5 shadow-inner">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Width (px)</label>
                                <input
                                    type="number"
                                    value={badgeDesign.badge_width}
                                    onChange={(e) => setBadgeDesign({ ...badgeDesign, badge_width: e.target.value })}
                                    className="w-full p-3.5 bg-bg-primary border border-border rounded-xl text-sm shadow-inner transition-all focus:border-accent"
                                    placeholder="1000"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Height (px)</label>
                                <input
                                    type="number"
                                    value={badgeDesign.badge_height}
                                    onChange={(e) => setBadgeDesign({ ...badgeDesign, badge_height: e.target.value })}
                                    className="w-full p-3.5 bg-bg-primary border border-border rounded-xl text-sm shadow-inner transition-all focus:border-accent"
                                    placeholder="1400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right side: Layout Objects JSON */}
                    <div className="lg:w-2/3 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h4 className="text-base font-black text-text-primary mb-1 tracking-wide">Layout Objects</h4>
                                <p className="text-[11px] text-text-tertiary font-medium">JSON configuration for printed fields and barcodes.</p>
                            </div>
                            <button className="px-5 py-2 rounded-xl bg-accent/10 text-accent text-[11px] font-black uppercase tracking-wider hover:bg-accent/20 transition-colors">
                                Edit JSON
                            </button>
                        </div>
                        <div className="flex-1 text-xs font-mono text-text-secondary bg-bg-primary p-6 rounded-3xl border border-border overflow-auto shadow-inner h-[250px] custom-scrollbar">
                            <pre>{JSON.stringify(badgeDesign.displayFields, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border flex justify-end gap-4">
                <button className="btn btn-secondary px-8 py-3 rounded-2xl text-sm font-bold tracking-wide" onClick={() => handleSelectType(selectedType)}>Reset All</button>
                <button
                    className="btn btn-primary px-10 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all tracking-wide"
                    onClick={handleUpdateDesign}
                    disabled={isActionLoading}
                >
                    {isActionLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Update Design
                </button>
            </div>
        </div>
    );
};

export default BadgeTab;
