import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import ImageModal from '../components/ui/ImageModal';
import SEO from '../components/seo/SEO';


// Dynamically import all images from src/assets/gallery
const imagesGlob = import.meta.glob('../assets/gallery/*.{png,jpg,jpeg,svg}', { eager: true, query: '?url' });

const extractUrl = (mod) => {
    if (!mod) return null;
    if (typeof mod === 'string') return mod;
    if (typeof mod === 'object' && 'default' in mod) return mod.default;
    return null;
};

const galleryImages = Object.values(imagesGlob)
    .map(extractUrl)
    .filter(url => typeof url === 'string');

const Gallery = () => {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(null);

    const handleNext = () => {
        if (!selectedImage) return;
        const currentIndex = galleryImages.findIndex(img => img === selectedImage);
        if (currentIndex < galleryImages.length - 1) {
            setSelectedImage(galleryImages[currentIndex + 1]);
        }
    };

    const handlePrev = () => {
        if (!selectedImage) return;
        const currentIndex = galleryImages.findIndex(img => img === selectedImage);
        if (currentIndex > 0) {
            setSelectedImage(galleryImages[currentIndex - 1]);
        }
    };

    const currentIndex = selectedImage ? galleryImages.findIndex(img => img === selectedImage) : -1;


    return (
        <div className="animate-in fade-in duration-500">
            {/* SEO Removed for Debugging */}
            <div className="mb-8 flex items-center gap-4">
                <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-colors text-sys-black">
                    <ArrowLeft /> <span>{t('back')}</span>
                </Link>
                <h2 className="text-4xl font-serif font-bold">{t('nav_gallery')}</h2>
            </div>

            <p className="text-lg text-sys-black/70 mb-8 -mt-6 font-serif italic">
                {t('gallery_subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                    <div
                        key={index}
                        className="relative group h-96 cursor-pointer bg-white p-4 shadow-xl border border-gray-100 transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1"
                        onClick={() => setSelectedImage(image)}
                    >
                        <div className="relative w-full h-full overflow-hidden bg-gray-100">
                            <img
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/70 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-xl font-serif">Example Work {index + 1}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageSrc={selectedImage}
                altText="Gallery Image"
                onNext={handleNext}
                onPrev={handlePrev}
                hasNext={currentIndex < galleryImages.length - 1}
                hasPrev={currentIndex > 0}
            />
        </div>
    );
};

export default Gallery;
