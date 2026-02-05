import { Link } from 'react-router-dom';
import { Mail, Phone, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    // Helper to render newlines in text
    const renderWithNewlines = (text) => {
        return text.split('\n').map((line, i) => <span key={i}>{line}<br /></span>);
    };

    return (
        <footer className="bg-black text-white py-12 border-t-4 border-gray-800">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div className="border-2 border-white w-fit p-1 mb-4">
                        <div className="bg-white text-black px-2 py-1 font-serif font-bold tracking-widest uppercase">
                            Sol y Sombra
                        </div>
                    </div>
                    <p className="text-gray-400">
                        {renderWithNewlines(t('footer_desc'))}
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4 uppercase tracking-wider">{t('footer_contact')}</h4>
                    <p className="text-gray-400 flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" /> {t('footer_email_contact')}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2 mb-4">
                        <Phone className="w-4 h-4" /> {t('footer_phone_display')}
                    </p>

                    <h4 className="font-bold text-lg mb-2 uppercase tracking-wider">{t('footer_hours_title')}</h4>
                    <p className="text-gray-400 text-sm">{t('footer_hours_weekdays')}</p>
                    <p className="text-gray-400 text-sm">{t('footer_hours_saturday')}</p>
                    <p className="text-gray-400 text-sm">{t('footer_hours_sunday')}</p>

                    {/* Search Result Attribution */}
                    <p className="text-gray-500 text-xs mt-6">
                        <a href="https://solysombrasrl.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" /> {t('footer_website')}
                        </a>
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4 uppercase tracking-wider">{t('footer_location')}</h4>
                    <p className="text-gray-400">{t('footer_address')}</p>
                    <p className="text-gray-400 mt-1">{t('footer_city')}</p>
                    <p className="text-gray-500 text-sm mt-4">{t('footer_shipping')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
