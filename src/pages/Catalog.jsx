import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { catalogItems } from '../data/items';
import { getImage } from '../utils/image-util';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/seo/SEO';

const Catalog = () => {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('all');

    const filteredItems = filter === 'all'
        ? catalogItems
        : catalogItems.filter(item => item.size === filter);

    const sizes = ['A1', 'A2', 'A3', 'A4'];

    const handleAddToQuote = (item) => {
        // In a real app this would add to a cart context. 
        // For now, redirect to Services as per original behavior.
        // We could pass state via location, but original just alerted.
        alert(`${item.size} - ${item.style} - ${t('catalog_alert_added')}`);
        window.location.href = '/servicios'; // Using href to ensure clean state or use navigate
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
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                    >
                        {t('catalog_filter_all')}
                    </button>
                    {sizes.map(size => (
                        <button
                            key={size}
                            onClick={() => setFilter(size)}
                            className={`px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${filter === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
                            <img
                                src={getImage(item.img)}
                                alt={item.style}
                                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1">{item.size}</div>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
