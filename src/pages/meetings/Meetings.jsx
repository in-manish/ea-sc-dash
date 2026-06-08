import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, List } from 'lucide-react';
import RestoreMeeting from '../../components/meetings/RestoreMeeting';
import MeetingList from '../../components/meetings/MeetingList';

const Meetings = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';

    const setActiveTab = (tab) => {
        setSearchParams(params => {
            params.set('tab', tab);
            return params;
        });
    };

    return (
        <div className="meetings-page animate-fade-in">
            <div className="mb-6 flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">Meetings</h1>
                <p className="text-[0.925rem] text-text-secondary">Manage event meetings and restoration.</p>
            </div>

            <div className="flex border-b border-border mb-6 gap-2">
                <button
                    className={`px-4 py-2.5 font-medium text-[0.925rem] flex items-center gap-2 border-b-2 transition-all duration-200 ${activeTab === 'list'
                        ? 'border-accent text-accent bg-accent/5 rounded-t-lg'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-t-lg'
                        }`}
                    onClick={() => setActiveTab('list')}
                >
                    <List size={18} className={activeTab === 'list' ? 'text-accent' : 'text-text-tertiary'} />
                    List Meetings
                </button>
                <button
                    className={`px-4 py-2.5 font-medium text-[0.925rem] flex items-center gap-2 border-b-2 transition-all duration-200 ${activeTab === 'restore'
                        ? 'border-accent text-accent bg-accent/5 rounded-t-lg'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-t-lg'
                        }`}
                    onClick={() => setActiveTab('restore')}
                >
                    <RefreshCw size={18} className={activeTab === 'restore' ? 'text-accent' : 'text-text-tertiary'} />
                    Restore Meeting
                </button>
            </div>

            <div className="bg-bg-primary border border-border rounded-xl shadow-sm p-6 overflow-hidden">
                {activeTab === 'list' && <MeetingList />}
                {activeTab === 'restore' && <RestoreMeeting />}
            </div>
        </div>
    );
};

export default Meetings;
