import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import NotFoundPage from './pages/NotFound.tsx'
import ComingSoon from './pages/ComingSoon'

// Tools / Templates
import ToolPage from './pages/tools/ToolPage.tsx'
import TemplatesPage from './pages/TemplatesPage.tsx'
import TemplatePage from './pages/templates/TemplatePage.tsx'


function ScrollToTop() {
  const { pathname, hash, search } = useLocation()

  useEffect(() => {
    // When navigating between routes, ensure we start at top.
    // For in-page anchors, let the browser handle the scroll.
    if (!hash) window.scrollTo(0, 0)

    // Support home section deep-links like "/?section=tools"
    const params = new URLSearchParams(search)
    const section = params.get('section')
    if (section) {
      // let the page render first
      setTimeout(() => {
        const el = document.getElementById(section)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [pathname, hash, search])

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
<<<<<<< Updated upstream
      <ScrollToTop />
      <Routes>
        {/* Landing */}
        <Route path="/" element={<App />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* Libraries */}
        <Route path="/tools" element={<Navigate to="/?section=tools" replace />} />        <Route path="/tools/:slug" element={<ToolPage />} />

        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:slug" element={<TemplatePage />} />

        {/* Tool editor */}
        <Route path="/editor/:toolId" element={<ToolEditorPage />} />

        {/* Legacy redirects (old links) */}
        <Route path="/start" element={<Navigate to="/tools" replace />} />
        <Route path="/tool/:slug" element={<Navigate to="/tools" replace />} />
        <Route path="/template/:slug" element={<Navigate to="/templates" replace />} />
        <Route path="/templates/:slug/*" element={<Navigate to="/templates" replace />} />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/coming-soon/:kind/:slug?" element={<ComingSoon />} />
=======
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
>>>>>>> Stashed changes
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </HashRouter>
  </StrictMode>,
)
