import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/seo/SEO';
// Optionally can import some icons if needed, but text is the main thing here.

const About = () => {
    const { t } = useLanguage();

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-700">
            <SEO
                title="Nosotros"
                description="Conozca la historia de Sol y Sombra, líderes en enmarcados y conservación de arte en Paraguay desde hace décadas."
                keywords="historia sol y sombra, enmarcadores paraguay, trayectoria arte, conservacion de cuadros"
            />
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-3xl md:text-4xl text-black mb-6 text-center">
                    {t('about_title')}
                </h1>

                <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed font-light">
                        {t('about_history')}
                    </p>
                    <hr className="border-gray-100 my-6" />
                    <p className="text-lg text-gray-700 leading-relaxed font-light">
                        {t('about_evolution')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
