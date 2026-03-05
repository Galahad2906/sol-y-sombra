import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, keywords, name, type, image, url }) => {
    const siteUrl = 'https://solysombrasrl.com';
    const currentUrl = url || typeof window !== 'undefined' ? window.location.href : siteUrl;
    const defaultImage = `${siteUrl}/gallery/composicion-salon.png`;
    const currentImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{title} | Sol y Sombra</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={currentImage} />
            <meta property="og:url" content={currentUrl} />

            {/* Twitter */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={currentImage} />

            {/* Language */}
            <html lang="es" />
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string
};

SEO.defaultProps = {
    title: 'Sol y Sombra',
    description: 'Sol y Sombra - Cuadros a medida, enmarcado de fotos y decoración en Asunción, Paraguay.',
    keywords: 'marcos para cuadros, cuadros a medida, encuadrar fotos paraguay, cuadros decorativos, arte paraguay, asuncion, enmarcados cerca de mi, galeria',
    name: 'Sol y Sombra',
    type: 'website',
    image: null,
    url: null
};

export default SEO;
