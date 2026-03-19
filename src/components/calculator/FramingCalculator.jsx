import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateFramePrice, GLASS_TYPES, PAYMENT_METHODS, formatCurrency } from '../../services/pricingService';

const FramingCalculator = () => {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [moldingPrice, setMoldingPrice] = useState('');
    const [glassType, setGlassType] = useState(GLASS_TYPES.SENCILLO.id);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.TARJETA.id);

    const result = useMemo(() => {
        // Only calculate if we have valid numeric inputs
        const w = parseFloat(width);
        const h = parseFloat(height);
        const m = parseFloat(moldingPrice);

        if (!w || !h || !m) return null;

        return calculateFramePrice(w, h, m, glassType, paymentMethod);
    }, [width, height, moldingPrice, glassType, paymentMethod]);

    const generatePDF = () => {
        if (!result) return;

        const doc = new jsPDF();

        // Ensure autoTable is available
        // Note: In some setups autoTable attaches automatically, in others it needs to be called.
        // We will call it directly via the imported function if doc.autoTable is missing, 
        // OR we just rely on the import side-effect but verify the import style.
        // Better approach for Vite/ESM:
        // import autoTable from 'jspdf-autotable';
        // autoTable(doc, { ... });

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Presupuesto de Enmarcado", 20, 20);

        // Date
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(new Date().toLocaleDateString(), 190, 20, { align: "right" });

        // Dimensions
        doc.setFontSize(12);
        doc.text(`Medidas: ${width} m x ${height} m`, 20, 35);

        // Breakdown Table
        const tableBody = [
            ["Costo Moldura", formatCurrency(result.costs.molding)],
            ["Costo Vidrio", formatCurrency(result.costs.glass)],
            [{ content: "Subtotal Materiales", styles: { fontStyle: 'bold' } }, { content: formatCurrency(result.costs.materialSubtotal), styles: { fontStyle: 'bold' } }],
            ["IVA + Comisiones (15%)", formatCurrency(result.prices.base * 0.15 + result.costs.materialSubtotal)], // Showing the gap roughly, but better to follow strict math if needed. 
            // Wait, logic check: 
            // Final = (Material * 2) * 1.15. 
            // Use specific breakdown logic to match visual total?
            // User requested: "Fees: Explicitly show 'IVA + Comisiones (15%)'"
            // Let's rely on the result object mostly. 
        ];

        // Recalculating fees display for the PDF explicitly to match the "Final Price" logic transparently if possible, 
        // or just listing the line items requested.
        // Let's list the full buildup to be clear:
        // 1. Materials
        // 2. Fees/Markup? User asked for "Molding, Glass, Material Subtotal" then "Fees". 
        // Logic: Material * 2 = Base. Base * 1.15 = Final.
        // The jump from Material Subtotal to Final is significant. 
        // Let's just show the summary values the user sees + the fees.

        // Actually, looking at the prompt: "List the Molding Cost, Glass Cost, and Material Subtotal. Fees: Explicitly show the 'IVA + Comisiones (15%)' amount."
        // And "Total: Final Price".
        // The math: Final = (Subtotal * 2) * 1.15. 
        // So "Fees" isn't just 15% of Subtotal. It implies the markup too.
        // I will follow the visual breakdown request strictly:

        // Table Rows:
        const rows = [
            ["Costo Moldura", formatCurrency(result.costs.molding)],
            ["Costo Vidrio", formatCurrency(result.costs.glass)],
            ["Subtotal Materiales", formatCurrency(result.costs.materialSubtotal)],
            ["Mano de Obra y Rentabilidad", formatCurrency(result.prices.base - result.costs.materialSubtotal)],
            [result.prices.feeLabel, formatCurrency(result.prices.final - result.prices.base)],
            [{ content: "PRECIO FINAL", styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, { content: formatCurrency(result.prices.final), styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]
        ];

        autoTable(doc, {
            startY: 45,
            head: [["Concepto", "Monto"]],
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [33, 33, 33] }, // Dark gray/black
        });

        doc.save(`Presupuesto_Marco_${Date.now()}.pdf`);
    };

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
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ancho (m)</label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Alto (m)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            step="0.01"
                            placeholder="0.00"
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

                {/* Payment Method */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Método de Pago</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all cursor-pointer"
                    >
                        {Object.values(PAYMENT_METHODS).map((method) => (
                            <option key={method.id} value={method.id}>
                                {method.name}
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
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Mano de Obra y Rentabilidad</span>
                                <span className="font-mono">{formatCurrency(result.prices.base - result.costs.materialSubtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{result.prices.feeLabel}</span>
                                <span className="font-mono">{formatCurrency(result.prices.final - result.prices.base)}</span>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex flex-col items-center justify-center">
                            <span className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">Precio Final (IVA INC.)</span>
                            <span className="text-3xl font-bold text-gray-900 font-montserrat">
                                {formatCurrency(result.prices.final)}
                            </span>
                        </div>

                        <button
                            onClick={generatePDF}
                            className="w-full mt-4 bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                        >
                            <Download size={18} />
                            Descargar Presupuesto PDF
                        </button>
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
