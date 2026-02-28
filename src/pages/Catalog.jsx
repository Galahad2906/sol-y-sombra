import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { catalogItems } from '../data/items';
import { getImage } from '../utils/image-util';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/seo/SEO';

const Catalog = () => {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('all');

    const filteredItems = filter === 'all'
        ? catalogItems
        : catalogItems.filter(item => item.size === filter || item.primaryColor === filter);

    const filterOptions = [
        { label: t('catalog_filter_all') || 'Todos', value: 'all' },
        { label: 'A1', value: 'A1' },
        { label: 'A2', value: 'A2' },
        { label: 'A3', value: 'A3' },
        { label: 'A4', value: 'A4' },
        { label: 'Negro', value: 'Negro' },
        { label: 'Blanco', value: 'Blanco' },
        { label: 'Madera', value: 'Madera' },
        { label: 'Dorado', value: 'Dorado' },
    ];

    const handleAddToQuote = (item) => {
        alert(`${item.size} - ${item.style} - Añadido a consulta`);
        // We use navigate or href
        window.location.href = '/servicios';
    };

    return (
        <div className="animate-in fade-in duration-500">
            <SEO
                title="Catálogo"
                description="Catálogo de cuadros decorativos en stock. Encuentre arte listo para llevar en Sol y Sombra, Asunción, Paraguay."
                keywords="catalogo cuadros, laminas decorativas, cuadros listos, arte asuncion, enmarcados en stock"
            />
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-colors text-sys-black">
                        <ArrowLeft /> <span>{t('back')}</span>
                    </Link>
                    <h2 className="text-4xl font-serif font-bold">{t('nav_catalog')}</h2>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {filterOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`px-4 py-2 rounded-full border text-sm font-bold transition-all duration-300 whitespace-nowrap ${filter === option.value
                                ? 'bg-black text-white border-black shadow-md transform scale-105'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredItems.map(item => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
                        >
                            <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
                                <img
                                    src={getImage(item.img)}
                                    alt={item.style}
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                    <span className="bg-black text-white text-xs font-bold px-2 py-1 shadow-sm">{item.size}</span>
                                    <span className="bg-white/90 backdrop-blur-sm text-black border border-black text-[10px] font-bold px-2 py-1 shadow-sm uppercase">{item.primaryColor}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-serif font-bold text-lg">{item.style}</h3>
                                    <span className="font-bold text-gray-900">Gs. {item.price.toLocaleString('es-PY')}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">{item.color} - {t('catalog_glass_matte')}</p>
                                <button
                                    onClick={() => handleAddToQuote(item)}
                                    className="w-full border border-black text-black font-bold py-2 hover:bg-black hover:text-white transition-colors uppercase text-sm tracking-wide"
                                >
                                    {t('catalog_add_quote')}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Catalog;
