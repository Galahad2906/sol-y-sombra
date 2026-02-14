import { X, ChevronLeft, ChevronRight, Info, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const ImageModal = ({ isOpen, onClose, imageSrc, altText, title, description, recommendation, onNext, onPrev, hasNext, hasPrev }) => {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && onNext) onNext();
            if (e.key === 'ArrowLeft' && onPrev) onPrev();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = 'unset';
            // Also reset overflow when closed just in case
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, onNext, onPrev]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 transition-opacity duration-300 animate-in fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close"
            >
                <X size={32} />
            </button>

            {hasPrev && (
                <button
                    className="absolute left-2 md:left-8 z-50 p-3 text-white bg-black/50 hover:bg-black/80 rounded-full transition-all backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    aria-label="Previous image"
                >
                    <ChevronLeft size={48} />
                </button>
            )}

            {hasNext && (
                <button
                    className="absolute right-2 md:right-8 z-50 p-3 text-white bg-black/50 hover:bg-black/80 rounded-full transition-all backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    aria-label="Next image"
                >
                    <ChevronRight size={48} />
                </button>
            )}

            <div
                className="relative max-w-6xl w-full h-auto max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image Section */}
                <div className="w-full md:w-2/3 h-[50vh] md:h-[80vh] bg-gray-100 flex items-center justify-center p-0 md:p-8 relative overflow-hidden">

                    <TransformWrapper
                        initialScale={1}
                        initialPositionX={0}
                        initialPositionY={0}
                        centerOnInit={true}
                        wheel={{ disabled: true }} // Disable wheel zoom to prevent conflict with scrolling if any
                        pinch={{ disabled: false }} // Enable pinch
                        doubleClick={{ disabled: false }} // Enable double click
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                {/* Controls - HIDDEN ON MOBILE (flex on md and up) */}
                                <div className="absolute top-4 right-4 z-10 hidden md:flex gap-2">
                                    <button
                                        onClick={() => zoomOut()}
                                        className="p-2 bg-white/80 hover:bg-white text-sys-black rounded-full shadow-lg transition-colors"
                                        aria-label="Zoom Out"
                                    >
                                        <ZoomOut size={24} />
                                    </button>
                                    <button
                                        onClick={() => zoomIn()}
                                        className="p-2 bg-white/80 hover:bg-white text-sys-black rounded-full shadow-lg transition-colors"
                                        aria-label="Zoom In"
                                    >
                                        <ZoomIn size={24} />
                                    </button>
                                </div>

                                {/* Actual Image */}
                                <TransformComponent
                                    wrapperClass="!w-full !h-full flex items-center justify-center"
                                    contentClass="!w-full !h-full flex items-center justify-center"
                                >
                                    <img
                                        src={imageSrc}
                                        alt={altText || 'Enlarged image'}
                                        className="max-w-full max-h-full object-contain drop-shadow-xl select-none"
                                        draggable="false"
                                    />
                                </TransformComponent>

                                {/* Reset transform when image changes */}
                                <ResetHandler imageSrc={imageSrc} resetTransform={resetTransform} />
                            </>
                        )}
                    </TransformWrapper>
                </div>

                {/* Info Section */}
                <div className="w-full md:w-1/3 bg-white p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[40vh] md:max-h-[80vh]">
                    <h3 className="text-3xl font-serif font-bold text-sys-black mb-6 border-b border-gray-200 pb-4">
                        {title}
                    </h3>

                    {description ? (
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Descripción</h4>
                                <p className="text-gray-700 leading-relaxed text-lg font-light">
                                    {description}
                                </p>
                            </div>

                            {recommendation && (
                                <div className="bg-gray-50 p-6 rounded-l-lg border-l-4 border-black">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                        <Info size={14} /> Recomendación de Uso
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed italic">
                                        "{recommendation}"
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">Sin descripción disponible.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper to reset zoom when image changes
const ResetHandler = ({ imageSrc, resetTransform }) => {
    useEffect(() => {
        resetTransform();
    }, [imageSrc, resetTransform]);
    return null;
};

export default ImageModal;
