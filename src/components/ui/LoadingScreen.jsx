import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900 overflow-hidden">
            <div className="relative w-32 h-32 md:w-48 md:h-48">
                {/* Sun */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_0_50px_rgba(245,158,11,0.5)]"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* The Shadow (Eclipse) */}
                <motion.div
                    className="absolute w-full h-full rounded-full bg-stone-900"
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{
                        x: ["-100%", "0%", "100%"],
                        opacity: [0, 1, 0], // Fade in as it approaches, solid in middle, fade out after
                        scale: [0.9, 1.02, 0.9] // Slightly larger to fully cover
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.5
                    }}
                />
            </div>

            {/* Text */}
            <motion.div
                className="mt-8 text-amber-50 font-light tracking-[0.5em] text-sm uppercase"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Sol y Sombra
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
