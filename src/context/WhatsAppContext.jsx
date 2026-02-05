import { createContext, useState, useContext } from 'react';

const WhatsAppContext = createContext();

export const WhatsAppProvider = ({ children }) => {
    const defaultMessage = "Hola, me contacto desde la web de Sol y Sombra.";
    const [message, setMessage] = useState(defaultMessage);

    const resetMessage = () => setMessage(defaultMessage);

    return (
        <WhatsAppContext.Provider value={{ message, setMessage, resetMessage, defaultMessage }}>
            {children}
        </WhatsAppContext.Provider>
    );
};

export const useWhatsApp = () => useContext(WhatsAppContext);
