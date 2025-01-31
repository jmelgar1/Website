import { TypeAnimation } from 'react-type-animation';
import FloatingCode from '../components/FloatingCode';

export default function Hero() {
    return (
        <section className="min-h-screen relative flex items-center justify-center">
            <FloatingCode />
            <div className="z-10 text-center">
                <h1 className="text-5xl font-bold mb-4">Hey, I'm [Your Name]</h1>
                <div className="text-2xl mb-8">
                    <TypeAnimation
                        sequence={[
                            'Full Stack Developer',
                            2000,
                            'UI/UX Enthusiast',
                            2000,
                            'Tech Explorer',
                            2000,
                        ]}
                        repeat={Infinity}
                    />
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full text-lg font-semibold transition-all">
                    View My Work
                </button>
            </div>
        </section>
    );
}