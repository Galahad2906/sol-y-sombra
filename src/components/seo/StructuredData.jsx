import { Helmet } from 'react-helmet-async';

const StructuredData = () => {
    const data = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Sol y Sombra SRL",
        "image": "https://solysombrasrl.com/gallery/composicion-salon.png",
        "description": "Enmarcados personalizados y galería de arte en Asunción, Paraguay. Calidad artesanal y la mayor variedad de molduras.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Aviadores del Chaco y Molas López",
            "addressLocality": "Asunción",
            "addressRegion": "Asunción",
            "postalCode": "001401",
            "addressCountry": "PY"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-25.2818",
            "longitude": "-57.5564"
        },
        "url": "https://solysombrasrl.com",
        "telephone": "+595 981 566 651",
        "email": "arteyenmarcados@gmail.com",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "08:00",
                "closes": "18:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "08:00",
                "closes": "12:00"
            }
        ],
        "priceRange": "$$"
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(data)}
            </script>
        </Helmet>
    );
};

export default StructuredData;
