import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import { Analytics } from '@vercel/analytics/react';
import LoadingScreen from './components/ui/LoadingScreen';
import ScrollToTop from './components/ui/ScrollToTop';
import SmoothScroll from './components/ui/SmoothScroll';
import NoiseOverlay from './components/ui/NoiseOverlay';

// ERP Contexts & Layout
import { ErpAuthProvider } from './erp/context/ErpAuthContext';
import { ErpDataProvider } from './erp/context/ErpDataContext';
import ErpLayout from './erp/layout/ErpLayout';
import ErpProtectedRoute from './erp/components/ErpProtectedRoute';

// Lazy load public website pages
const Home = lazy(() => import('./pages/Home'));
const Landing = lazy(() => import('./pages/Landing'));
const About = lazy(() => import('./pages/About'));
const Molduras = lazy(() => import('./pages/Molduras'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Services = lazy(() => import('./pages/Services'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));

// Lazy load private ERP pages
const ErpLogin = lazy(() => import('./erp/pages/ErpLogin'));
const ErpDashboard = lazy(() => import('./erp/pages/ErpDashboard'));
const ErpTrello = lazy(() => import('./erp/pages/ErpTrello'));
const ErpOrders = lazy(() => import('./erp/pages/ErpOrders'));
const ErpCustomers = lazy(() => import('./erp/pages/ErpCustomers'));
const ErpInventory = lazy(() => import('./erp/pages/ErpInventory'));
const ErpFinances = lazy(() => import('./erp/pages/ErpFinances'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fast simulated delay to show the animation briefly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <HelmetProvider>
      <ErpAuthProvider>
        <ErpDataProvider>
          <SmoothScroll />
          <NoiseOverlay />
          <ScrollToTop />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Private ERP Routes - Completely separated from public layout & navigation */}
              <Route path="/erp/login" element={<ErpLogin />} />
              <Route path="/admin" element={<Navigate to="/erp/login" replace />} />
              <Route path="/erp" element={<Navigate to="/erp/dashboard" replace />} />

              <Route
                path="/erp/*"
                element={
                  <ErpProtectedRoute>
                    <ErpLayout>
                      <Routes>
                        <Route path="dashboard" element={<ErpDashboard />} />
                        <Route path="trello" element={<ErpTrello />} />
                        <Route path="pedidos" element={<ErpOrders />} />
                        <Route path="clientes" element={<ErpCustomers />} />
                        <Route path="inventario" element={<ErpInventory />} />
                        <Route path="caja" element={<ErpFinances />} />
                        <Route path="*" element={<Navigate to="/erp/dashboard" replace />} />
                      </Routes>
                    </ErpLayout>
                  </ErpProtectedRoute>
                }
              />

              {/* Public Website Routes - wrapped in standard public Layout */}
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/inicio" element={<Home />} />
                      <Route path="/nosotros" element={<About />} />
                      <Route path="/molduras" element={<Molduras />} />
                      <Route path="/catalogo" element={<Catalog />} />
                      <Route path="/galeria" element={<Gallery />} />
                      <Route path="/servicios" element={<Services />} />
                      <Route path="/cotizador" element={<CalculatorPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Analytics />
                  </Layout>
                }
              />
            </Routes>
          </Suspense>
        </ErpDataProvider>
      </ErpAuthProvider>
    </HelmetProvider>
  );
}

export default App;
