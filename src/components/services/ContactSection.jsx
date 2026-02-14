import { useState } from 'react';
import { Send, Upload, Info } from 'lucide-react';

const ContactSection = () => {
    const [name, setName] = useState('');
    const [question, setQuestion] = useState('');
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct WhatsApp URL
        const phoneNumber = "595981622632"; // Replace with actual business number if different
        const text = `Hola, soy ${name}. Tengo una consulta: ${question}`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Show alert about photo attachment
        if (fileName) {
            alert("⚠️ IMPORTANTE:\n\nWhatsApp web/app se abrirá ahora. Por favor, recuerde ADJUNTAR MANUALMENTE la foto que seleccionó dentro del chat.");
        }
    };

    return (
        <div className="bg-white p-8 rounded-sm shadow-lg border border-gray-100">
            <h3 className="text-2xl font-serif font-bold mb-2">¿Tiene alguna duda o proyecto?</h3>
            <p className="text-gray-600 mb-6">Envíenos su consulta y una foto de referencia directamente a nuestro WhatsApp.</p>

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

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Adjuntar Foto (Referencia)</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="photo-upload"
                        />
                        <label
                            htmlFor="photo-upload"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition-all group"
                        >
                            <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-black">
                                <Upload size={24} />
                                <span className="font-medium">{fileName || "Haga clic para seleccionar una imagen"}</span>
                            </div>
                        </label>
                    </div>
                    {fileName && (
                        <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
                            <Info size={14} className="mt-0.5 flex-shrink-0" />
                            Nota: Se le pedirá adjuntar este archivo manualmente al abrir WhatsApp.
                        </p>
                    )}
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
