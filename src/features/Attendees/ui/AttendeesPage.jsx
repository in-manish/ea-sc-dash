import React, { useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import useAttendeeFilters from '../hooks/useAttendeeFilters';
import useAttendeeSearch from '../hooks/useAttendeeSearch';
import useAttendeeList from '../hooks/useAttendeeList';
import useAttendeeSelection from '../hooks/useAttendeeSelection';
import useWhatsAppSend from '../hooks/useWhatsAppSend';
import useEBadgeActions from '../hooks/useEBadgeActions';
import useScBadgeSync from '../hooks/useScBadgeSync';
import useEBadgeJobs from '../hooks/useEBadgeJobs';
import useAttendeeTypes from '../hooks/useAttendeeTypes';
import AttendeesPageHeader from './AttendeesPageHeader';
import AttendeesTabs from './AttendeesTabs';
import AttendeesListView from './AttendeesListView';
import EBadgeTasksPanel from './EBadgeTasksPanel';
import AttendeesModals from './AttendeesModals';

const AttendeesPage = () => {
    const { selectedEvent, token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [activeTab, setActiveTab] = useState('list');
    const clearSelectionRef = useRef(() => {});
    const getSelectionRef = useRef(() => ({
        selectionMode: 'none',
        selectedAttendeeUuids: [],
    }));

    const filtersApi = useAttendeeFilters(searchParams);
    const { attendeeTypes, loading: attendeeTypesLoading } = useAttendeeTypes(
        selectedEvent?.id,
        token,
    );
    const searchApi = useAttendeeSearch(searchParams, setPage);
    const list = useAttendeeList({
        selectedEvent,
        token,
        page,
        setPage,
        debouncedSearch: searchApi.debouncedSearch,
        searchType: searchApi.searchType,
        filters: filtersApi.filters,
        setSearchParams,
    });

    const hasActiveSearchOrFilters =
        Boolean(searchApi.debouncedSearch) || Object.keys(filtersApi.filters).length > 0;

    const clearSelection = useCallback(() => clearSelectionRef.current(), []);
    const getSelection = useCallback(() => getSelectionRef.current(), []);

    const whatsApp = useWhatsAppSend({
        token,
        selectedEvent,
        getSelection,
        debouncedSearch: searchApi.debouncedSearch,
        searchType: searchApi.searchType,
        filters: filtersApi.filters,
        clearSelection,
    });

    const eBadge = useEBadgeActions({
        selectedEvent,
        token,
        getSelection,
        debouncedSearch: searchApi.debouncedSearch,
        searchType: searchApi.searchType,
        filters: filtersApi.filters,
        total: list.total,
        clearSelection,
        setActiveTab,
    });

    const selection = useAttendeeSelection({
        attendees: list.attendees,
        total: list.total,
        hasActiveSearchOrFilters,
        clearActionMessages: () => {
            whatsApp.clearMessages();
            eBadge.clearError();
        },
    });

    clearSelectionRef.current = selection.clearSelection;
    getSelectionRef.current = () => ({
        selectionMode: selection.selectionMode,
        selectedAttendeeUuids: selection.selectedAttendeeUuids,
    });

    const scSync = useScBadgeSync({
        selectedEvent,
        token,
        setAttendees: list.setAttendees,
        setSelectedAttendee: list.setSelectedAttendee,
    });

    const jobsApi = useEBadgeJobs({ selectedEvent, token, activeTab });
    const previewAttendee = selection.selectedAttendees[0] || list.attendees[0] || null;

    if (!list.hasLoaded && list.loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary gap-4">
                <Loader2 className="animate-spin text-accent" size={32} />
                <p>Loading Attendees...</p>
            </div>
        );
    }

    return (
        <div className="w-full animate-fade-in">
            <AttendeesPageHeader
                total={list.total}
                activeTab={activeTab}
                onCreateClick={() => list.setIsCreateModalOpen(true)}
            />
            <AttendeesTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'list' ? (
                <AttendeesListView
                    page={page}
                    setPage={setPage}
                    searchApi={searchApi}
                    filtersApi={filtersApi}
                    list={list}
                    selection={selection}
                    whatsApp={whatsApp}
                    eBadge={eBadge}
                    scSync={scSync}
                    selectedEvent={selectedEvent}
                    hasActiveSearchOrFilters={hasActiveSearchOrFilters}
                />
            ) : (
                <EBadgeTasksPanel
                    jobs={jobsApi.jobs}
                    jobsLoading={jobsApi.jobsLoading}
                    jobsError={jobsApi.jobsError}
                    jobsTotal={jobsApi.jobsTotal}
                    jobsPage={jobsApi.jobsPage}
                    onPrevPage={() => {
                        const prev = jobsApi.jobsPage - 1;
                        jobsApi.setJobsPage(prev);
                        jobsApi.fetchJobs(prev);
                    }}
                    onNextPage={() => {
                        const next = jobsApi.jobsPage + 1;
                        jobsApi.setJobsPage(next);
                        jobsApi.fetchJobs(next);
                    }}
                />
            )}

            <AttendeesModals
                list={list}
                filtersApi={filtersApi}
                searchApi={searchApi}
                selection={selection}
                whatsApp={whatsApp}
                eBadge={eBadge}
                scSync={scSync}
                selectedEvent={selectedEvent}
                token={token}
                previewAttendee={previewAttendee}
                attendeeTypes={attendeeTypes}
                attendeeTypesLoading={attendeeTypesLoading}
            />
        </div>
    );
};

export default AttendeesPage;
