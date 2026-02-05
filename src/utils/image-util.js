import { IMG_GEN_REPLACE_MAP } from '../data/images';

export const getImage = (key) => {
    // If the key is a prompt URL from catalog items like '/gen?prompt=...', extract the prompt
    if (key && key.startsWith('/gen?prompt=')) {
        const prompt = key.replace('/gen?prompt=', '');
        // The map keys in images.js are fully encoded or plain strings?
        // In the extracted file they are plain strings like "abstract black...&aspect=3:4"
        // The prompt in catalogItems has "+" for spaces. We need to decode it.
        const decodedPrompt = decodeURIComponent(prompt.replace(/\+/g, ' '));

        if (IMG_GEN_REPLACE_MAP[decodedPrompt]) {
            return IMG_GEN_REPLACE_MAP[decodedPrompt];
        }
        // Try without decoding if strict match failed (just in case)
        if (IMG_GEN_REPLACE_MAP[prompt]) {
            return IMG_GEN_REPLACE_MAP[prompt];
        }
    }

    // Direct key lookup
    if (IMG_GEN_REPLACE_MAP[key]) {
        return IMG_GEN_REPLACE_MAP[key];
    }

    // Fallback or let it pass if it's already a URL
    return key;
};

// Keys for static images based on analysis of example.html and prompts
export const STATIC_IMAGES = {
    MOLDURA_NEGRA: "/frames/sys-07-negra-contemporanea.png",
    MOLDURA_MADERA: "/frames/sys-02-roble-natural.png",
    MOLDURA_BLANCA: "/frames/sys-08-blanca-minimalista.png",
    MOLDURA_DORADA: "/frames/sys-05-dorada-clasica.jpg",

    GALLERY_LIVING: "/gallery/composicion-salon.png",
    GALLERY_BEDROOM: "/gallery/dormitorio-minimalista.png",
    GALLERY_WORKSHOP: "/gallery/taller-artesanal.png",

    SERVICES_MAIN: "/gallery/servicios-main.png", // New portrait gallery image
};
