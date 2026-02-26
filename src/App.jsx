import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import HomeLayout from './layouts/HomeLayout';
import EventLayout from './layouts/EventLayout';
import Dashboard from './pages/Dashboard';
import Attendees from './pages/Attendees';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import Agenda from './pages/Agenda';
import Settings from './pages/Settings';
import Communication from './pages/Communication';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

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
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
