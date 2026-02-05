import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/seo/SEO';

const NotFound = () => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
            <SEO
                title="404 - Not Found"
                description="Page not found"
                keywords="404, error, not found"
            />

            <div className="max-w-2xl mx-auto w-full text-center">
                {/* Decorative Frame */}
                <div className="bg-white p-8 md:p-12 relative border-8 border-sys-black shadow-2xl">
                    <div className="absolute top-4 left-4 right-4 bottom-4 border border-gray-200 pointer-events-none"></div>

                    <h1 className="font-serif text-8xl md:text-9xl text-sys-black mb-4 tracking-tighter">
                        {t('not_found_title')}
                    </h1>

                    <div className="w-16 h-1 bg-black mx-auto mb-8"></div>

                    <h2 className="font-serif text-2xl md:text-3xl text-gray-800 mb-4 uppercase tracking-widest">
                        {t('not_found_subtitle')}
                    </h2>

                    <p className="text-gray-500 font-light text-lg mb-10 max-w-md mx-auto leading-relaxed">
                        {t('not_found_desc')}
                    </p>

                    <Link
                        to="/"
                        className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all uppercase tracking-[0.2em] text-xs font-bold border border-black hover:shadow-lg"
                    >
                        {t('not_found_btn')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
