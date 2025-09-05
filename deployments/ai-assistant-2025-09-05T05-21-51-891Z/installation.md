# Character Generator Installation Guide

## Quick Installation

1. Upload your avatar GIF to your server
2. Copy the embed code below
3. Paste it into your website's <head> section
4. The character will appear automatically!

## Requirements

- Modern web browser
- HTTPS connection (for service worker)
- Avatar GIF file (recommended: < 3MB)

## Embed Code

Copy and paste this code into your website's <head> section:

```html
<!-- Character Generator Widget -->
<link rel="preload" href="assets/20250821-1758-Relaxed-Chatbot--unscreen-ezgif.com-apng-to-gif-converter.gif" as="image" type="image/gif">
<script>
    // Preload the avatar immediately
    const preloadAvatar = new Image();
    preloadAvatar.src = 'assets/20250821-1758-Relaxed-Chatbot--unscreen-ezgif.com-apng-to-gif-converter.gif';
    preloadAvatar.onload = () => console.log('🚀 [PRELOAD] Avatar loaded successfully');
    preloadAvatar.onerror = () => console.error('❌ [PRELOAD] Avatar failed to load');
</script>
<script src="https://your-domain.com/character-generator-widget.js?v=45"></script>
<script>
    // Initialize Character Generator
    document.addEventListener('DOMContentLoaded', () => {
        new ChatbotWidget({
  "avatarType": "assistant",
  "avatarName": "Test Character",
  "avatarImage": "assets/20250821-1758-Relaxed-Chatbot--unscreen-ezgif.com-apng-to-gif-converter.gif",
  "avatarColor": "#00ffee",
  "position": "bottom-right",
  "offsetX": 20,
  "offsetY": 20,
  "theme": "dark",
  "welcomeMessage": "Hello! I'm your AI Assistant. How can I help you today? 🚀",
  "placeholderText": "Ask me anything...",
  "autoOpen": false,
  "typingSpeed": 50,
  "bubbleTimeout": 5000,
  "apiEndpoint": null,
  "onMessage": null,
  "onOpen": null,
  "onClose": null
});
    });
</script>
<!-- End Character Generator Widget -->
```

## Customization

- **Avatar Image**: assets/20250821-1758-Relaxed-Chatbot--unscreen-ezgif.com-apng-to-gif-converter.gif
- **Character Name**: Test Character
- **Theme Color**: #00ffee
- **Position**: bottom-right
- **Theme**: dark

## Support

For support, contact: support@your-domain.com
