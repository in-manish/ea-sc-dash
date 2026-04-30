import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import LoginLocal from './pages/LoginLocal';
import HomeLayout from './layouts/HomeLayout';
import EventLayout from './layouts/EventLayout';
import Dashboard from './pages/Dashboard';
import Attendees from './pages/Attendees';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import Agenda from './pages/event-agenda';
import Settings from './pages/Settings';
import Communication from './pages/Communication';
import Reports from './pages/Reports';
import AttendeeTypes from './pages/AttendeeTypes';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import Payments from './pages/payments/Payments';
import ExhibitorPortalSetup from './pages/exhibitor-portal-setup/ExhibitorPortalSetup';
import Matchmaking from './features/Matchmaking/ui/Matchmaking';
import CeleryManage from './pages/celery-manage/CeleryManage';


const App = () => {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

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
            <Route path="communication" element={<Communication />} />
            <Route path="reports" element={<Reports />} />
            <Route path="attendee-types" element={<AttendeeTypes />} />
            <Route path="staff" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="payments" element={<Payments />} />
            <Route path="exhibitor-portal-setup" element={<ExhibitorPortalSetup />} />
            <Route path="matchmaking" element={<Matchmaking />} />
            <Route path="celery-manage" element={<CeleryManage />} />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
