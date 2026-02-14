import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/seo/SEO';
import { motion } from 'framer-motion';

const Home = () => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col items-center w-full">
            <SEO
                title="Inicio"
                description="Sol y Sombra: Enmarcados de alta calidad y galería de arte en Asunción, Paraguay. Restauración y molduras exclusivas."
                keywords="enmarcados asuncion, cuadros paraguay, arte paraguay, galeria de arte, molduras, restauracion de obras"
            />
            <div className="max-w-5xl mx-auto w-full">
                {/* Optional Back Button */}
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {t('back') || 'Back'}
                </Link>

                {/* Frame Container - Classic Gallery Style */}
                {/* Outer Black Wooden Frame */}
                <motion.div
                    className="bg-sys-black p-4 md:p-6 shadow-2xl relative rounded-sm"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Inner White Mat (Passepartout) */}
                    <div className="bg-white p-8 md:p-16 lg:p-24 relative shadow-inner">
                        {/* Thin Inner Border (Bevel/Detail) */}
                        <div className="absolute inset-4 md:inset-6 border border-gray-300 pointer-events-none"></div>
                        <div className="absolute inset-[18px] md:inset-[26px] border border-gray-100 pointer-events-none"></div>

                        <div className="text-center relative z-10 max-w-3xl mx-auto">
                            <motion.h1
                                className="font-serif text-4xl md:text-6xl text-sys-black mb-8 tracking-tight"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                {t('hero_title')}
                            </motion.h1>
                            <motion.div
                                className="w-24 h-1 bg-black mx-auto mb-8"
                                initial={{ width: 0 }}
                                animate={{ width: 96 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            ></motion.div>
                            <motion.p
                                className="text-lg md:text-xl text-gray-700 leading-loose font-serif italic mb-12"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            >
                                {t('hero_subtitle')}
                            </motion.p>

                            <motion.div
                                className="text-left md:text-center space-y-6"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.6 }}
                            >
                                <h2 className="font-serif text-2xl mb-4 text-black uppercase tracking-widest text-center">{t('about_short_title')}</h2>
                                <p className="text-gray-600 font-light leading-relaxed text-lg text-justify md:text-center">
                                    {t('about_short_text')}
                                </p>
                            </motion.div>

                            <motion.div
                                className="mt-16 flex flex-col md:flex-row justify-center gap-6 relative z-10"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.6 }}
                            >
                                <Link to="/nosotros" className="px-10 py-4 bg-black text-white hover:bg-gray-800 transition-all uppercase tracking-[0.2em] text-xs font-bold border border-black hover:shadow-lg">
                                    {t('nav_about')}
                                </Link>
                                <Link to="/molduras" className="px-10 py-4 bg-transparent text-black hover:bg-black hover:text-white transition-all uppercase tracking-[0.2em] text-xs font-bold border border-black hover:shadow-lg">
                                    {t('nav_molduras')}
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
