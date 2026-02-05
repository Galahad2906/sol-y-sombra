import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Home as HomeIcon, Grid3X3, Grid2X2, Image as ImageIcon, Calculator } from 'lucide-react';
import SEO from '../components/seo/SEO';

const Landing = () => {
    const { t } = useLanguage();

    return (
        <div className="h-auto md:h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
            <SEO
                title="Bienvenido"
                description="Sol y Sombra - Arte y Enmarcados en Asunción. Encuentra el marco perfecto para tus obras."
                keywords="enmarcados, cuadros, asuncion, paraguay, arte, molduras"
            />
            <div className="flex flex-col md:flex-row w-full flex-grow gap-0 md:gap-0 shadow-xl rounded-sm overflow-hidden border border-gray-200">

                {/* Inicio (Real Home) */}
                <Link to="/inicio" className="group relative flex-1 bg-gray-100 hover:bg-gray-50 flex flex-row md:flex-col items-center justify-start md:justify-start md:pt-36 p-6 border-b md:border-b-0 md:border-r border-white/20 transition-all duration-300">
                    <HomeIcon className="w-8 h-8 md:w-10 md:h-10 mb-0 md:mb-4 mr-4 md:mr-0 text-gray-400 group-hover:text-black transition-colors" />
                    <div className="flex flex-col items-start md:items-center">
                        <h2 className="text-2xl font-serif font-bold md:writing-vertical-upright md:my-4 tracking-widest uppercase text-black">
                            {t('nav_home')}
                        </h2>
                        <p className="text-sm text-gray-500 md:hidden mt-1">{t('desc_home')}</p>
                    </div>
                </Link>



                {/* Molduras */}
                <Link to="/molduras" className="group relative flex-1 bg-gray-200 hover:bg-gray-100 flex flex-row md:flex-col items-center justify-start md:justify-start md:pt-36 p-6 border-b md:border-b-0 md:border-r border-white/20 transition-all duration-300">
                    <Grid2X2 className="w-8 h-8 md:w-10 md:h-10 mb-0 md:mb-4 mr-4 md:mr-0 text-gray-500 group-hover:text-black transition-colors" />
                    <div className="flex flex-col items-start md:items-center">
                        <h2 className="text-2xl font-serif font-bold md:writing-vertical-upright md:my-4 tracking-widest uppercase text-black">
                            {t('nav_molduras')}
                        </h2>
                        <p className="text-sm text-gray-600 md:hidden mt-1">{t('desc_molduras')}</p>
                    </div>
                </Link>

                {/* Catalogo */}
                <Link to="/catalogo" className="group relative flex-1 bg-gray-300 hover:bg-gray-200 flex flex-row md:flex-col items-center justify-start md:justify-start md:pt-36 p-6 border-b md:border-b-0 md:border-r border-white/20 transition-all duration-300">
                    <Grid3X3 className="w-8 h-8 md:w-10 md:h-10 mb-0 md:mb-4 mr-4 md:mr-0 text-gray-600 group-hover:text-black transition-colors" />
                    <div className="flex flex-col items-start md:items-center">
                        <h2 className="text-2xl font-serif font-bold md:writing-vertical-upright md:my-4 tracking-widest uppercase text-black">
                            {t('nav_catalog')}
                        </h2>
                        <p className="text-sm text-gray-700 md:hidden mt-1">{t('desc_catalog')}</p>
                    </div>
                </Link>

                {/* Galeria */}
                <Link to="/galeria" className="group relative flex-1 bg-gray-400 hover:bg-gray-300 flex flex-row md:flex-col items-center justify-start md:justify-start md:pt-36 p-6 border-b md:border-b-0 md:border-r border-white/20 transition-all duration-300">
                    <ImageIcon className="w-8 h-8 md:w-10 md:h-10 mb-0 md:mb-4 mr-4 md:mr-0 text-gray-700 group-hover:text-black transition-colors" />
                    <div className="flex flex-col items-start md:items-center">
                        <h2 className="text-2xl font-serif font-bold md:writing-vertical-upright md:my-4 tracking-widest uppercase text-black">
                            {t('nav_gallery')}
                        </h2>
                        <p className="text-sm text-gray-800 md:hidden mt-1">{t('desc_gallery')}</p>
                    </div>
                </Link>

                {/* Servicios */}
                <Link to="/servicios" className="group relative flex-1 bg-gray-500 hover:bg-gray-400 flex flex-row md:flex-col items-center justify-start md:justify-start md:pt-36 p-6 transition-all duration-300">
                    <Calculator className="w-8 h-8 md:w-10 md:h-10 mb-0 md:mb-4 mr-4 md:mr-0 text-white group-hover:text-black transition-colors" />
                    <div className="flex flex-col items-start md:items-center">
                        <h2 className="text-2xl font-serif font-bold md:writing-vertical-upright md:my-4 tracking-widest uppercase text-white group-hover:text-black transition-colors">
                            {t('nav_services')}
                        </h2>
                        <p className="text-sm text-gray-100 md:hidden mt-1">{t('desc_services')}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Landing;
