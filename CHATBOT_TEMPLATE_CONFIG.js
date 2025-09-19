/**
 * 🤖 Intelligent Chatbot Bubble System - Template Configuration
 * 
 * This configuration file makes it easy to customize the chatbot system
 * for different projects without modifying the core implementation.
 * 
 * Usage:
 * 1. Include this file in your project
 * 2. Modify the configuration below
 * 3. Include the enhanced-chatbot-widget-fixed.js
 * 4. Initialize with: new EnhancedAgenticChatbotWidget(config)
 */

const CHATBOT_TEMPLATE_CONFIG = {
    // ===========================================
    // 🎨 VISUAL CONFIGURATION
    // ===========================================
    
    // Avatar Settings
    avatarType: 'assistant',                    // Avatar type identifier
    avatarName: 'Enhanced AI Assistant',        // Display name for avatar
    avatarImage: 'assets/relaxed-chatbot-final.gif', // Path to avatar image
    avatarColor: '#00ffee',                     // Primary color theme
    
    // Positioning
    position: 'bottom-right',                   // Avatar position: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    offsetX: 120,                               // Horizontal offset from edge (px)
    offsetY: 20,                                // Vertical offset from edge (px)
    
    // Bubble Positioning (relative to avatar mouth)
    bubbleOffsetAbove: 200,                     // Pixels above avatar mouth
    mouthPositionPercent: 40,                   // Mouth position (percent down from avatar top)
    
    // ===========================================
    // 🎭 BUBBLE STYLING
    // ===========================================
    
    // Bubble Appearance
    bubbleBackground: 'rgba(0, 0, 0, 0.7)',    // Translucent background
    bubbleBorder: '#ffffff',                    // Border color
    bubbleBorderWidth: '2px',                   // Border width
    bubbleTextColor: '#ffffff',                 // Text color
    
    // Bubble Sizing
    bubbleMaxWidth: '300px',                    // Maximum bubble width
    bubbleMinWidth: '200px',                    // Minimum bubble width
    bubblePadding: '15px 20px',                 // Internal padding
    
    // Bubble Animation
    bubbleAnimationDuration: 400,               // Animation duration (ms)
    bubbleAnimationEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Animation easing
    
    // Speech Tail
    tailColor: '#ffffff',                       // Speech tail color
    tailSize: '12px',                           // Speech tail size
    
    // ===========================================
    // ⏱️ TIMING CONFIGURATION
    // ===========================================
    
    // Display Duration
    bubbleTimeout: 5000,                        // How long bubble stays visible (ms)
    
    // Typing Animation
    typingSpeed: 50,                            // Speed of word-by-word typing (ms)
    
    // Animation Delays
    hideShowDelay: 500,                         // Delay between hide and show (ms)
    showAnimationDelay: 100,                    // Delay before showing animation (ms)
    hideAnimationDelay: 400,                    // Delay before hiding completely (ms)
    
    // Welcome Message
    welcomeDelay: 1000,                         // Delay before showing welcome message (ms)
    welcomeTimeout: 5000,                       // How long welcome message shows (ms)
    
    // ===========================================
    // 🔌 API CONFIGURATION
    // ===========================================
    
    // Endpoints
    enhancedEndpoint: 'http://localhost:8000/api/chat',  // Primary AI endpoint
    fallbackEndpoint: 'http://localhost:8000/api/chat',  // Fallback endpoint
    
    // Messages
    welcomeMessage: 'Hello! I\'m your Enhanced Agentic AI Assistant powered by LangGraph. How can I help you today? 🚀',
    placeholderText: 'Type your message...',
    thinkingMessage: 'Enhanced AI is thinking...',
    errorMessage: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
    
    // ===========================================
    // 🎛️ BEHAVIOR CONFIGURATION
    // ===========================================
    
    // Functionality
    autoOpen: false,                            // Auto-open chat on load
    showSuggestedActions: true,                 // Show suggested action buttons
    enableStatePersistence: true,               // Remember conversation state
    enableMultiAgent: true,                     // Enable multi-agent capabilities
    enableFeedbackLoops: true,                  // Enable feedback mechanisms
    
    // UI Elements
    showMouthIndicator: false,                  // Show blue dot at mouth (set to false as requested)
    showTypingDots: true,                       // Show animated typing dots
    showSpeechTail: true,                       // Show speech bubble tail
    
    // ===========================================
    // 📱 RESPONSIVE CONFIGURATION
    // ===========================================
    
    // Mobile Breakpoints
    mobileBreakpoint: 768,                      // Mobile breakpoint (px)
    smallMobileBreakpoint: 480,                 // Small mobile breakpoint (px)
    
    // Mobile Adjustments
    mobileBubbleOffsetAbove: 160,               // Mobile bubble offset (px)
    mobileBubbleMaxWidth: '250px',              // Mobile max width
    mobileBubbleMinWidth: '200px',              // Mobile min width
    
    // Small Mobile Adjustments
    smallMobileBubbleOffsetAbove: 140,          // Small mobile bubble offset (px)
    smallMobileBubbleMaxWidth: '200px',         // Small mobile max width
    smallMobileBubbleMinWidth: '180px',         // Small mobile min width
    
    // ===========================================
    // 🎨 THEME CONFIGURATION
    // ===========================================
    
    // Theme Options
    theme: 'dark',                              // Theme: 'dark', 'light', 'custom'
    customCSS: null,                            // Custom CSS overrides
    
    // Color Schemes
    colorSchemes: {
        dark: {
            bubbleBackground: 'rgba(0, 0, 0, 0.7)',
            bubbleBorder: '#ffffff',
            bubbleText: '#ffffff',
            tailColor: '#ffffff'
        },
        light: {
            bubbleBackground: 'rgba(255, 255, 255, 0.9)',
            bubbleBorder: '#000000',
            bubbleText: '#000000',
            tailColor: '#000000'
        },
        neon: {
            bubbleBackground: 'rgba(0, 0, 0, 0.8)',
            bubbleBorder: '#00ffee',
            bubbleText: '#00ffee',
            tailColor: '#00ffee'
        }
    },
    
    // ===========================================
    // 🔧 ADVANCED CONFIGURATION
    // ===========================================
    
    // Debug Options
    enableDebugLogs: true,                      // Enable console debugging
    enablePerformanceLogs: true,                // Enable performance monitoring
    logLevel: 'info',                           // Log level: 'debug', 'info', 'warn', 'error'
    
    // Performance
    enableAnimations: true,                     // Enable/disable animations
    enableTransitions: true,                    // Enable/disable transitions
    throttleEvents: true,                       // Throttle event handlers
    
    // Accessibility
    enableAriaLabels: true,                     // Enable ARIA labels
    enableKeyboardNavigation: true,             // Enable keyboard navigation
    announceMessages: false,                    // Announce messages to screen readers
    
    // ===========================================
    // 📊 ANALYTICS CONFIGURATION
    // ===========================================
    
    // Analytics (optional)
    enableAnalytics: false,                     // Enable analytics tracking
    analyticsProvider: null,                    // Analytics provider: 'google', 'mixpanel', 'custom'
    customAnalyticsFunction: null,              // Custom analytics function
    
    // Events to Track
    trackEvents: {
        messageSent: true,                      // Track message sending
        responseReceived: true,                 // Track AI responses
        bubbleShown: true,                      // Track bubble display
        errorOccurred: true                     // Track errors
    },
    
    // ===========================================
    // 🎯 CALLBACK FUNCTIONS
    // ===========================================
    
    // Event Handlers
    onOpen: null,                               // Called when chat opens
    onClose: null,                              // Called when chat closes
    onMessage: null,                            // Called when message is sent
    onResponse: null,                           // Called when response is received
    onError: null,                              // Called when error occurs
    
    // Custom Functions
    customMessageHandler: null,                 // Custom message processing
    customResponseHandler: null,                // Custom response processing
    customErrorHandler: null,                   // Custom error handling
    
    // ===========================================
    // 🚀 INITIALIZATION HELPERS
    // ===========================================
    
    /**
     * Get configuration for specific theme
     * @param {string} themeName - Theme name
     * @returns {object} Configuration object
     */
    getThemeConfig: function(themeName) {
        const theme = this.colorSchemes[themeName] || this.colorSchemes.dark;
        return {
            bubbleBackground: theme.bubbleBackground,
            bubbleBorder: theme.bubbleBorder,
            bubbleTextColor: theme.bubbleText,
            tailColor: theme.tailColor
        };
    },
    
    /**
     * Get mobile-specific configuration
     * @param {number} screenWidth - Current screen width
     * @returns {object} Mobile configuration
     */
    getMobileConfig: function(screenWidth) {
        if (screenWidth <= this.smallMobileBreakpoint) {
            return {
                bubbleOffsetAbove: this.smallMobileBubbleOffsetAbove,
                bubbleMaxWidth: this.smallMobileBubbleMaxWidth,
                bubbleMinWidth: this.smallMobileBubbleMinWidth
            };
        } else if (screenWidth <= this.mobileBreakpoint) {
            return {
                bubbleOffsetAbove: this.mobileBubbleOffsetAbove,
                bubbleMaxWidth: this.mobileBubbleMaxWidth,
                bubbleMinWidth: this.mobileBubbleMinWidth
            };
        }
        return {};
    },
    
    /**
     * Merge custom configuration with defaults
     * @param {object} customConfig - Custom configuration
     * @returns {object} Merged configuration
     */
    mergeConfig: function(customConfig) {
        return Object.assign({}, this, customConfig);
    }
};

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CHATBOT_TEMPLATE_CONFIG;
} else if (typeof window !== 'undefined') {
    window.CHATBOT_TEMPLATE_CONFIG = CHATBOT_TEMPLATE_CONFIG;
}

// Example usage:
/*
// Basic initialization
const chatbot = new EnhancedAgenticChatbotWidget(CHATBOT_TEMPLATE_CONFIG);

// Custom theme initialization
const neonConfig = CHATBOT_TEMPLATE_CONFIG.mergeConfig({
    theme: 'neon',
    avatarColor: '#ff00ff',
    bubbleTimeout: 7000
});
const neonChatbot = new EnhancedAgenticChatbotWidget(neonConfig);

// Mobile-optimized initialization
const mobileConfig = CHATBOT_TEMPLATE_CONFIG.mergeConfig(
    CHATBOT_TEMPLATE_CONFIG.getMobileConfig(window.innerWidth)
);
const mobileChatbot = new EnhancedAgenticChatbotWidget(mobileConfig);
*/

