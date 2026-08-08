import { useState, useEffect, useRef, useCallback } from 'react';
import { eventService } from '../../../services/eventService';
import { isUnderTwoHours, getJobPollDelay } from '../domain/jobTiming';

export default function useEBadgeJobs({ selectedEvent, token, activeTab }) {
    const [jobs, setJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [jobsTotal, setJobsTotal] = useState(0);
    const [jobsPage, setJobsPage] = useState(1);
    const [jobsError, setJobsError] = useState('');
    const pollCountsRef = useRef({});

    const fetchJobs = useCallback(
        async (targetPage = jobsPage) => {
            if (!selectedEvent || !token) return;
            setJobsLoading(true);
            setJobsError('');
            try {
                const data = await eventService.getEBadgeJobs(selectedEvent.id, token, {
                    page: targetPage,
                    size: 20,
                });
                setJobs(data.results || []);
                setJobsTotal(data.total || 0);
                setJobsPage(data.page || 1);
            } catch (err) {
                setJobsError(err.message || 'Failed to load e-badge tasks.');
            } finally {
                setJobsLoading(false);
            }
        },
        [selectedEvent, token, jobsPage]
    );

    useEffect(() => {
        if (activeTab === 'tasks') {
            fetchJobs(1);
        }
    }, [activeTab, selectedEvent]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!selectedEvent || !token || jobs.length === 0) return;

        const inProgressJobs = jobs.filter(
            (job) => job.status === 'in_progress' && isUnderTwoHours(job.created_at)
        );

        if (inProgressJobs.length === 0) return;

        const activeTimeouts = [];

        inProgressJobs.forEach((job) => {
            const uuid = job.progress_uuid;
            if (pollCountsRef.current[uuid] === undefined) {
                pollCountsRef.current[uuid] = 0;
            }

            const currentCount = pollCountsRef.current[uuid];
            const delay = getJobPollDelay(currentCount);

            const runPoll = async () => {
                try {
                    const progress = await eventService.getEBadgeProgress(
                        selectedEvent.id,
                        uuid,
                        token
                    );

                    pollCountsRef.current[uuid] = currentCount + 1;

                    setJobs((prevJobs) =>
                        prevJobs.map((j) =>
                            j.progress_uuid === uuid ? { ...j, ...progress } : j
                        )
                    );
                } catch (e) {
                    console.error('Error polling job:', uuid, e);
                }
            };

            const timeoutId = setTimeout(runPoll, delay);
            activeTimeouts.push(timeoutId);
        });

        return () => {
            activeTimeouts.forEach((id) => clearTimeout(id));
        };
    }, [jobs, selectedEvent, token]);

    return {
        jobs,
        jobsLoading,
        jobsTotal,
        jobsPage,
        jobsError,
        fetchJobs,
        setJobsPage,
    };
}
