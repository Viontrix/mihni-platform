import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import NotFoundPage from './pages/NotFound.tsx'

// Tool Picker & Smart Tools
import StartPage from './pages/start/Index.tsx'
import ToolPage from './pages/tools/ToolPage.tsx'
import AccountPage from './pages/AccountPage.tsx'

// Templates
import TemplatesPage from './pages/templates/Index.tsx'
import TemplatePage from './pages/templates/TemplatePage.tsx'

// Other Pages
import SupportPage from './pages/Support.tsx'
import PaymentPage from './pages/payment/Index.tsx'
import DashboardPage from './pages/dashboard/Index.tsx'
import AdminPage from './pages/admin/Index.tsx'

import { ROUTES, getSectionFromSearch, getHomeSectionUrl } from '@/lib/routes'
import { ThemeProvider } from '@/contexts/ThemeContext'

/**
 * ScrollToSection Component
 * Handles scrolling to sections based on query params
 */
function ScrollToSection() {
  const location = useLocation();
  
  useEffect(() => {
    const section = getSectionFromSearch(location.search);
    if (section && location.pathname === '/') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (section === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    }
  }, [location]);
  
  return null;
}

/**
 * HomeWrapper Component
 * Wraps the App component with scroll handling
 */
function HomeWrapper() {
  return (
    <>
      <ScrollToSection />
      <App />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <Toaster position="top-center" richColors />
        <Routes>
        {/* Home Route with section query param support */}
        <Route path={ROUTES.HOME} element={<HomeWrapper />} />
        
        {/* Auth Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        
        {/* Templates Routes */}
        <Route path={ROUTES.TEMPLATES} element={<TemplatesPage />} />
        <Route path={ROUTES.TEMPLATE_DETAIL} element={<TemplatePage />} />
        
        {/* Tool Routes - Dynamic route only */}
        <Route path={ROUTES.START} element={<StartPage />} />
        <Route path={ROUTES.TOOL_DETAIL} element={<ToolPage />} />
        
        {/* Legacy /tools redirect */}
        <Route 
          path="/tools" 
          element={<Navigate to={ROUTES.START} replace />} 
        />
        
        {/* Legacy Tool Routes - Redirect broken slugs to /start */}
        <Route path="/tools/certificate-maker" element={<Navigate to={ROUTES.START} replace />} />
        <Route path="/tools/schedule-builder" element={<Navigate to={ROUTES.START} replace />} />
        <Route path="/tools/report-generator" element={<Navigate to={ROUTES.START} replace />} />
        <Route path="/tools/performance-analyzer" element={<Navigate to={ROUTES.START} replace />} />
        <Route path="/tools/survey-builder" element={<Navigate to={ROUTES.START} replace />} />
        
        {/* User Account Routes */}
        <Route path={ROUTES.ACCOUNT} element={<AccountPage />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        
        {/* Admin Route */}
        <Route path={ROUTES.ADMIN} element={<AdminPage />} />
        
        {/* Support Route */}
        <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
        
        {/* Payment Route */}
        <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
        
        {/* Legacy Pricing redirect - redirects to home with section param */}
        <Route 
          path="/pricing" 
          element={<Navigate to={getHomeSectionUrl('pricing')} replace />} 
        />
        
        {/* Not Found Route */}
        <Route path="/notfound" element={<NotFoundPage />} />
        
        {/* Catch all - show NotFound page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
)
