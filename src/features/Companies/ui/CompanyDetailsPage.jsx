import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { eventService } from '../../../services/eventService';
import { useExhibitorOverview } from '../hooks/useExhibitorOverview';
import CompanyDetailsHeader from './CompanyDetailsHeader';
import CompanyDetailsInfoGrid from './CompanyDetailsInfoGrid';
import CompanyDetailsLowerSection from './CompanyDetailsLowerSection';
import CompanyStallDetailsCard from './CompanyStallDetailsCard';
import SetupProgressSection from './SetupProgressSection';

/**
 * Company Detail page. Overview/Badge/Contact/System stay on company detail API.
 * Setup Progress loads Overview API in parallel (soft-fail).
 */
export default function CompanyDetailsPage() {
  const { selectedEvent, token } = useAuth();
  const { companyId } = useParams();
  const navigate = useNavigate();
  const eventId = selectedEvent?.id;

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailTab, setDetailTab] = useState('co-exhibitors');
  const [setupExpanded, setSetupExpanded] = useState(false);

  // Parallel with company detail — does not block cards
  const {
    overview,
    loading: overviewLoading,
    error: overviewError,
    reload: reloadOverview,
  } = useExhibitorOverview({ eventId, companyId, token });

  const checklistVisible = overview?.setup_checklist?.visible === true;

  const openSetup = () => {
    setSetupExpanded(true);
    requestAnimationFrame(() => {
      document.getElementById('company-exhibitor-portal-checklist')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  useEffect(() => {
    if (!eventId || !companyId || !token) return undefined;

    let active = true;
    setLoading(true);
    setError(null);

    eventService
      .getCompanyDetails(eventId, companyId, token)
      .then((data) => {
        if (active) setCompany(data);
      })
      .catch((err) => {
        if (active) {
          setError('Failed to load company details.');
          console.error(err);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [eventId, companyId, token]);

  useEffect(() => {
    setDetailTab('co-exhibitors');
    setSetupExpanded(false);
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary gap-4">
        <Loader2 className="animate-spin text-accent" size={32} />
        <p>Loading Company Details...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="text-center p-12 text-text-secondary">
        <p className="mb-4">{error || 'Company not found.'}</p>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const parentExhibitor = company.parent_exhibitor;
  const isCoExhibitor = Boolean(
    parentExhibitor?.id
    || company.parent_exhibitor_id
    || (typeof parentExhibitor === 'number' && parentExhibitor)
  );

  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in">
      <CompanyDetailsHeader
        company={company}
        eventId={eventId}
        companyId={companyId}
        showSetupAction={checklistVisible}
        onOpenSetup={openSetup}
      />

      <div className="mb-4">
        <SetupProgressSection
          eventId={eventId}
          companyId={companyId}
          token={token}
          overview={overview}
          loading={overviewLoading}
          error={overviewError}
          onReload={reloadOverview}
          expanded={setupExpanded}
          onExpandedChange={setSetupExpanded}
        />
      </div>

      <CompanyDetailsInfoGrid company={company} eventId={eventId} />

      <CompanyStallDetailsCard company={company} />

      <CompanyDetailsLowerSection
        company={company}
        eventId={eventId}
        companyId={companyId}
        token={token}
        detailTab={detailTab}
        setDetailTab={setDetailTab}
        isCoExhibitor={isCoExhibitor}
      />
    </div>
  );
}
