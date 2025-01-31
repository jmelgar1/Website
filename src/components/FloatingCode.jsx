import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const FloatingCode = () => {
    const languages = ['<React />', 'Python', 'Node.js', 'AWS', 'Docker', 'SQL'];

    return (
        <group>
            {languages.map((lang, i) => (
                <Text
                    key={i}
                    position={[
                        Math.random() * 10 - 5,
                        Math.random() * 10 - 5,
                        Math.random() * -10
                    ]}
                    fontSize={0.5}
                    color="#4f46e5"
                    font="/fonts/FiraCode.woff"
                >
                    {lang}
                </Text>
            ))}
        </group>
    );
};