import React from 'react';

const SolYSombraLogo = ({ className = "" }) => {
    return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 300 150"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Border Frame - Broken for text */}
                {/* Top line split for "Arte y" */}
                <path d="M 20 40 L 80 40" stroke="currentColor" strokeWidth="2" />
                <path d="M 220 40 L 280 40" stroke="currentColor" strokeWidth="2" />

                {/* Side lines */}
                <path d="M 20 40 L 20 120" stroke="currentColor" strokeWidth="2" />
                <path d="M 280 40 L 280 120" stroke="currentColor" strokeWidth="2" />

                {/* Bottom line split for "SOL Y SOMBRA SRL" */}
                <path d="M 20 120 L 70 120" stroke="currentColor" strokeWidth="2" />
                <path d="M 230 120 L 280 120" stroke="currentColor" strokeWidth="2" />

                {/* Text Elements */}
                <g className="text-current fill-current">
                    {/* Arte y */}
                    <text
                        x="150"
                        y="60"
                        textAnchor="middle"
                        fontFamily="'Great Vibes', cursive"
                        fontSize="55"
                        fontWeight="400"
                        className="select-none"
                    >
                        Arte y
                    </text>

                    {/* Enmarcados */}
                    <text
                        x="150"
                        y="105"
                        textAnchor="middle"
                        fontFamily="'Great Vibes', cursive"
                        fontSize="60"
                        fontWeight="400"
                        className="select-none"
                    >
                        Enmarcados
                    </text>

                    {/* SOL Y SOMBRA SRL */}
                    <text
                        x="150"
                        y="125"
                        textAnchor="middle"
                        fontFamily="'Montserrat', sans-serif"
                        fontSize="14"
                        fontWeight="700"
                        letterSpacing="1"
                        className="uppercase select-none"
                    >
                        Sol y Sombra SRL
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default SolYSombraLogo;
