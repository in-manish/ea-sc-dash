import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { PERMISSION_FOCUS_PARAM } from '../../Attendees/domain/attendeePermissionLink';
import { SCAN_LOCATION_TAB } from '../domain/scanLocationTab';
import { activeScanPanel } from '../domain/scanLocationPanels';
import PermissionCodesPanel from './PermissionCodesPanel';
import PermissionMetricsPanel from './PermissionMetricsPanel';
import ServiceMappingPanel from './ServiceMappingPanel';
import ScanLocationPurpose from './ScanLocationPurpose';
import ScanLocationSubTabs from './ScanLocationSubTabs';
import ScanLocationsPanel from './ScanLocationsPanel';

export default function ScanLocationsPage() {
  const { id: eventId } = useParams();
  const { token, user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const panel = activeScanPanel(searchParams.get('panel'));

  const setPanel = (id) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', SCAN_LOCATION_TAB);
    params.set('panel', id);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-10">
      <p className="text-sm text-text-secondary m-0">
        Choose which badges can pass each scan point.
      </p>
      <ScanLocationSubTabs panel={panel} onChange={setPanel} />
      <ScanLocationPurpose panel={panel} />
      {panel === 'service' ? (
        <ServiceMappingPanel key={eventId} eventId={eventId} token={token} onUnauthorized={logout} />
      ) : panel === 'metrics' ? (
        <PermissionMetricsPanel eventId={eventId} token={token} onUnauthorized={logout} />
      ) : panel === 'codes' ? (
        <PermissionCodesPanel
          eventId={eventId}
          token={token}
          user={user}
          focusId={searchParams.get(PERMISSION_FOCUS_PARAM)}
          onUnauthorized={logout}
        />
      ) : (
        <ScanLocationsPanel eventId={eventId} token={token} onUnauthorized={logout} />
      )}
    </div>
  );
}
