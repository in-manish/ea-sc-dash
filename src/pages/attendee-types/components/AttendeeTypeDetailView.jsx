import React from 'react';
import { ArrowLeft, UserCog, ImageIcon, Mail, ArrowRightLeft, Loader2, X, FileText } from 'lucide-react';
import GeneralTab from './GeneralTab';
import BadgeTab from './BadgeTab';
import DraftsTab from './DraftsTab';
import TransferTab from './TransferTab';
import EBadgeContentTab from './EBadgeContentTab';

const AttendeeTypeDetailView = ({
    selectedType,
    setSelectedType,
    activeTab,
    setActiveTab,
    isLoading,
    isActionLoading,
    message,
    setMessage,
    badgeDesign,
    setBadgeDesign,
    emailDraft,
    setEmailDraft,
    smsDraft,
    setSmsDraft,
    isBadgeFlipped,
    setIsBadgeFlipped,
    setIsFullscreenPreviewOpen,
    setFullscreenPreviewType,
    isPreviewMode,
    setIsPreviewMode,
    handleUploadBadgeImage,
    handleUploadEmailTemplate,
    handleUpdateDesign,
    handleSaveDrafts,
    handleTransferAttendees,
    handleSaveEBadgeContent,
    attendeeTypes,
    transferTargetId,
    setTransferTargetId,
    getFullUrl,
    handleSelectType
}) => {
    const tabs = [
        { id: 'general', label: 'General Settings', icon: UserCog },
        { id: 'badge', label: 'Badge Design', icon: ImageIcon },
        { id: 'drafts', label: 'Email & SMS Drafts', icon: Mail },
        { id: 'ebadge', label: 'E-Badge Content', icon: FileText },
        { id: 'transfer', label: 'Transfer Attendees', icon: ArrowRightLeft },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralTab selectedType={selectedType} />;
            case 'badge':
                return (
                    <BadgeTab
                        selectedType={selectedType}
                        isBadgeFlipped={isBadgeFlipped}
                        setIsBadgeFlipped={setIsBadgeFlipped}
                        setIsFullscreenPreviewOpen={setIsFullscreenPreviewOpen}
                        setFullscreenPreviewType={setFullscreenPreviewType}
                        badgeDesign={badgeDesign}
                        setBadgeDesign={setBadgeDesign}
                        handleUploadBadgeImage={handleUploadBadgeImage}
                        handleUploadEmailTemplate={handleUploadEmailTemplate}
                        handleUpdateDesign={handleUpdateDesign}
                        isActionLoading={isActionLoading}
                        getFullUrl={getFullUrl}
                        handleSelectType={handleSelectType}
                    />
                );
            case 'drafts':
                return (
                    <DraftsTab
                        emailDraft={emailDraft}
                        setEmailDraft={setEmailDraft}
                        smsDraft={smsDraft}
                        setSmsDraft={setSmsDraft}
                        isPreviewMode={isPreviewMode}
                        setIsPreviewMode={setIsPreviewMode}
                        handleSaveDrafts={handleSaveDrafts}
                        isActionLoading={isActionLoading}
                    />
                );
            case 'ebadge':
                return (
                    <EBadgeContentTab 
                        selectedType={selectedType} 
                        setSelectedType={setSelectedType} 
                        attendeeTypes={attendeeTypes} 
                        handleSaveEBadgeContent={handleSaveEBadgeContent}
                        isActionLoading={isActionLoading}
                    />
                );
            case 'transfer':
                return (
                    <TransferTab
                        selectedType={selectedType}
                        attendeeTypes={attendeeTypes}
                        transferTargetId={transferTargetId}
                        setTransferTargetId={setTransferTargetId}
                        handleTransferAttendees={handleTransferAttendees}
                        isActionLoading={isActionLoading}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in w-full">
            <button
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors font-medium"
                onClick={() => setSelectedType(null)}
            >
                <ArrowLeft size={18} /> Back to Attendee Types
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex flex-col gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id
                                ? 'bg-accent text-white shadow-md shadow-accent/20'
                                : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-bg-primary border border-border rounded-2xl shadow-sm min-h-[500px] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary/50">
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">{selectedType.name}</h2>
                            <p className="text-sm text-text-tertiary mt-1">Configure settings for this category</p>
                        </div>
                        {isActionLoading && <Loader2 className="animate-spin text-accent" size={20} />}
                    </div>

                    <div className="p-6 flex-1 relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-bg-primary/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                <Loader2 className="animate-spin text-accent" />
                            </div>
                        )}

                        {message.text && (
                            <div className={`p-3 rounded-lg mb-4 text-xs font-bold border flex justify-between items-center animate-fade-in ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                <span>{message.text}</span>
                                <button onClick={() => setMessage({ type: '', text: '' })}><X size={14} /></button>
                            </div>
                        )}

                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendeeTypeDetailView;
