import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { SCAN_LOCATION_TAB } from '../features/ScanLocations/domain/scanLocationTab';
import UserManagement from './UserManagement';

/** Old staff and utils URLs now live on Event Settings. */
export default function StaffPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  if (searchParams.get('tab') === SCAN_LOCATION_TAB) {
    return <Navigate to={`/event/${id}/settings?${searchParams.toString()}`} replace />;
  }
  return <UserManagement />;
}
