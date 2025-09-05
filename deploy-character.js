#!/usr/bin/env node

// Character Generator Deployment CLI
// Usage: node deploy-character.js <character-type> <avatar-url> [custom-name]

const fs = require('fs');
const path = require('path');

class CharacterDeployer {
    constructor() {
        const CharacterGeneratorConfig = require('./character-generator-config.js').CharacterGeneratorConfig;
        this.generator = new CharacterGeneratorConfig();
    }

    async deploy(characterType, avatarUrl, customName = null) {
        console.log('🚀 Character Generator Deployment Tool');
        console.log('=====================================');
        
        try {
            // Validate inputs
            this.validateInputs(characterType, avatarUrl);
            
            // Generate deployment package
            const deploymentPackage = this.generator.generateDeploymentPackage(characterType, avatarUrl, customName);
            
            // Create deployment files
            await this.createDeploymentFiles(deploymentPackage, characterType, customName);
            
            // Display results
            this.displayResults(deploymentPackage, characterType, customName);
            
        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            process.exit(1);
        }
    }

    validateInputs(characterType, avatarUrl) {
        if (!characterType) {
            throw new Error('Character type is required');
        }
        
        if (!avatarUrl) {
            throw new Error('Avatar URL is required');
        }
        
        // Validate avatar URL format
        if (!avatarUrl.match(/\.(gif|webp|png|jpg|jpeg)$/i)) {
            throw new Error('Avatar must be an image file (gif, webp, png, jpg, jpeg)');
        }
        
        console.log('✅ Input validation passed');
    }

    async createDeploymentFiles(deploymentPackage, characterType, customName) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const deploymentDir = `deployments/${characterType}-${timestamp}`;
        
        // Create deployment directory
        if (!fs.existsSync('deployments')) {
            fs.mkdirSync('deployments');
        }
        fs.mkdirSync(deploymentDir, { recursive: true });
        
        // Create deployment files
        const files = {
            'config.json': JSON.stringify(deploymentPackage.config, null, 2),
            'embed-code.html': deploymentPackage.embedCode,
            'installation.md': this.generateInstallationGuide(deploymentPackage),
            'deployment-info.json': JSON.stringify({
                characterType,
                customName,
                avatarUrl: deploymentPackage.config.avatarImage,
                deployedAt: new Date().toISOString(),
                version: '1.0.0'
            }, null, 2)
        };
        
        // Write files
        for (const [filename, content] of Object.entries(files)) {
            const filepath = path.join(deploymentDir, filename);
            fs.writeFileSync(filepath, content);
            console.log(`📄 Created: ${filepath}`);
        }
        
        console.log(`📁 Deployment package created in: ${deploymentDir}`);
    }

    generateInstallationGuide(deploymentPackage) {
        return `# Character Generator Installation Guide

## Quick Installation

${deploymentPackage.installation.steps.map(step => step).join('\n')}

## Requirements

${deploymentPackage.installation.requirements.map(req => `- ${req}`).join('\n')}

## Embed Code

Copy and paste this code into your website's <head> section:

\`\`\`html
${deploymentPackage.embedCode}
\`\`\`

## Customization

- **Avatar Image**: ${deploymentPackage.customization.avatarImage}
- **Character Name**: ${deploymentPackage.customization.avatarName}
- **Theme Color**: ${deploymentPackage.customization.avatarColor}
- **Position**: ${deploymentPackage.customization.position}
- **Theme**: ${deploymentPackage.customization.theme}

## Support

For support, contact: support@your-domain.com
`;
    }

    displayResults(deploymentPackage, characterType, customName) {
        console.log('\n🎉 Deployment Successful!');
        console.log('========================');
        console.log(`Character Type: ${characterType}`);
        console.log(`Avatar URL: ${deploymentPackage.config.avatarImage}`);
        console.log(`Character Name: ${deploymentPackage.config.avatarName}`);
        console.log(`Theme Color: ${deploymentPackage.config.avatarColor}`);
        console.log(`Welcome Message: ${deploymentPackage.config.welcomeMessage}`);
        
        console.log('\n📋 Next Steps:');
        console.log('1. Upload your avatar GIF to your server');
        console.log('2. Copy the embed code from embed-code.html');
        console.log('3. Paste it into your website\'s <head> section');
        console.log('4. Test the character on your website');
        
        console.log('\n🚀 Your character will be live instantly!');
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('Usage: node deploy-character.js <character-type> <avatar-url> [custom-name]');
        console.log('\nCharacter Types:');
        console.log('- ai-assistant');
        console.log('- business-coach');
        console.log('- creative-designer');
        console.log('- tech-mentor');
        console.log('\nExample:');
        console.log('node deploy-character.js ai-assistant https://example.com/avatar.gif "My AI Helper"');
        process.exit(1);
    }
    
    const [characterType, avatarUrl, customName] = args;
    const deployer = new CharacterDeployer();
    
    await deployer.deploy(characterType, avatarUrl, customName);
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = CharacterDeployer;
