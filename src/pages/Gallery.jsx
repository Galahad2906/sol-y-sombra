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
            <SEO
                title="Galería de Trabajos"
                description="Explore nuestra galería de cuadros enmarcados, ejemplos de nuestro taller artesanal y composiciones de salón en Sol y Sombra."
                keywords="ejemplos enmarcados, galeria cuadros, taller artesanal paraguay, arte decorativo, marcos a medida"
            />
            <div className="mb-8 flex items-center gap-4">
                <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-colors text-sys-black">
                    <ArrowLeft /> <span>{t('back')}</span>
                </Link>
                <h2 className="text-4xl font-serif font-bold">{t('nav_gallery')}</h2>
            </div>

            <p className="text-xl text-sys-gray leading-relaxed font-light mb-12 -mt-4 max-w-2xl">
                {t('gallery_subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                    <div
                        key={index}
                        className="relative group h-[28rem] cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700"
                        onClick={() => setSelectedImage(image)}
                    >
                        <div className="relative w-full h-full overflow-hidden bg-sys-light">
                            <img
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.15]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8">
                                <p className="text-white text-2xl font-serif tracking-wide">{t('gallery_item_label')} {index + 1}</p>
                                <div className="w-12 h-[1px] bg-brand-gold mt-4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100"></div>
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
