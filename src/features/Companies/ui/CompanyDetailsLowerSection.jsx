import { Users, Handshake } from 'lucide-react';
import ExhibitorMatchmakingSection from '../../Matchmaking/ui/ExhibitorMatchmakingSection';
import CoExhibitorsList from '../../../components/companies/CoExhibitorsList';
import CreateCompanyButton from './CreateCompanyButton';

export default function CompanyDetailsLowerSection({
  company,
  eventId,
  companyId,
  token,
  detailTab,
  setDetailTab,
  isCoExhibitor,
}) {
  if (isCoExhibitor) {
    return (
      <div className="mt-4">
        <ExhibitorMatchmakingSection
          eventId={eventId}
          companyId={companyId}
          token={token}
        />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center gap-1 p-1 bg-bg-secondary border border-border rounded-lg inline-flex">
        <TabButton
          active={detailTab === 'co-exhibitors'}
          onClick={() => setDetailTab('co-exhibitors')}
          icon={<Users size={16} />}
          label="Co-exhibitors"
        />
        <TabButton
          active={detailTab === 'matchmaking'}
          onClick={() => setDetailTab('matchmaking')}
          icon={<Handshake size={16} />}
          label="Exhibitor Portal Matchmaking"
        />
      </div>

      {detailTab === 'co-exhibitors' ? (
        <CoExhibitorsList
          eventId={eventId}
          parentExhibitorId={companyId}
          token={token}
          headerAction={
            <CreateCompanyButton
              eventId={eventId}
              label="Add co-exhibitor"
              className="btn btn-secondary btn-sm"
              initialParent={{
                id: companyId,
                company_name: company.company_name,
                obf_number: company.obf_number,
              }}
            />
          }
        />
      ) : (
        <ExhibitorMatchmakingSection
          eventId={eventId}
          companyId={companyId}
          token={token}
        />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
        active
          ? 'bg-white text-accent shadow-sm'
          : 'text-text-secondary hover:text-text-primary'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
