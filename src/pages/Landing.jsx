import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Home as HomeIcon, Grid3X3, Grid2X2, Image as ImageIcon, Calculator } from 'lucide-react';
import SEO from '../components/seo/SEO';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
};

const Landing = () => {
    const { t } = useLanguage();

    const links = [
        { to: "/inicio", icon: HomeIcon, label: 'nav_home', desc: 'desc_home', bg: "bg-gray-100", hoverBg: "hover:bg-gray-50", iconColor: "text-gray-400" },
        { to: "/molduras", icon: Grid2X2, label: 'nav_molduras', desc: 'desc_molduras', bg: "bg-gray-200", hoverBg: "hover:bg-gray-100", iconColor: "text-gray-500" },
        { to: "/galeria", icon: ImageIcon, label: 'nav_gallery', desc: 'desc_gallery', bg: "bg-gray-400", hoverBg: "hover:bg-gray-300", iconColor: "text-gray-700" },
        { to: "/servicios", icon: Calculator, label: 'nav_services', desc: 'desc_services', bg: "bg-gray-500", hoverBg: "hover:bg-gray-400", iconColor: "text-white" },
    ];

    return (
        <div className="h-auto md:h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
            <SEO
                title="Bienvenido"
                description="Sol y Sombra - Arte y Enmarcados en Asunción. Encuentra el marco perfecto para tus obras."
                keywords="enmarcados, cuadros, asuncion, paraguay, arte, molduras"
            />
            <motion.div
                className="flex flex-col md:flex-row w-full flex-grow gap-0 md:gap-0 shadow-xl rounded-sm overflow-hidden border border-gray-200"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {links.map((link, index) => {
                    const Icon = link.icon;
                    return (
                        <motion.div
                            key={link.to}
                            className={`flex-1 ${link.bg} ${link.hoverBg} border-b md:border-b-0 md:border-r border-white/20 transition-colors duration-300 relative group overflow-hidden`}
                            variants={itemVariants}
                            whileHover={{ flexGrow: 1.5, transition: { duration: 0.4, ease: "easeOut" } }}
                        >
                            <Link to={link.to} className="flex flex-row md:flex-col items-center justify-start md:justify-start md:pt-36 p-6 h-full w-full">
                                <Icon className={`w-8 h-8 md:w-10 md:h-10 mb-0 md:mb-4 mr-4 md:mr-0 ${link.iconColor} group-hover:text-black transition-colors duration-300 transform group-hover:scale-110`} />
                                <div className="flex flex-col items-start md:items-center relative z-10">
                                    <h2 className={`text-2xl font-serif font-bold md:writing-vertical-upright md:my-4 tracking-widest uppercase ${link.iconColor === 'text-white' ? 'text-white' : 'text-black'} group-hover:text-black transition-colors duration-300`}>
                                        {t(link.label)}
                                    </h2>
                                    <motion.p
                                        className={`text-sm ${link.iconColor === 'text-white' ? 'text-gray-100' : 'text-gray-600'} md:hidden mt-1`}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                    >
                                        {t(link.desc)}
                                    </motion.p>
                                    <motion.p
                                        className="hidden md:block text-sm text-gray-800 mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute top-full w-64"
                                    >
                                        {t(link.desc)}
                                    </motion.p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default Landing;
