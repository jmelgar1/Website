import { motion } from 'framer-motion';
import { FiCode, FiGithub, FiLinkedin } from 'react-icons/fi';

export default function Navbar() {
    return (
        <motion.nav
            className="fixed w-full z-50 backdrop-blur-md"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
        >
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <FiCode className="text-2xl text-blue-400" />
                    <span className="font-mono text-xl">ATL_DEV</span>
                </div>
                <div className="flex gap-6">
                    <a href="https://github.com" target="_blank">
                        <FiGithub className="text-xl hover:text-blue-400 transition" />
                    </a>
                    <a href="https://linkedin.com" target="_blank">
                        <FiLinkedin className="text-xl hover:text-blue-400 transition" />
                    </a>
                </div>
            </div>
        </motion.nav>
    );
}