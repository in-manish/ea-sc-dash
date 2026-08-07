import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import Login from './pages/Login';
import LoginLocal from './pages/LoginLocal';
import HomeLayout from './layouts/HomeLayout';
import EventLayout from './layouts/EventLayout';
import Dashboard from './pages/Dashboard';
import Attendees from './pages/Attendees';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import Agenda from './pages/event-agenda';
import AgendaEdit from './pages/event-agenda/AgendaEdit';
import Settings from './pages/Settings';
import Communication from './pages/Communication';
import Reports from './pages/Reports';
import AttendeeTypes from './pages/AttendeeTypes';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import Payments from './pages/payments/Payments';
import Matchmaking from './features/Matchmaking/ui/Matchmaking';
import Meetings from './pages/meetings/Meetings';
import UtilsConfig from './pages/utils-config/UtilsConfig';
import RedirectToUtilsTab from './pages/utils-config/RedirectToUtilsTab';
import BrandManage from './pages/brand-manage/BrandManage';
import ManageUsers from './pages/ManageUsers';
import ExhibitorPortalLanding from './pages/exhibitor-portal/ExhibitorPortalLanding';



const App = () => {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

  return (
    <AuthProvider>
      <AlertProvider>
        <Router basename={basename}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login-local" element={<LoginLocal />} />
          <Route path="/exhibitor-portal" element={<ExhibitorPortalLanding />} />

          {/* Home Layout (Event Selection) */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
          </Route>

          {/* Event Layout (Specific Event Context) */}
          <Route path="/event/:id" element={
            <ProtectedRoute>
              <EventLayout />
            </ProtectedRoute>
          }>
            <Route path="attendees" element={<Attendees />} />
            <Route path="companies" element={<Companies />} />
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
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
};

export default App;
