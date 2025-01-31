import { motion } from 'framer-motion';
import {FiArrowUpRight} from "react-icons/fi";

export default function ProjectCard({ title, tech, description, link }) {
    return (
        <motion.div
            className="bg-white/5 rounded-xl p-6 backdrop-blur-lg border border-white/10 hover:border-blue-400 transition-all"
            whileHover={{ scale: 1.05 }}
        >
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
                {tech.map((t, i) => (
                    <span
                        key={i}
                        className="px-2 py-1 text-sm rounded-full bg-blue-400/20 text-blue-400"
                    >
            {t}
          </span>
                ))}
            </div>
            <p className="text-gray-300 mb-4">{description}</p>
            <a
                href={link}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
                View Project
                <FiArrowUpRight className="inline-block" />
            </a>
        </motion.div>
    );
}