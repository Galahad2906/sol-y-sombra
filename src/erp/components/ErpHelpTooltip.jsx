import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Info } from 'lucide-react';

const ErpHelpTooltip = ({ title, description, steps = [], align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="¿Cómo funciona? Haz clic para ver la ayuda rápida"
        className="w-5 h-5 rounded-full bg-neutral-800/90 hover:bg-amber-500 text-neutral-400 hover:text-neutral-950 flex items-center justify-center text-[11px] font-bold font-mono transition-all border border-neutral-700 hover:border-amber-400 shadow-sm shrink-0 cursor-pointer active:scale-95"
      >
        ?
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-full mt-2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150 ${
            align === 'left' ? 'left-0' : 'right-0 sm:right-auto sm:-left-32'
          }`}
        >
          <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-serif">
              <Info size={14} className="text-amber-400 shrink-0" />
              <span>{title || 'Ayuda Rápida'}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          {description && (
            <p className="text-xs text-neutral-300 leading-relaxed mb-2.5">
              {description}
            </p>
          )}

          {steps.length > 0 && (
            <div className="space-y-1.5 pt-1.5 border-t border-neutral-800/80">
              <span className="text-[10px] font-mono uppercase text-amber-500/90 font-bold tracking-wider block">
                ¿Cómo usarlo paso a paso?
              </span>
              <ol className="space-y-1 text-[11px] text-neutral-300">
                {steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErpHelpTooltip;
