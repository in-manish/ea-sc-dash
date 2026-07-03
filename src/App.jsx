import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import LoginLocal from './pages/LoginLocal';
import ProtectedRoute from './components/ProtectedRoute';

// EA Mode Components
import HomeLayoutEA from './layouts/HomeLayout';
import EventLayoutEA from './layouts/EventLayout';
import DashboardEA from './pages/Dashboard';

// SC Mode Components
import HomeLayoutSC from './sc/layouts/HomeLayout';
import EventLayoutSC from './sc/layouts/EventLayout';
import UsersSearch from './sc/pages/UsersSearch';
import CeleryBeat from './sc/pages/CeleryBeat';
import UserSyncTrack from './sc/pages/UserSyncTrack';

// Shared Pages
import Attendees from './pages/Attendees';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import Agenda from './pages/event-agenda';
import Settings from './pages/Settings';
import Communication from './pages/Communication';
import Reports from './pages/Reports';
import AttendeeTypes from './pages/AttendeeTypes';
import UserManagement from './pages/UserManagement';
import Payments from './pages/payments/Payments';
import ExhibitorPortalSetup from './pages/exhibitor-portal-setup/ExhibitorPortalSetup';
import Matchmaking from './features/Matchmaking/ui/Matchmaking';
import CeleryManage from './pages/celery-manage/CeleryManage';
import EmailKillSwitch from './pages/email-kill-switch/EmailKillSwitch';
import Meetings from './pages/meetings/Meetings';

const App = () => {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
  
  // Resolve dashboard mode synchronously from sessionStorage
  const currentMode = sessionStorage.getItem('dashboard_mode') || 'EA';
  
  // Select components based on active mode
  const HomeLayout = currentMode === 'SC' ? HomeLayoutSC : HomeLayoutEA;
  const EventLayout = currentMode === 'SC' ? EventLayoutSC : EventLayoutEA;
  const Dashboard = currentMode === 'SC' ? UsersSearch : DashboardEA;

  return (
    <AuthProvider>
      <Router basename={basename}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login-local" element={<LoginLocal />} />

          {/* Home Layout (Event Selection) */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users/sync-track" element={<UserSyncTrack />} />
            <Route path="celery-beat" element={<CeleryBeat />} />
          </Route>

          {/* Event Layout (Specific Event Context) */}
          <Route path="/event/:id" element={
            <ProtectedRoute>
              <EventLayout />
            </ProtectedRoute>
          }>
            <Route path="attendees" element={<Attendees />} />
            <Route path="users" element={<UsersSearch />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/:companyId" element={<CompanyDetails />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="communication" element={<Communication />} />
            <Route path="reports" element={<Reports />} />
            <Route path="attendee-types" element={<AttendeeTypes />} />
            <Route path="staff" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="payments" element={<Payments />} />
            <Route path="exhibitor-portal-setup" element={<ExhibitorPortalSetup />} />
            <Route path="matchmaking" element={<Matchmaking />} />
            <Route path="celery-manage" element={<CeleryManage />} />
            <Route path="email-kill-switch" element={<EmailKillSwitch />} />
            <Route path="meetings" element={<Meetings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

