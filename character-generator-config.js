// Character Generator Configuration System
// For scalable deployment of different avatars

class CharacterGeneratorConfig {
    constructor() {
        this.templates = {
            // Pre-defined character templates
            'ai-assistant': {
                name: 'AI Assistant',
                avatarType: 'assistant',
                avatarColor: '#00ffee',
                welcomeMessage: 'Hello! I\'m your AI Assistant. How can I help you today? 🚀',
                placeholderText: 'Ask me anything...',
                theme: 'dark'
            },
            'business-coach': {
                name: 'Business Coach',
                avatarType: 'coach',
                avatarColor: '#4CAF50',
                welcomeMessage: 'Hi! I\'m your Business Coach. Let\'s grow your business together! 💼',
                placeholderText: 'Ask about business strategies...',
                theme: 'professional'
            },
            'creative-designer': {
                name: 'Creative Designer',
                avatarType: 'designer',
                avatarColor: '#FF6B6B',
                welcomeMessage: 'Hey! I\'m your Creative Designer. Let\'s make something amazing! 🎨',
                placeholderText: 'Tell me about your design needs...',
                theme: 'creative'
            },
            'tech-mentor': {
                name: 'Tech Mentor',
                avatarType: 'mentor',
                avatarColor: '#2196F3',
                welcomeMessage: 'Hello! I\'m your Tech Mentor. Ready to code? 💻',
                placeholderText: 'Ask about programming...',
                theme: 'tech'
            }
        };
    }

    // Generate configuration for a specific character
    generateConfig(characterType, customAvatar, customName = null) {
        const template = this.templates[characterType] || this.templates['ai-assistant'];
        
        return {
            avatarType: template.avatarType,
            avatarName: customName || template.name,
            avatarImage: customAvatar,
            avatarColor: template.avatarColor,
            position: 'bottom-right',
            offsetX: 20,
            offsetY: 20,
            theme: template.theme,
            welcomeMessage: template.welcomeMessage,
            placeholderText: template.placeholderText,
            autoOpen: false,
            typingSpeed: 50,
            bubbleTimeout: 5000,
            apiEndpoint: null,
            onMessage: null,
            onOpen: null,
            onClose: null
        };
    }

    // Generate HTML snippet for embedding
    generateEmbedCode(characterType, customAvatar, customName = null) {
        const config = this.generateConfig(characterType, customAvatar, customName);
        
        return `
<!-- Character Generator Widget -->
<link rel="preload" href="${customAvatar}" as="image" type="image/gif">
<script>
    // Preload the avatar immediately
    const preloadAvatar = new Image();
    preloadAvatar.src = '${customAvatar}';
    preloadAvatar.onload = () => console.log('🚀 [PRELOAD] Avatar loaded successfully');
    preloadAvatar.onerror = () => console.error('❌ [PRELOAD] Avatar failed to load');
</script>
<script src="https://your-domain.com/character-generator-widget.js?v=45"></script>
<script>
    // Initialize Character Generator
    document.addEventListener('DOMContentLoaded', () => {
        new ChatbotWidget(${JSON.stringify(config, null, 2)});
    });
</script>
<!-- End Character Generator Widget -->
        `.trim();
    }

    // Generate deployment package
    generateDeploymentPackage(characterType, customAvatar, customName = null, targetDomain = null) {
        const config = this.generateConfig(characterType, customAvatar, customName);
        const embedCode = this.generateEmbedCode(characterType, customAvatar, customName);
        
        return {
            config: config,
            embedCode: embedCode,
            installation: {
                steps: [
                    '1. Upload your avatar GIF to your server',
                    '2. Copy the embed code below',
                    '3. Paste it into your website\'s <head> section',
                    '4. The character will appear automatically!'
                ],
                requirements: [
                    'Modern web browser',
                    'HTTPS connection (for service worker)',
                    'Avatar GIF file (recommended: < 3MB)'
                ]
            },
            customization: {
                avatarImage: customAvatar,
                avatarName: customName || config.avatarName,
                avatarColor: config.avatarColor,
                position: config.position,
                theme: config.theme
            }
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CharacterGeneratorConfig };
} else {
    window.CharacterGeneratorConfig = CharacterGeneratorConfig;
}
