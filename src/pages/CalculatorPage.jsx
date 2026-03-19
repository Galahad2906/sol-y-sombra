import React from 'react';
import { Helmet } from 'react-helmet-async';
import FramingCalculator from '../components/calculator/FramingCalculator';

const CalculatorPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Cotizador | Sol & Sombra</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Cotizador Interno</h1>
                    <p className="mt-2 text-gray-600 font-inter">Herramienta de uso exclusivo para presupuestos de enmarcados.</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-100">
                    <FramingCalculator />
                </div>
            </div>
        </div>
    );
};

export default CalculatorPage;
