import React from 'react';
import { useSearchParams } from 'react-router-dom';
import RestoreMeeting from '../../components/meetings/RestoreMeeting';
import MeetingList from '../../components/meetings/MeetingList';
import { MeetingStatsReportTab } from '../../features/MeetingStats';
import MeetingsTabs from './MeetingsTabs';

const Meetings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'list';

  const setActiveTab = (tab) => {
    setSearchParams((params) => {
      params.set('tab', tab);
      return params;
    });
  };

  return (
    <div className="meetings-page animate-fade-in">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Meetings</h1>
        <p className="text-[0.925rem] text-text-secondary">
          Manage event meetings, restoration, and stats.
        </p>
      </div>

      <MeetingsTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="bg-bg-primary border border-border rounded-xl shadow-sm p-6 overflow-hidden">
        {activeTab === 'list' && <MeetingList />}
        {activeTab === 'restore' && <RestoreMeeting />}
        {activeTab === 'stats' && <MeetingStatsReportTab />}
      </div>
    </div>
  );
};

export default Meetings;
