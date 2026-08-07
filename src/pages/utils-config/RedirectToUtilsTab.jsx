import { Navigate, useParams } from 'react-router-dom';

const RedirectToUtilsTab = ({ tab }) => {
    const { id } = useParams();
    return <Navigate to={`/event/${id}/utils-config?tab=${tab}`} replace />;
};

export default RedirectToUtilsTab;
