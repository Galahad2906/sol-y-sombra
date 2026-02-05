
import React, { useState, useEffect } from 'react';
import { fetchAllExchangeRates } from '../../services/currencyService';
import { Calculator, DollarSign, RefreshCw, ArrowRightLeft } from 'lucide-react';

const CurrencySection = () => {
    const [rates, setRates] = useState({ USD: null, BRL: null, ARS: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Calculator State
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [conversionMode, setConversionMode] = useState('FROM_PYG'); // 'FROM_PYG' (PYG -> X) or 'TO_PYG' (X -> PYG)

    const getRates = async () => {
        setLoading(true);
        try {
            const data = await fetchAllExchangeRates();
            setRates(data);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las cotizaciones momentáneamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRates();
    }, []);

    const formatCurrency = (value, currency) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(value);
    };

    const calculateTotal = () => {
        if (!amount || !rates[selectedCurrency]) return 0;
        const val = parseFloat(amount);
        const rate = rates[selectedCurrency];

        if (conversionMode === 'TO_PYG') {
            // I have Foreign Currency, bank BUYS it.
            return val * rate.purchasePrice;
        } else {
            // I have PYG, bank SELLS Foreign Currency to me.
            return val / rate.salePrice;
        }
    };

    const CurrencyCard = ({ currency, label, data, flag }) => {
        if (!data) return null;
        return (
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-black hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                        {flag} {label}
                    </h4>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {currency}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xs uppercase text-gray-500 font-bold mb-1">Compra</div>
                        <div className="text-2xl font-bold text-green-700">
                            {formatCurrency(data.purchasePrice, 'PYG').replace('PYG', '₲')}
                        </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-xs uppercase text-gray-500 font-bold mb-1">Venta</div>
                        <div className="text-2xl font-bold text-blue-700">
                            {formatCurrency(data.salePrice, 'PYG').replace('PYG', '₲')}
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-xs text-gray-400 text-center">
                    Fuente: {data.source} ({data.branch})
                </div>
            </div>
        );
    };

    return (
        <section className="py-12 bg-zinc-50 rounded-xl my-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-serif font-bold text-sys-black">
                        Cotizaciones del Día
                        <span className="block text-sm font-sans font-normal text-gray-500 mt-1">
                            Referencia: Casas de cambio de Asunción
                        </span>
                    </h3>
                    <button
                        onClick={getRates}
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                        title="Actualizar Cotizaciones"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin text-gray-400" : "text-black"} />
                    </button>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <CurrencyCard
                        currency="USD"
                        label="Dólar Americano"
                        data={rates.USD}
                        flag="🇺🇸"
                    />
                    <CurrencyCard
                        currency="BRL"
                        label="Real Brasileño"
                        data={rates.BRL}
                        flag="🇧🇷"
                    />
                    <CurrencyCard
                        currency="ARS"
                        label="Peso Argentino"
                        data={rates.ARS}
                        flag="🇦🇷"
                    />
                </div>

                {/* Calculator Section */}
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto">
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
                        <Calculator className="text-sys-black" /> Calculadora de Divisas
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Controls */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Moneda a operar</label>
                                <div className="flex gap-2">
                                    {['USD', 'BRL', 'ARS'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedCurrency(c)}
                                            className={`flex-1 py-2 rounded text-sm font-bold transition-all ${selectedCurrency === c
                                                ? 'bg-black text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de operación</label>
                                <button
                                    onClick={() => setConversionMode(prev => prev === 'FROM_PYG' ? 'TO_PYG' : 'FROM_PYG')}
                                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-between text-sm transition-colors group"
                                >
                                    <span className={conversionMode === 'FROM_PYG' ? 'font-bold' : 'text-gray-500'}>
                                        Tengo Guaraníes (PYG)
                                    </span>
                                    <ArrowRightLeft size={16} className="text-gray-400 group-hover:text-black" />
                                    <span className={conversionMode === 'TO_PYG' ? 'font-bold' : 'text-gray-500'}>
                                        Tengo {selectedCurrency}
                                    </span>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Monto</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Ingrese cantidad..."
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Result */}
                        <div className="bg-sys-black text-white p-6 rounded-lg flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                            <span className="text-gray-400 text-sm uppercase tracking-widest mb-2">Resultado Estimado</span>
                            <div className="text-4xl font-serif font-bold mb-2">
                                {conversionMode === 'TO_PYG'
                                    ? formatCurrency(calculateTotal(), 'PYG').replace('PYG', '₲')
                                    : formatCurrency(calculateTotal(), selectedCurrency)
                                }
                            </div>
                            <div className="text-sm text-gray-400 mt-2">
                                {conversionMode === 'TO_PYG'
                                    ? `Cambio: 1 ${selectedCurrency} = ${rates[selectedCurrency]?.purchasePrice || '-'} PYG`
                                    : `Cambio: 1 ${selectedCurrency} = ${rates[selectedCurrency]?.salePrice || '-'} PYG`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CurrencySection;
