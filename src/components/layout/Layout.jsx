import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';
import StructuredData from '../seo/StructuredData';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen relative">
            <StructuredData />
            <Navbar />
            <main className="flex-grow pt-32 pb-12 container mx-auto px-4 lg:px-8 max-w-7xl animate-in fade-in duration-500">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default Layout;
