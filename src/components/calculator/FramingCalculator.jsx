import { useState, useMemo } from 'react';
import { calculateFramePrice, GLASS_TYPES, formatCurrency } from '../../services/pricingService';

const FramingCalculator = () => {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [moldingPrice, setMoldingPrice] = useState('');
    const [glassType, setGlassType] = useState(GLASS_TYPES.SENCILLO.id);

    const result = useMemo(() => {
        // Only calculate if we have valid numeric inputs
        const w = parseFloat(width);
        const h = parseFloat(height);
        const m = parseFloat(moldingPrice);

        if (!w || !h || !m) return null;

        return calculateFramePrice(w, h, m, glassType);
    }, [width, height, moldingPrice, glassType]);

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
                <h2 className="text-xl font-bold text-white text-center font-montserrat tracking-wide">
                    CALCULADORA DE MARCOS
                </h2>
                <p className="text-gray-400 text-xs text-center mt-1 uppercase tracking-wider">
                    Estimador de Costos
                </p>
            </div>

            <div className="p-6 space-y-5">
                {/* Input Dimensions Group */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ancho (cm)</label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Alto (cm)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono"
                        />
                    </div>
                </div>

                {/* Molding Price */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio Moldura (Gs/m)</label>
                    <input
                        type="number"
                        value={moldingPrice}
                        onChange={(e) => setMoldingPrice(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono"
                    />
                </div>

                {/* Glass Type */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo de Vidrio</label>
                    <select
                        value={glassType}
                        onChange={(e) => setGlassType(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all cursor-pointer"
                    >
                        {Object.values(GLASS_TYPES).map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name} - {formatCurrency(type.pricePerM2)}/m²
                            </option>
                        ))}
                    </select>
                </div>

                {/* Results Section */}
                {result ? (
                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Costo Moldura ({result.dimensions.perimeter.toFixed(2)}m)</span>
                                <span className="font-mono">{formatCurrency(result.costs.molding)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Costo Vidrio ({result.dimensions.area.toFixed(2)}m²)</span>
                                <span className="font-mono">{formatCurrency(result.costs.glass)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-800 font-semibold pt-2 border-t border-gray-100">
                                <span>Subtotal Materiales</span>
                                <span className="font-mono">{formatCurrency(result.costs.materialSubtotal)}</span>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex flex-col items-center justify-center">
                            <span className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">Precio Final (IVA INC.)</span>
                            <span className="text-3xl font-bold text-gray-900 font-montserrat">
                                {formatCurrency(result.prices.final)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 text-center text-gray-400 text-sm italic h-32 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50">
                        Ingresa las medidas y costos para ver el presupuesto
                    </div>
                )}
            </div>
        </div>
    );
};

export default FramingCalculator;
