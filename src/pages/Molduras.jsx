import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import ImageModal from '../components/ui/ImageModal';
import SEO from '../components/seo/SEO';
import { molduraDetails } from '../data/molduraDetails';
import { useWhatsApp } from '../context/WhatsAppContext';

// Dynamically import all images from src/assets/frames
// Using standard glob. We will handle the format manually to be safe.
const imagesGlob = import.meta.glob('../assets/frames/*.{png,jpg,jpeg,svg}', { eager: true, query: '?url' });

// Defensive extraction function
const extractUrl = (mod) => {
    if (!mod) return null;
    if (typeof mod === 'string') return mod;
    if (typeof mod === 'object' && 'default' in mod) return mod.default;
    return null;
};

// Sort images by number if possible, assuming format "moldura_sys_XX"
const frameImages = Object.values(imagesGlob)
    .map(extractUrl)
    .filter(url => typeof url === 'string') // Filter out failures
    .sort((a, b) => {
        const getNum = (str) => {
            if (!str) return 0;
            const match = str.match(/_(\d+)\./);
            return match ? parseInt(match[1]) : 0;
        };
        return getNum(a) - getNum(b);
    });

const Molduras = () => {
    const { t, lang: language } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(null);
    const { setMessage, resetMessage } = useWhatsApp();

    useEffect(() => {
        if (selectedImage) {
            const fileName = selectedImage.split('/').pop().split('.').shift();
            const match = fileName.match(/sys[-_]?(\d+)/i);
            const titleNumber = match ? match[1] : '';

            if (titleNumber) {
                setMessage(`Hola, estoy interesado en la Moldura SYS ${titleNumber}`);
            } else {
                setMessage("Hola, estoy interesado en una moldura.");
            }
        } else {
            resetMessage();
        }

        // Cleanup on unmount or when selectedImage changes
        return () => {
            // We don't necessarily want to reset on unmount if we act strictly on selectedImage, 
            // but it's good practice to reset if we leave the page while modal is open (rare but possible).
        };
    }, [selectedImage, setMessage, resetMessage]);

    // Handle component unmount separately to ensure we reset if navigating away
    useEffect(() => {
        return () => resetMessage();
    }, [resetMessage]);

    const handleNext = () => {
        if (!selectedImage) return;
        const currentIndex = frameImages.findIndex(img => img === selectedImage);
        if (currentIndex < frameImages.length - 1) {
            setSelectedImage(frameImages[currentIndex + 1]);
        }
    };

    const handlePrev = () => {
        if (!selectedImage) return;
        const currentIndex = frameImages.findIndex(img => img === selectedImage);
        if (currentIndex > 0) {
            setSelectedImage(frameImages[currentIndex - 1]);
        }
    };

    const currentIndex = selectedImage ? frameImages.findIndex(img => img === selectedImage) : -1;



    return (
        <div className="animate-in fade-in duration-500">
            <SEO
                title="Colección de Molduras"
                description="Explore nuestra exclusiva colección de molduras artesanales e importadas. Diseños clásicos y modernos para realzar sus obras de arte."
            />
            <div className="mb-8 flex items-center gap-4">
                <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-colors text-sys-black">
                    <ArrowLeft /> <span>{t('back')}</span>
                </Link>
                <h2 className="text-4xl font-serif font-bold">{t('nav_molduras')}</h2>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl">
                {t('intro_molduras')}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {frameImages.map((image, index) => {
                    // Extract filename from path
                    const fileName = image.split('/').pop().split('.').shift();

                    // Regex to match "sys" followed by a separator and a number
                    // Matches: moldura_sys_01, sys-01-hash, sys_01, etc.
                    const match = fileName.match(/sys[-_]?(\d+)/i);
                    const titleNumber = match ? match[1] : '??';

                    return (
                        <div
                            key={index}
                            className="group cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                        >
                            <div className="aspect-square overflow-hidden bg-sys-light mb-6 relative flex items-center justify-center group-hover:shadow-md transition-shadow duration-500">
                                <img
                                    src={image}
                                    alt={`Moldura SYS ${titleNumber}`}
                                    className="w-full h-full object-contain p-8 transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-brand-gold/5 transition-colors duration-500"></div>
                            </div>
                            <h3 className="text-lg font-serif text-center text-sys-black tracking-widest">SYS {titleNumber}</h3>
                        </div>
                    );
                })}
            </div>

            {/* Helpers to get current details */}
            {(() => {
                const currentFileName = selectedImage ? selectedImage.split('/').pop().split('.').shift() : '';
                const match = currentFileName.match(/sys[-_]?(\d+)/i);
                const currentNum = match ? match[1] : null;
                const details = currentNum ? molduraDetails[currentNum] : null;

                return (
                    <ImageModal
                        isOpen={!!selectedImage}
                        onClose={() => setSelectedImage(null)}
                        imageSrc={selectedImage}
                        altText="Moldura Detail"
                        title={currentNum ? `SYS ${currentNum}` : 'Detalle'}
                        description={details?.[language || 'es']?.description || details?.['es']?.description}
                        recommendation={details?.[language || 'es']?.recommendation || details?.['es']?.recommendation}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        hasNext={currentIndex < frameImages.length - 1}
                        hasPrev={currentIndex > 0}
                    />
                );
            })()}

            <div className="mt-16 p-8 bg-gray-50 border border-gray-200 text-center md:text-left">
                <h3 className="text-2xl font-serif font-bold mb-4">{t('cta_quote')}</h3>
                <p className="mb-6 text-lg">Utilice nuestra calculadora para obtener un presupuesto instantáneo.</p>
                <Link to="/servicios" className="inline-block bg-black text-white px-8 py-3 text-lg font-bold tracking-wide hover:bg-gray-800 transition-colors">
                    IR A CALCULADORA
                </Link>
            </div>
        </div>
    );
};

export default Molduras;
