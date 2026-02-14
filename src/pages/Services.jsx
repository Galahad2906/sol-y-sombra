import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { getImage, STATIC_IMAGES } from '../utils/image-util';
import SEO from '../components/seo/SEO';
import CurrencySection from '../components/services/CurrencySection';
// import FramingCalculator from '../components/calculator/FramingCalculator'; // Hiding for now as per request
import ContactSection from '../components/services/ContactSection';

const Services = () => {
    const { t } = useLanguage();

    return (
        <div className="animate-in fade-in duration-500">
            <SEO
                title="Servicios y Presupuesto"
                description="Cotice su enmarcado online. Calculadora de presupuestos para marcos a medida. Servicios de restauración y conservación de arte."
                keywords="presupuesto marcos, calculadora enmarcados, restauracion cuadros, precio marcos asuncion, vidrio antireflejo"
            />
            <div className="mb-8 flex items-center gap-4">
                <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-colors text-sys-black">
                    <ArrowLeft /> <span>{t('back')}</span>
                </Link>
                <h2 className="text-4xl font-serif font-bold">{t('nav_services')}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Info Section */}
                <div>
                    <img
                        src={getImage(STATIC_IMAGES.SERVICES_MAIN)}
                        alt="Servicios"
                        className="w-full h-64 object-cover mb-6 rounded-sm grayscale"
                    />
                    <h3 className="text-2xl font-serif font-bold mb-4">{t('services_framing_title')}</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        {t('services_framing_text')}
                    </p>

                    <h3 className="text-2xl font-serif font-bold mb-4">{t('services_restoration_title')}</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        {t('services_restoration_text')}
                    </p>
                </div>

                {/* Q&A / Contact Section */}
                <div className="h-fit top-24 sticky">
                    <ContactSection />
                </div>
            </div>

            {/* Currency Section */}
            <CurrencySection />
        </div>
    );
};

export default Services;
