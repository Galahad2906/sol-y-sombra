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
            <div className="max-w-6xl mx-auto w-full px-4 py-12 md:py-24">
                {/* Clean, expansive container */}
                <motion.div
                    className="flex flex-col items-center justify-center text-center relative z-10 w-full"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <motion.h1
                        className="font-serif text-5xl md:text-7xl lg:text-8xl text-sys-black mb-8 tracking-tighter"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                    >
                        {t('hero_title')}
                    </motion.h1>

                    <motion.div
                        className="w-16 h-[2px] bg-brand-gold mx-auto mb-10"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    ></motion.div>

                    <motion.p
                        className="text-xl md:text-2xl text-sys-gray leading-relaxed font-light max-w-4xl mx-auto mb-16"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                    >
                        {t('hero_subtitle')}
                    </motion.p>

                    <motion.div
                        className="max-w-3xl mx-auto mt-8 mb-20 space-y-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9, duration: 1 }}
                    >
                        <h2 className="font-serif text-sm text-sys-gray uppercase tracking-[0.3em] text-center mb-6">
                            {t('about_short_title')}
                        </h2>
                        <p className="text-gray-500 font-light leading-loose text-lg text-justify md:text-center">
                            {t('about_short_text')}
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-6 relative z-10 w-full sm:w-auto"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        <Link to="/nosotros" className="px-12 py-5 bg-sys-black text-white hover:bg-sys-gray transition-all uppercase tracking-[0.2em] text-xs font-semibold w-full sm:w-auto">
                            {t('nav_about')}
                        </Link>
                        <Link to="/molduras" className="px-12 py-5 bg-transparent text-sys-black border border-sys-black hover:bg-sys-black hover:text-white transition-all uppercase tracking-[0.2em] text-xs font-semibold w-full sm:w-auto">
                            {t('nav_molduras')}
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
