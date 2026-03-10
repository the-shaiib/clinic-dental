import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AnimatedBackground from './components/Background/AnimatedBackground';
import SiteLayout from './components/Layout/SiteLayout';
import AdminAccessPage from './pages/AdminAccess/AdminAccessPage';
import AboutRoutePage from './pages/About/AboutRoutePage';
import ContactPage from './pages/Contact/ContactPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LandingPage from './pages/Landing/LandingPage';
import SmileGalleryPage from './pages/SmileGallery/SmileGalleryPage';

function App() {
  return (
    <BrowserRouter>
      <AnimatedBackground />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutRoutePage />} />
          <Route path="/gallery" element={<SmileGalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="/admin-access" element={<AdminAccessPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
