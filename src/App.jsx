import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import { Analytics } from '@vercel/analytics/react';
import LoadingScreen from './components/ui/LoadingScreen';
import ScrollToTop from './components/ui/ScrollToTop';
import SmoothScroll from './components/ui/SmoothScroll';
import NoiseOverlay from './components/ui/NoiseOverlay';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Landing = lazy(() => import('./pages/Landing'));
const About = lazy(() => import('./pages/About'));
const Molduras = lazy(() => import('./pages/Molduras'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Services = lazy(() => import('./pages/Services'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
      <SmoothScroll />
      <NoiseOverlay />
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/inicio" element={<Home />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/molduras" element={<Molduras />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/servicios" element={<Services />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Analytics />
      </Layout>
    </HelmetProvider>
  )
}

export default App
