import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Menu, X } from 'lucide-react';
import SolYSombraLogo from '../ui/SolYSombraLogo';

const Navbar = () => {
    const { lang, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200 h-28 flex items-center justify-between px-6 lg:px-12 shadow-sm transition-all duration-300">
            <Link to="/" className="flex items-center cursor-pointer h-full py-2">
                <SolYSombraLogo className="h-full w-auto" />
            </Link>

            <div className="flex items-center gap-6">
                {/* Language Selector */}
                <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
                    {['es', 'en', 'de'].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLanguage(l)}
                            className={`hover:underline decoration-2 underline-offset-4 uppercase ${lang === l ? 'text-black underline' : 'text-gray-400 hover:text-black'
                                }`}
                        >
                            {l}
                        </button>
                    )).reduce((prev, curr) => [prev, <span key={Math.random()} className="text-gray-300">|</span>, curr])}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu (Simplified for now, can be expanded) */}
            {isOpen && (
                <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-lg md:hidden flex flex-col p-4 animate-in slide-in-from-top-2">
                    <Link to="/inicio" className="py-2 text-lg font-bold" onClick={() => setIsOpen(false)}>{t('nav_home')}</Link>
                    <Link to="/nosotros" className="py-2 text-lg font-bold" onClick={() => setIsOpen(false)}>{t('nav_about')}</Link>
                    <Link to="/molduras" className="py-2 text-lg font-bold" onClick={() => setIsOpen(false)}>{t('nav_molduras')}</Link>
                    <Link to="/catalogo" className="py-2 text-lg font-bold" onClick={() => setIsOpen(false)}>{t('nav_catalog')}</Link>
                    <Link to="/galeria" className="py-2 text-lg font-bold" onClick={() => setIsOpen(false)}>{t('nav_gallery')}</Link>
                    <Link to="/servicios" className="py-2 text-lg font-bold" onClick={() => setIsOpen(false)}>{t('nav_services')}</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
