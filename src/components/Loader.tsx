// src/components/Loader.tsx
import { useEffect, useState } from "react";
import logo from "../assets/logo-loader.png";

const Loader = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 1500); // Empieza el fade-out
    const timer2 = setTimeout(() => setHidden(true), 2000);  // Lo oculta

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#f9f6f2] to-[#e8e8e8] transition-opacity duration-700 ease-in-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={logo}
        alt="Logo Sol y Sombra SRL"
        className="w-44 h-44 mb-4 animate-pulse"
      />
      <p className="text-gray-600 text-base italic tracking-wide animate-fade-in">
        Cargando sitio...
      </p>
    </div>
  );
};

export default Loader;
