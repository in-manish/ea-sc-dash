import React from 'react';
import { Upload, Settings, Loader2, Save, Mail, Plus } from 'lucide-react';
import Badge3DPreview from './Badge3DPreview';

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
    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="flex flex-col items-center justify-center p-12 bg-bg-secondary/20 rounded-[3rem] border border-white/50 glass mesh-bg relative overflow-hidden group/canvas">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <h4 className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.3em] mb-12 relative z-10 opacity-60">Interactive 3D Engine</h4>
                    <Badge3DPreview
                        front={selectedType.badge_front}
                        back={selectedType.badge_back}
                        isFlipped={isBadgeFlipped}
                        onFlip={() => setIsBadgeFlipped(!isBadgeFlipped)}
                        onExpand={() => {
                            setFullscreenPreviewType('badge');
                            setIsFullscreenPreviewOpen(true);
                        }}
                        getFullUrl={getFullUrl}
                    />
                    <div className="mt-20 flex items-center gap-2 px-4 py-2 rounded-full glass text-[9px] font-bold text-text-tertiary uppercase tracking-wider relative z-10">
                        <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
                        Live Visualization Active
                    </div>
                </div>

                {/* Badge Uploads & Dimensions */}
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-[11px] font-bold text-text-tertiary mb-3 uppercase tracking-wider">Badge Front</h4>
                            <label className="aspect-[3/4.2] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-tertiary transition-all cursor-pointer group relative overflow-hidden">
                                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleUploadBadgeImage('badge_front', e.target.files[0])} disabled={isActionLoading} />
                                {selectedType.badge_front ? (
                                    <>
                                        <img src={getFullUrl(selectedType.badge_front)} className="w-full h-full object-contain p-2" alt="Badge Front" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload size={24} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} className="text-text-tertiary group-hover:text-accent transition-colors" />
                                        <span className="text-[9px] font-bold text-text-tertiary uppercase">Upload</span>
                                    </>
                                )}
                            </label>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold text-text-tertiary mb-3 uppercase tracking-wider">Badge Back</h4>
                            <label className="aspect-[3/4.2] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-tertiary transition-all cursor-pointer group relative overflow-hidden">
                                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleUploadBadgeImage('badge_back', e.target.files[0])} disabled={isActionLoading} />
                                {selectedType.badge_back ? (
                                    <>
                                        <img src={getFullUrl(selectedType.badge_back)} className="w-full h-full object-contain p-2" alt="Badge Back" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload size={24} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} className="text-text-tertiary group-hover:text-accent transition-colors" />
                                        <span className="text-[9px] font-bold text-text-tertiary uppercase">Upload</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                                <Settings size={18} className="text-accent" /> Dimensions & Layout
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Width (px)</label>
                                <input
                                    type="number"
                                    value={badgeDesign.badge_width}
                                    onChange={(e) => setBadgeDesign({ ...badgeDesign, badge_width: e.target.value })}
                                    className="w-full p-2.5 bg-bg-secondary border border-border rounded-lg text-sm"
                                    placeholder="1000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Height (px)</label>
                                <input
                                    type="number"
                                    value={badgeDesign.badge_height}
                                    onChange={(e) => setBadgeDesign({ ...badgeDesign, badge_height: e.target.value })}
                                    className="w-full p-2.5 bg-bg-secondary border border-border rounded-lg text-sm"
                                    placeholder="1400"
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-bg-secondary border border-border rounded-xl">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-text-secondary">Layout Objects</span>
                                <button className="text-[10px] font-bold text-accent hover:underline">Edit JSON</button>
                            </div>
                            <div className="text-[11px] font-mono text-text-tertiary bg-bg-primary p-3 rounded border border-border overflow-x-auto h-32">
                                <pre>{JSON.stringify(badgeDesign.displayFields, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3">
                <button className="btn btn-secondary px-6 py-2.5 rounded-xl text-sm" onClick={() => handleSelectType(selectedType)}>Reset</button>
                <button
                    className="btn btn-primary px-8 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-accent/20"
                    onClick={handleUpdateDesign}
                    disabled={isActionLoading}
                >
                    {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Update Design
                </button>
            </div>

            {/* Email Template Upload */}
            <div className="mt-12 p-8 glass rounded-[2.5rem] border border-white/50 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                <h4 className="text-sm font-bold text-text-primary mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/10">
                        <Mail size={18} className="text-accent" />
                    </div>
                    Email Badge Template
                </h4>
                <div className="w-full h-64 glass-premium rounded-[3rem] p-4 relative overflow-hidden group/email mesh-bg animate-mesh">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <label className="w-full h-full border-2 border-dashed border-white/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                        <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleUploadEmailTemplate(e.target.files[0])} disabled={isActionLoading} />
                        {selectedType.email_badge_template ? (
                            <>
                                <img src={getFullUrl(selectedType.email_badge_template)} className="w-full h-full object-contain p-8 relative z-5" alt="Email Badge" />
                                <div className="absolute inset-0 glossy-overlay opacity-20" />
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-xl opacity-0 group-hover/email:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setFullscreenPreviewType('email');
                                            setIsFullscreenPreviewOpen(true);
                                        }}
                                        className="p-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl backdrop-blur-md transition-all border border-white/20 shadow-2xl scale-90 group-hover/email:scale-100"
                                        title="Preview Fullscreen"
                                    >
                                        <Plus size={24} />
                                    </div>
                                    <div className="px-8 py-3.5 bg-white text-black rounded-full font-black text-xs shadow-2xl scale-90 group-hover/email:scale-100 transition-all tracking-widest uppercase">
                                        Replace Template
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-5 rounded-full bg-white/10 shadow-inner group-hover/email:scale-110 transition-transform border border-white/10">
                                    <Upload size={28} className="text-white/60" />
                                </div>
                                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mt-2">Initialize Template</span>
                            </>
                        )}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default BadgeTab;
