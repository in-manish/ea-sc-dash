import React, { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import Login from './pages/Login';
import LoginLocal from './pages/LoginLocal';
import ProtectedRoute from './components/ProtectedRoute';

import HomeLayoutEA from './layouts/HomeLayout';
import EventLayoutEA from './layouts/EventLayout';
import DashboardEA from './pages/Dashboard';

import HomeLayoutSC from './sc/layouts/HomeLayout';
import EventLayoutSC from './sc/layouts/EventLayout';
import UsersSearch from './sc/pages/UsersSearch';
import ManageUsersSC from './sc/pages/ManageUsers';
import UserDetailsSC from './sc/pages/UserDetails';
import CeleryBeat from './sc/pages/CeleryBeat';
import UserSyncTrack from './sc/pages/UserSyncTrack';
import ProfileSC from './sc/pages/Profile';
import ScAdminGate from './features/ScAuth/ui/ScAdminGate';

import Attendees from './pages/Attendees';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import CreateCompany from './pages/CreateCompany';
import EditCompany from './pages/EditCompany';
import Agenda from './pages/event-agenda';
import AgendaEdit from './pages/event-agenda/AgendaEdit';
import Settings from './pages/Settings';
import Communication from './pages/Communication';
import Reports from './pages/Reports';
import AttendeeTypes from './pages/AttendeeTypes';
import UserManagement from './pages/UserManagement';
import Payments from './pages/payments/Payments';
import Matchmaking from './features/Matchmaking/ui/Matchmaking';
import Meetings from './pages/meetings/Meetings';
import UtilsConfig from './pages/utils-config/UtilsConfig';
import RedirectToUtilsTab from './pages/utils-config/RedirectToUtilsTab';
import BrandManage from './pages/brand-manage/BrandManage';
import ManageUsers from './pages/ManageUsers';
import ExhibitorPortalLanding from './pages/exhibitor-portal/ExhibitorPortalLanding';

import { getDashboardMode } from './config';
import {
  getProjectFromPathname,
  getRouterBasename,
  buildProjectRedirectUrl,
} from './projectPath';

const AppRoutes = ({ currentMode }) => {
  const HomeLayout = currentMode === 'SC' ? HomeLayoutSC : HomeLayoutEA;
  const EventLayout = currentMode === 'SC' ? EventLayoutSC : EventLayoutEA;
  const Dashboard = currentMode === 'SC'
    ? <Navigate to="/users/manage" replace />
    : <DashboardEA />;

  const homeShell = currentMode === 'SC'
    ? (
      <ProtectedRoute>
        <ScAdminGate>
          <HomeLayout />
        </ScAdminGate>
      </ProtectedRoute>
    )
    : (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login-local" element={<LoginLocal />} />
      <Route path="/exhibitor-portal" element={<ExhibitorPortalLanding />} />

      <Route path="/" element={homeShell}>
        <Route index element={Dashboard} />
        {currentMode === 'SC' ? <Route path="profile" element={<ProfileSC />} /> : null}
        <Route path="users/manage" element={<ManageUsersSC />} />
        <Route path="users/manage/:userId" element={<UserDetailsSC />} />
        <Route path="users/sync-track" element={<UserSyncTrack />} />
        <Route path="celery-beat" element={<CeleryBeat />} />
      </Route>

      <Route path="/event/:id" element={<ProtectedRoute><EventLayout /></ProtectedRoute>}>
        <Route path="attendees" element={<Attendees />} />
        <Route path="users" element={<UsersSearch />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/new" element={<CreateCompany />} />
        <Route path="companies/:companyId/edit" element={<EditCompany />} />
        <Route path="companies/:companyId" element={<CompanyDetails />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="agenda/new" element={<AgendaEdit />} />
        <Route path="agenda/:agendaId/edit" element={<AgendaEdit />} />
        <Route path="communication" element={<Communication />} />
        <Route path="reports" element={<Reports />} />
        <Route path="attendee-types" element={<AttendeeTypes />} />
        <Route path="staff" element={<UserManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="utils-config" element={<UtilsConfig />} />
        <Route path="exhibitor-portal-setup" element={<RedirectToUtilsTab tab="exhibitor_portal" />} />
        <Route path="matchmaking" element={<Matchmaking />} />
        <Route path="celery-manage" element={<RedirectToUtilsTab tab="celery" />} />
        <Route path="email-kill-switch" element={<RedirectToUtilsTab tab="email_kill_switch" />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="exhibitor-certificate" element={<RedirectToUtilsTab tab="exhibitor_certificate" />} />
        <Route path="brand-manage" element={<BrandManage />} />
        <Route path="manage-users" element={<ManageUsers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  const pathProject = getProjectFromPathname();

  useLayoutEffect(() => {
    if (!pathProject) {
      window.location.replace(buildProjectRedirectUrl(getDashboardMode()));
    }
  }, [pathProject]);

  if (!pathProject) return null;

  const basename = getRouterBasename(pathProject);

  return (
    <AuthProvider>
      <AlertProvider>
        <Router basename={basename} key={basename}>
          <AppRoutes currentMode={pathProject} />
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
};

export default App;
