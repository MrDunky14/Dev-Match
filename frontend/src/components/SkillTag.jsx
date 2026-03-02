const SKILL_COLORS = {
    // Frontend
    'React': 'cyan', 'Vue': 'cyan', 'Angular': 'cyan', 'JavaScript': 'orange',
    'TypeScript': 'blue', 'CSS': 'pink', 'Tailwind': 'cyan', 'HTML': 'orange',
    'Next.js': 'purple', 'Svelte': 'orange', 'p5.js': 'pink', 'Three.js': 'purple',

    // Backend
    'Node.js': 'cyan', 'Python': 'blue', 'FastAPI': 'cyan', 'Django': 'cyan',
    'Java': 'orange', 'Go': 'blue', 'Rust': 'orange', 'C++': 'blue',
    'Ruby': 'pink', 'PHP': 'purple',

    // Mobile
    'Flutter': 'blue', 'Dart': 'blue', 'Kotlin': 'purple', 'Swift': 'orange',
    'React Native': 'cyan',

    // Data / ML
    'TensorFlow': 'orange', 'PyTorch': 'pink', 'Pandas': 'blue',
    'Machine Learning': 'purple', 'NLP': 'pink', 'Computer Vision': 'cyan',
    'Hugging Face': 'orange', 'D3.js': 'orange', 'SQL': 'blue',

    // DevOps / Cloud
    'Docker': 'blue', 'Kubernetes': 'blue', 'AWS': 'orange', 'GCP': 'blue',
    'Terraform': 'purple', 'GitHub Actions': 'purple', 'Linux': 'orange',

    // Databases
    'MongoDB': 'cyan', 'PostgreSQL': 'blue', 'Firebase': 'orange',
    'Redis': 'pink', 'MySQL': 'blue',

    // Web3
    'Solidity': 'purple', 'Ethereum': 'purple', 'Web3.js': 'purple',
    'IPFS': 'cyan',

    // Design
    'Figma': 'pink', 'Blender': 'orange', 'UI/UX': 'pink',

    // Security
    'Networking': 'blue', 'Cryptography': 'purple',
};

export default function SkillTag({ skill, onClick, removable }) {
    const color = SKILL_COLORS[skill] || 'purple';

    return (
        <span
            className={`skill-tag ${color}`}
            onClick={onClick}
            style={onClick ? { cursor: 'pointer' } : {}}
        >
            {skill}
            {removable && <span style={{ marginLeft: 6, fontSize: '0.65rem' }}>✕</span>}
        </span>
    );
}
