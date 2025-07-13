const BotonWhatsApp = () => {
  return (
    <>
      {/* Mobile: texto + ícono */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden flex items-center bg-white px-3 py-2 rounded-full shadow gap-2 overflow-hidden max-w-[calc(100vw-2rem)]">
        <span className="text-gray-800 text-sm font-medium whitespace-nowrap">
          ¿Necesitás ayuda?
        </span>
        <a
          href="https://wa.me/595981284321"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="text-green-500 flex items-center justify-center w-6 h-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <path d="M16.04 0C7.18 0 0 7.18 0 16.04c0 2.83.74 5.61 2.13 8.06L0 32l8.15-2.1a16.03 16.03 0 007.89 2.02h.01C24.91 31.92 32 24.83 32 16.04S24.91 0 16.04 0zm0 29.3a13.27 13.27 0 01-6.78-1.83l-.48-.28-4.84 1.25 1.29-4.71-.31-.49a13.22 13.22 0 012.1-16.71A13.2 13.2 0 0116.04 2.7c7.36 0 13.34 5.98 13.34 13.34 0 7.36-5.98 13.26-13.34 13.26zm7.35-9.91c-.4-.2-2.35-1.16-2.71-1.3s-.63-.2-.9.2c-.26.4-1.03 1.3-1.26 1.56-.23.26-.46.3-.86.1a10.7 10.7 0 01-3.15-2.45 11.57 11.57 0 01-2.17-3.01c-.23-.4-.02-.61.17-.8.17-.17.4-.43.6-.65.2-.23.26-.4.4-.66.13-.27.07-.5-.03-.7-.1-.2-.9-2.3-1.23-3.16-.32-.76-.64-.66-.88-.67l-.75-.02c-.26 0-.67.1-1 .5s-1.32 1.3-1.32 3.18 1.35 3.69 1.55 3.95c.2.26 2.62 4.02 6.34 5.65.89.39 1.58.63 2.1.8.88.28 1.68.25 2.3.15.7-.1 2.14-.85 2.44-1.68.3-.84.3-1.56.22-1.69-.07-.13-.32-.22-.7-.39z" />
          </svg>
        </a>
      </div>

      {/* Desktop: solo ícono */}
      <a
        href="https://wa.me/595981284321"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-4 right-4 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full items-center justify-center shadow-lg transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          viewBox="0 0 32 32"
          fill="currentColor"
        >
          <path d="M16.04 0C7.18 0 0 7.18 0 16.04c0 2.83.74 5.61 2.13 8.06L0 32l8.15-2.1a16.03 16.03 0 007.89 2.02h.01C24.91 31.92 32 24.83 32 16.04S24.91 0 16.04 0zm0 29.3a13.27 13.27 0 01-6.78-1.83l-.48-.28-4.84 1.25 1.29-4.71-.31-.49a13.22 13.22 0 012.1-16.71A13.2 13.2 0 0116.04 2.7c7.36 0 13.34 5.98 13.34 13.34 0 7.36-5.98 13.26-13.34 13.26zm7.35-9.91c-.4-.2-2.35-1.16-2.71-1.3s-.63-.2-.9.2c-.26.4-1.03 1.3-1.26 1.56-.23.26-.46.3-.86.1a10.7 10.7 0 01-3.15-2.45 11.57 11.57 0 01-2.17-3.01c-.23-.4-.02-.61.17-.8.17-.17.4-.43.6-.65.2-.23.26-.4.4-.66.13-.27.07-.5-.03-.7-.1-.2-.9-2.3-1.23-3.16-.32-.76-.64-.66-.88-.67l-.75-.02c-.26 0-.67.1-1 .5s-1.32 1.3-1.32 3.18 1.35 3.69 1.55 3.95c.2.26 2.62 4.02 6.34 5.65.89.39 1.58.63 2.1.8.88.28 1.68.25 2.3.15.7-.1 2.14-.85 2.44-1.68.3-.84.3-1.56.22-1.69-.07-.13-.32-.22-.7-.39z" />
        </svg>
      </a>
    </>
  );
};

export default BotonWhatsApp;
