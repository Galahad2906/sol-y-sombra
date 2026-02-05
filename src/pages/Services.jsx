import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { getImage, STATIC_IMAGES } from '../utils/image-util';
import SEO from '../components/seo/SEO';
import CurrencySection from '../components/services/CurrencySection';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Services = () => {
    const { t } = useLanguage();
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [model, setModel] = useState({ name: 'SYS 07 - Negra (Gs. 45.000/m)', price: 45000 });
    const [total, setTotal] = useState(0);

    const models = [
        { name: 'SYS 07 - Negra (Gs. 45.000/m)', price: 45000 },
        { name: 'SYS 02 - Madera Natural (Gs. 55.000/m)', price: 55000 },
        { name: 'SYS 08 - Blanca (Gs. 45.000/m)', price: 45000 },
        { name: 'SYS 05 - Dorada (Gs. 65.000/m)', price: 65000 },
    ];

    const calculateTotal = (w, h, mPrice) => {
        if (w > 0 && h > 0) {
            const widthVal = parseFloat(w);
            const heightVal = parseFloat(h);
            const perimeter = ((widthVal + heightVal) * 2) / 100; // meters
            const area = (widthVal * heightVal) / 10000; // m2
            const glassCost = area * 100000;
            const laborCost = 50000;
            const estimated = (perimeter * mPrice) + glassCost + laborCost;
            setTotal(Math.round(estimated));
        } else {
            setTotal(0);
        }
    };

    const handleWidthChange = (e) => {
        setWidth(e.target.value);
        calculateTotal(e.target.value, height, model.price);
    };

    const handleHeightChange = (e) => {
        setHeight(e.target.value);
        calculateTotal(width, e.target.value, model.price);
    };

    const handleModelChange = (e) => {
        const selected = models.find(m => m.name === e.target.value);
        setModel(selected);
        calculateTotal(width, height, selected.price);
    };

    const generatePDF = () => {
        if (!width || !height) {
            alert(t('services_alert'));
            return;
        }

        const doc = new jsPDF();

        // Business Info
        doc.setFont("times", "bold");
        doc.setFontSize(22);
        doc.text("Sol y Sombra", 20, 20);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(t('about_title'), 20, 28);
        doc.text(t('footer_city'), 20, 34);
        doc.text("Email: hola@solysombra.com.py", 20, 40);

        doc.line(20, 45, 190, 45);

        // Quote Details
        doc.setFontSize(16);
        doc.text(t('services_pdf_title'), 20, 60);

        doc.setFontSize(12);
        const date = new Date().toLocaleDateString();
        doc.text(`Fecha: ${date}`, 150, 60);

        const bodyData = [
            [t('services_pdf_desc'), t('services_pdf_detail')],
            [t('services_pdf_measures'), `${width} cm x ${height} cm`],
            [t('services_model'), model.name.split('(')[0].trim()],
            [t('services_pdf_glass'), t('services_pdf_glass')],
            [t('services_pdf_labor'), t('services_pdf_included')],
        ];

        doc.autoTable({
            startY: 70,
            head: [[t('services_pdf_concept'), t('services_pdf_spec')]],
            body: bodyData,
            theme: 'striped',
            headStyles: { fillColor: [0, 0, 0] },
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`${t('services_pdf_total')}: Gs. ${total.toLocaleString('es-PY')}`, 120, finalY);

        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(t('services_pdf_note1'), 20, finalY + 20);
        doc.text(t('services_pdf_note2'), 20, finalY + 25);

        doc.save(`Presupuesto_SolYSombra_${Date.now()}.pdf`);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <SEO
                title="Servicios y Presupuesto"
                description="Cotice su enmarcado online. Calculadora de presupuestos para marcos a medida. Servicios de restauración y conservación de arte."
                keywords="presupuesto marcos, calculadora enmarcados, restauracion cuadros, precio marcos asuncion, vidrio antireflejo"
            />
            <div className="mb-8 flex items-center gap-4">
                <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-colors text-sys-black">
                    <ArrowLeft /> <span>{t('back')}</span>
                </Link>
                <h2 className="text-4xl font-serif font-bold">{t('nav_services')}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Info Section */}
                <div>
                    <img
                        src={getImage(STATIC_IMAGES.SERVICES_MAIN)}
                        alt="Servicios"
                        className="w-full h-64 object-cover mb-6 rounded-sm grayscale"
                    />
                    <h3 className="text-2xl font-serif font-bold mb-4">{t('services_framing_title')}</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        {t('services_framing_text')}
                    </p>

                    <h3 className="text-2xl font-serif font-bold mb-4">{t('services_restoration_title')}</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        {t('services_restoration_text')}
                    </p>
                </div>

                {/* Calculator Section */}
                <div className="bg-gray-100 p-8 rounded-sm shadow-md h-fit top-24 sticky">
                    <h3 className="text-2xl font-serif font-bold mb-2">{t('calc_title')}</h3>
                    <p className="text-gray-600 mb-6">{t('calc_subtitle')}</p>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">{t('services_width')}</label>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={handleWidthChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">{t('services_height')}</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={handleHeightChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">{t('services_model')}</label>
                            <select
                                value={model.name}
                                onChange={handleModelChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                            >
                                {models.map(m => (
                                    <option key={m.name} value={m.name}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4 border-t border-gray-300 mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-lg">{t('services_estimate_label')}</span>
                                <span className="font-serif text-3xl font-bold">Gs. {total.toLocaleString('es-PY')}</span>
                            </div>
                            <button
                                onClick={generatePDF}
                                className="w-full bg-black text-white font-bold py-3 hover:bg-gray-800 transition-colors tracking-wide"
                            >
                                {t('btn_download_pdf')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Currency Section */}
            <CurrencySection />
        </div>
    );
};

export default Services;
