import { useState } from 'react';
import { Send } from 'lucide-react';

const ContactSection = () => {
    const [name, setName] = useState('');
    const [question, setQuestion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct WhatsApp URL
        const phoneNumber = "595981622632"; // Replace with actual business number if different
        const text = `Hola, soy ${name}. Tengo una consulta: ${question}`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="bg-white p-8 rounded-sm shadow-lg border border-gray-100">
            <h3 className="text-2xl font-serif font-bold mb-2">¿Tiene alguna duda o proyecto?</h3>
            <p className="text-gray-600 mb-6">Envíenos su consulta directamente a nuestro WhatsApp.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors bg-gray-50"
                        placeholder="Su nombre"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="question" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Consulta</label>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors bg-gray-50 h-32 resize-none"
                        placeholder="Escriba su consulta aquí..."
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide mt-4 shadow-md hover:shadow-lg transform active:scale-[0.98] duration-100"
                >
                    <Send size={20} />
                    Enviar a WhatsApp
                </button>
            </form>
        </div>
    );
};

export default ContactSection;
