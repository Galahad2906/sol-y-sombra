import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Paintbrush } from 'lucide-react';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center mix-blend-difference"
            animate={{
                x: mousePosition.x - 12, // Offset half of the icon size
                y: mousePosition.y - 12,
                scale: isHovered ? 1.4 : 1,
                opacity: isHovered ? 1 : 0.6,
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
        >
            <Paintbrush
                size={24}
                className="text-brand-gold"
                style={{
                    // Rotate the brush slightly when hovered as if it's painting
                    transform: isHovered ? 'rotate(-45deg)' : 'rotate(-15deg)',
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            />
        </motion.div>
    );
};

export default CustomCursor;
