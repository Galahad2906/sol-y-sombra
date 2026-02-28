import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/seo/SEO';
// Optionally can import some icons if needed, but text is the main thing here.

const About = () => {
    const { t } = useLanguage();

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-700">
            <SEO
                title="Nosotros"
                description="Conozca la historia de Sol y Sombra, líderes en enmarcados y conservación de arte en Paraguay desde hace décadas."
                keywords="historia sol y sombra, enmarcadores paraguay, trayectoria arte, conservacion de cuadros"
            />
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-4xl md:text-5xl text-sys-black mb-12 text-center tracking-wide">
                    {t('about_title')}
                </h1>

                <div className="bg-white p-10 md:p-16 shadow-sm border border-gray-100 rounded-sm space-y-8">
                    <p className="text-xl text-sys-gray leading-loose font-light">
                        {t('about_history')}
                    </p>
                    <hr className="border-gray-100 my-8" />
                    <p className="text-xl text-sys-gray leading-loose font-light">
                        {t('about_evolution')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
